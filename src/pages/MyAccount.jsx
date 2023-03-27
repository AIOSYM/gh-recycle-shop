import { useEffect, useState } from "react";
import WishListCard from "../components/WishListCard";
import Navbar from "../components/layout/Navbar";
import { toast } from "react-toastify";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase.config";
import { useAuthStatus } from "../hooks/useAuthStatus";

import WishListGrid from "../components/WishListGrid";

function MyAccount() {
  const { user } = useAuthStatus();
  const [userData, setUserData] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [loadItems, setLoadItems] = useState(true);

  const itemCollectionPath = "2023/items/items";
  const userCollectionPath = "2023/users/users";

  useEffect(() => {
    const fetchItems = async () => {
      //console.log("API CALL:MyAccount");
      try {
        const querySnap = await getDocs(collection(db, itemCollectionPath));
        const items = [];
        querySnap.forEach((doc) => {
          return items.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setAllItems(items);
        setLoadItems(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchSingleUser = async () => {
      if (user) {
        //console.log("API CALL:MyAccount");
        try {
          const docRef = doc(db, userCollectionPath, user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            //console.log(docSnap.data());
          } else {
            toast.error("Cannot fetch user account");
          }
        } catch (error) {
          toast.error("Cannot fetch user account");
        }
      }
    };
    fetchSingleUser();
  }, [user]);

  let wishListItems = [];
  let winningItemsId = [];
  if (loadItems || !userData) {
    return <h1></h1>;
  } else {
    const wantedItems = Array.from(userData.wantedItems);
    winningItemsId = Array.from(userData.winningItems);
    //console.log(winningItemsId);
    wishListItems = wantedItems.map((id) => {
      return allItems.filter((item) => item.id === id).shift();
    });
  }

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="h-full pb-16 overflow-y-auto">
        <div className="container px-6 mx-auto grid">
          <h1 className="my-6 text-3xl font-semibold">My Account</h1>

          <div className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span>My Wish List</span>
            </div>
          </div>

          <WishListGrid items={wishListItems} winningItemsId={winningItemsId} />
        </div>
      </main>
    </div>
  );
}

export default MyAccount;
