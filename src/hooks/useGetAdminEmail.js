import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config.js";
import { useState, useEffect } from "react";

export default function useGetAdminEmail() {
  const [adminEmails, setAdminEmails] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const getAdminEmails = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "2024/admins/admins")
        );
        const adminEmails = [];
        querySnapshot.forEach((doc) => {
          adminEmails.push(doc.data().email);
        });
        setAdminEmails(adminEmails);
      } catch (err) {
        console.log(err);
      }
      setIsFetching(false);
    };
    getAdminEmails();
  }, []);
  return { adminEmails, isFetching };
}
