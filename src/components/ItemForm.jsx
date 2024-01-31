/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  updateDoc,
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
import { useCallback } from "react";

function ItemForm({ submitType, id, setShowModal, setUpdateCount }) {
  const [name, setName] = useState("");
  const [catRef, setCatRef] = useState("other");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const collectionPath = "2024/items/items";
  const collectionRef = collection(db, collectionPath);

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

  const handleAddNew = async () => {
    if (!name || !quantity) {
      if (window.confirm("Please enter the necessary fields.")) {
        return;
      }
    }
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
    if (urls.length === 0) {
      urls = [
        "https://plus.unsplash.com/premium_photo-1679341705517-67f35920eec5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ];
    }

    // Add product data and image URLs to firestore
    const product = {
      name,
      catRef,
      description,
      price,
      quantity,
      imageUrls: urls,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collectionRef, product);
    } catch (error) {
      toast.error("Error adding item");
    }

    // Reset state
    setName("");
    setCatRef("other");
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

  const handleEdit = async () => {
    console.log({ name, imageUrls });

    if (!name || !quantity) {
      if (window.confirm("Please enter the necessary fields.")) {
        return;
      }
    }

    console.log({ collectionRef, id });
    const documentRef = doc(collectionRef, id);

    let updatedData = {
      name,
      catRef,
      description,
      price,
      quantity,
      imageUrls: imageUrls,
      updatedAt: serverTimestamp(),
    };

    console.log("BEFORE", updatedData);

    // // Upload images to storage and get URLs
    let urls = [];
    if (images) {
      try {
        urls = await uploadPhotosAndGetUrls(images, collectionPath);
        if (urls.length > 0) {
          updatedData = {
            ...updatedData,
            imageUrls: [...urls],
          };
        }
      } catch (error) {
        console.error("Failed to upload file. Error: ", error);
      }
    }

    console.log(updatedData);
    try {
      await updateDoc(documentRef, updatedData);
      setShowModal(false);
      toast.success("Item updated successfully!");
    } catch (e) {
      toast.error("Error updating item");
    }
    setUpdateCount((prevCount) => prevCount + 1);
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (submitType === "edit") {
        handleEdit();
      } else {
        handleAddNew();
      }
    },
    [submitType, handleAddNew, handleEdit]
  );

  useEffect(() => {
    if (submitType === "edit" && id) {
      const fetchItem = async () => {
        const docRef = doc(db, collectionPath, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setCatRef(data.catRef);
          setDescription(data.description);
          setPrice(data.price);
          setQuantity(data.quantity);
          setImageUrls(data.imageUrls);
          setPhotoPreview(data.imageUrls);
        } else {
          console.log("No such document!");
        }
      };
      fetchItem();
    }
  }, [id]);

  return (
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
        <span className="text-lg font-bold">Category</span>
        <input
          type="text"
          value={catRef}
          onChange={(e) => setCatRef(e.target.value.toLowerCase().trim())}
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
        {submitType === "edit" ? "Update" : "Add"}
      </button>
    </form>
  );
}

export default ItemForm;
