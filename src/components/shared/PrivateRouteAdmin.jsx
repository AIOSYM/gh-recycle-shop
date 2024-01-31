import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";

const PrivateRouteAdmin = () => {
  const { loggedIn, checkingStatus, user } = useAuthStatus();
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

  if (checkingStatus || isFetching) {
    return <h1></h1>;
  }

  return loggedIn && adminEmails.includes(user.email) ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default PrivateRouteAdmin;
