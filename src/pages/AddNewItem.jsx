import { useState } from "react";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { db, storage } from "../firebase.config";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddNewItem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  const MAX_WIDTH = 1080;

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        MAX_WIDTH,
        MAX_WIDTH,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    });

  const handlePhotoChange = async (e) => {
    const photoList = [];
    setPhotoPreview([]);
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("Please select a JPEG or PNG image.");
        return;
      }
      const resizedFile = await resizeFile(file);
      photoList.push({ name: file.name, data: resizedFile });

      if (resizeFile) {
        const reader = new FileReader();
        reader.readAsDataURL(resizedFile);
        reader.onload = () => {
          setPhotoPreview((prevPreview) => [...prevPreview, reader.result]);
        };
      }
    }

    setImages(photoList);
  };

  const uploadPhotosAndGetUrls = async (files, collectionPath) => {
    const urls = [];

    try {
      await Promise.all(
        files.map(async (file) => {
          let fileName = `${collectionPath}/${file.name}`;

          const storageRef = ref(storage, fileName);

          const fileExists = await getMetadata(storageRef)
            .then(() => true)
            .catch(() => false);

          if (fileExists) {
            const timestamp = new Date().getTime();
            const randomString = Math.random().toString(36).substring(2, 8);
            fileName = `${collectionPath}/${timestamp}_${randomString}_${file.name}`;
          }

          const newStorageRef = ref(storage, fileName);

          const snapshot = await uploadBytes(newStorageRef, file.data);
          console.log("Uploaded a file successfully!");

          const url = await getDownloadURL(newStorageRef);
          urls.push(url);
        })
      );

      return urls;
    } catch (error) {
      console.error("Failed to upload file. Error: ", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !quantity) {
      if (window.confirm("Please enter the necessary fields.")) {
        return;
      }
    }

    const collectionPath = "2023/items/items";
    const collectionRef = collection(db, collectionPath);

    // // Upload images to storage and get URLs
    let urls = [];
    if (images) {
      try {
        urls = await uploadPhotosAndGetUrls(images, collectionPath);
        console.log("URLS", urls);
      } catch (error) {
        console.error("Failed to upload file. Error: ", error);
      }
    }

    // Add product data and image URLs to firestore
    const product = {
      name,
      description,
      price,
      quantity,
      imageUrls: urls,
      createdAt: serverTimestamp(),
    };
    console.log("product", product);
    try {
      await addDoc(collectionRef, product);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding item");
    }

    // Reset state
    setName("");
    setDescription("");
    setPrice(0);
    setQuantity("");
    setImages([]);
    setImageUrls([]);
    setPhotoPreview([]);
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.value = "";
    toast.success("Item added successfully!");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div>
        <button className="btn btn-primary mb-8" onClick={handleGoBack}>
          {" "}
          {`< Go back to dashboard`}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-lg font-bold">Name*</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-lg font-bold">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md p-2 resize-none h-32"
          ></textarea>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-lg font-bold">Price</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-lg font-bold">Quantity*</span>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-lg font-bold">Images</span>
          <input
            type="file"
            multiple
            onChange={handlePhotoChange}
            className="border border-gray-300 rounded-md p-2"
          />
        </label>
        {photoPreview.length !== 0 && (
          <div className="grid grid-cols-3 gap-4">
            {photoPreview.map((photo, index) => {
              return (
                <img
                  key={index}
                  src={photo}
                  alt="Preview"
                  className="w-full h-auto"
                />
              );
            })}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition duration-300"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddNewItem;