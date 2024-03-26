import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { toast } from "react-toastify";

function ViewAllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);
  const eventID = process.env.REACT_APP_EVENT_ID;

  const navigate = useNavigate();
  const collectionPath = `${eventID}/items/items`;

  const deleteItem = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete this?");
    if (!isConfirm) return;
    const documentID = id;
    try {
      await deleteDoc(doc(db, collectionPath, documentID));
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== documentID)
      );
      toast.success("Document successfully deleted!");
    } catch (error) {
      toast.error("Error deleting document: ", error);
      console.log(error);
    }
  };

  useEffect(() => {
    const getItems = async () => {
      const docsRef = collection(db, collectionPath);
      const docsSnap = await getDocs(docsRef);
      const docs = docsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => a.createdAt - b.createdAt);
      setItems(docs);
      setLoading(false);
    };
    getItems();
  }, [updateCount]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">View All Items</h1>
      <button className="btn btn-primary mb-8" onClick={handleGoBack}>
        {" "}
        {`< Go back to dashboard`}
      </button>

      {loading ? (
        <div>Loading</div>
      ) : (
        <Table
          tableData={items}
          deleteItem={deleteItem}
          setUpdateCount={setUpdateCount}
        />
      )}
    </div>
  );
}

export default ViewAllItems;
