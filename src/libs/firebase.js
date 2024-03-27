import { db } from "../firebase.config";
import { getDocs, getDoc, setDoc, doc, collection } from "firebase/firestore";

export const getDrawingStatus = async (eventID) => {
  const docPath = `${eventID}/status`;
  const docRef = doc(db, docPath);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().drawing;
  } else {
    return {};
  }
};

export const setDrawingStatus = async (eventID, status) => {
  const docPath = `${eventID}/status`;
  const docRef = doc(db, docPath);
  await setDoc(docRef, { drawing: status });
}

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
    } catch (error) {
      console.error(error);
    }
  });
};
