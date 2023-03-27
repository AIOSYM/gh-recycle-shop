import { createContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [itemsLoading, setItemsLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  const itemCollectionPath = "2023/items/items";
  const userCollectionPath = "2023/users/users";

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  // fetching the data from firbase
  const fetchItems = async () => {
    //console.log("API CALL:ItemContext");
    try {
      const itemsRef = collection(db, itemCollectionPath);
      const q = query(itemsRef, orderBy("name", "asc"));

      // Execute query
      const querySnap = await getDocs(q);

      const items = [];

      querySnap.forEach((doc) => {
        return items.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setItems(items);
      setItemsLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  // fetching a user from firestore
  const fetchUserData = async () => {
    //console.log("API CALL:ItemContext");
    const auth = getAuth();
    setUser(auth.currentUser);

    const docRef = doc(db, userCollectionPath, auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
      setUserLoading(false);
    } else {
      toast.error("Cannot fetch user");
    }
  };

  // fetch single item
  const fetchSingleItem = async (itemId) => {
    const docRef = doc(db, itemCollectionPath, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSingleItem(docSnap.data());
    } else {
      toast.error("Cannot fetch an item");
    }
  };

  const isAddedToWishList = (itemId) => {
    const wantedItems = Array.from(userData.wantedItems);
    const isFound = wantedItems.includes(itemId);
    return isFound;
  };

  const handleWishListButton = async (itemId) => {
    // Update user
    const userDataCopy = { ...userData };
    const wantedItems = Array.from(userDataCopy.wantedItems);
    if (!wantedItems.includes(itemId)) {
      userDataCopy.wantedItems.push(itemId);
    } else {
      userDataCopy.wantedItems = userDataCopy.wantedItems.filter(
        (id) => id !== itemId
      );
    }
    //console.log("API CALL:ItemContext(write)");
    const docRef = doc(db, userCollectionPath, user.uid);
    await updateDoc(docRef, userDataCopy);
    setUserData(userDataCopy);

    // // Update item

    // const item = items.filter((item) => {
    //   return item.id === itemId;
    // });

    // if (item[0].data.wantedBy.includes(user.uid)) {
    //   const newWantedBy = item[0].data.wantedBy.filter(
    //     (userId) => userId !== user.uid
    //   );
    //   item[0].data.wantedBy = newWantedBy;
    // } else {
    //   const newWantedBy = [...item[0].data.wantedBy, user.uid];
    //   console.log(newWantedBy);
    //   item[0].data.wantedBy = newWantedBy;
    // }
    // const docRefItem = doc(db, "items", itemId);
    // await updateDoc(docRefItem, item[0].data);
    // console.log(items);
    // setItems(items);
  };

  return (
    <ItemContext.Provider
      value={{
        items,
        itemsLoading,
        userLoading,
        isAddedToWishList,
        handleWishListButton,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export default ItemContext;
