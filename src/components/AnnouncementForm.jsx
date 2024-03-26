/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import moment from "moment";

function getLocaleDateTime(currentDate) {
  return moment(new Date(currentDate)).format().slice(0, 16);
}

function getISODateTime(currentDate) {
  return moment(new Date(currentDate)).toISOString();
}

export default function AnnouncementForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("Google Meet");
  const [url, setURL] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const eventID = process.env.REACT_APP_EVENT_ID;

  const handleSelectChange = (event) => {
    setPlatform(event.target.value);
  };

  const documentPath = `${eventID}/announcement`;
  const handleEdit = async () => {
    if (!name || !email || !platform || !url || !date) {
      if (window.confirm("Please enter the necessary fields.")) {
        return;
      }
    }
    const documentRef = doc(db, documentPath);

    let updatedData = {
      name,
      email,
      platform,
      url,
      date: getISODateTime(date),
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(documentRef, updatedData);
      toast.success("Item updated successfully!");
    } catch (e) {
      toast.error("Error updating item");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEdit();
  };

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, documentPath);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setEmail(data.email);
          setPlatform(data.platform);
          setURL(data.url);
          setDate(getLocaleDateTime(data.date));
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Cannot fetch");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, []);

  if (isLoading) <div>Loading..</div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-lg font-bold">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-lg font-bold">Email</span>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
          className="border border-gray-300 rounded-md p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-lg font-bold">Platform</span>

        <select
          value={platform}
          onChange={handleSelectChange}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="Google Meet">Google Meet</option>
          <option value="Zoom">Zoom</option>
          <option value="Microsoft Teams">Microsoft Teams</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-lg font-bold">URL</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-lg font-bold">Date and Time</span>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          className="border border-gray-300 rounded-md p-2 max-w-lg"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition duration-300"
      >
        Update
      </button>
    </form>
  );
}
