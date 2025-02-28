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
  const [catRef, setCatRef] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [images, setImages] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const eventID = process.env.REACT_APP_EVENT_ID;

  const collectionPath = `${eventID}/items/items`;
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

    setIsLoading(true);

    // // Upload images to storage and get URLs
    let urls = [];
    if (images) {
      try {
        urls = await uploadPhotosAndGetUrls(images, collectionPath);
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
    } finally {
      setIsLoading(false);
    }

    // Reset state
    setName("");
    setCatRef("");
    setDescription("");
    setPrice(0);
    setQuantity(0);
    setImages([]);
    setImageUrls([]);
    setPhotoPreview([]);
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.value = "";
    toast.success("Item added successfully!");
  };

  const handleEdit = async () => {
    if (!name || !quantity) {
      if (window.confirm("Please enter the necessary fields.")) {
        return;
      }
    }

    setIsLoading(true);

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

    try {
      await updateDoc(documentRef, updatedData);
      setShowModal(false);
      toast.success("Item updated successfully!");
    } catch (e) {
      toast.error("Error updating item");
    } finally {
      setIsLoading(false);
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

  // Add this new function to handle drag start
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("imageIndex", index);
  };

  // Add this new function to handle drop
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("imageIndex"));

    if (dragIndex === dropIndex) return;

    // Reorder photoPreview array
    const newPhotoPreview = [...photoPreview];
    const draggedItem = newPhotoPreview[dragIndex];
    newPhotoPreview.splice(dragIndex, 1);
    newPhotoPreview.splice(dropIndex, 0, draggedItem);
    setPhotoPreview(newPhotoPreview);

    // Reorder images array if it exists
    if (images.length > 0) {
      const newImages = [...images];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      setImages(newImages);
    }

    // Reorder imageUrls array if it exists
    if (imageUrls.length > 0) {
      const newImageUrls = [...imageUrls];
      const draggedUrl = newImageUrls[dragIndex];
      newImageUrls.splice(dragIndex, 1);
      newImageUrls.splice(dropIndex, 0, draggedUrl);
      setImageUrls(newImageUrls);
    }
  };

  // Add this function to handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Add this function to handle image deletion
  const handleDeleteImage = (index) => {
    // Create copies of the arrays
    const newPhotoPreview = [...photoPreview];
    const newImages = [...images];
    const newImageUrls = [...imageUrls];

    // Remove the item at the specified index
    newPhotoPreview.splice(index, 1);

    // Only modify arrays that have content
    if (newImages.length > 0) {
      newImages.splice(index, 1);
    }

    if (newImageUrls.length > 0) {
      newImageUrls.splice(index, 1);
    }

    // Update state with the new arrays
    setPhotoPreview(newPhotoPreview);
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

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
        <span className="text-lg font-bold">Category*</span>
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
          min={0}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-lg font-bold">Quantity*</span>
        <input
          type="number"
          value={quantity}
          min={0}
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
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              Drag and drop images to reorder them
            </span>
          </p>
          <div className="grid grid-cols-3 gap-4">
            {photoPreview.map((photo, index) => {
              return (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="relative cursor-move border-2 border-transparent hover:border-blue-500 rounded-md transition-all group"
                >
                  {/* Drag handle icon */}
                  <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 rounded-br-md flex items-center">
                    <span>{index + 1}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <img
                    src={photo}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className={`${
          isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-700"
        } text-white rounded-md py-2 px-4 transition duration-300 flex justify-center items-center`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {submitType === "edit" ? "Updating..." : "Adding..."}
          </>
        ) : submitType === "edit" ? (
          "Update"
        ) : (
          "Add"
        )}
      </button>
    </form>
  );
}

export default ItemForm;
