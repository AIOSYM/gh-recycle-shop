import { db } from "../firebase.config";
import { getDocs, setDoc, doc, collection } from "firebase/firestore";

export const getAllUsers = async (userCollectionPath) => {
  const docsRef = collection(db, userCollectionPath);
  const docsSnap = await getDocs(docsRef);
  const docs = docsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  docs.sort((a, b) => a.createdAt - b.createdAt);
  return docs;
};

export const resetResults = async (userCollectionPath) => {
  const allUsers = await getAllUsers(userCollectionPath);

  allUsers.forEach(async (user) => {
    const userId = user.id;

    const updatedData = { ...user, winningItems: [] };
    try {
      await setDoc(doc(db, userCollectionPath, userId), updatedData);
      console.log("Clear all winning item!");
    } catch (error) {
      console.error(error);
    }
  });
};
