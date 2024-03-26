import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { Statistic } from "../components/Statistic";
import ItemsTable from "../components/ItemsTable";
import { AdminControls } from "../components/admin/AdminControls";
import Loading from "../components/shared/Loading";

function Dashboard() {
  const [allUsers, setAllUsers] = useState(null);
  const [allItems, setAllItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [activeUsers, setActiveUsers] = useState(null);
  const eventID = process.env.REACT_APP_EVENT_ID;

  const collectionPath = eventID;
  const userCollectionPath = `${eventID}/users/users`;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const [fetchAllUsers, fetchAllItems] = await Promise.all([
        getDocs(collection(db, `${collectionPath}/users/users`)),
        getDocs(collection(db, `${collectionPath}/items/items`)),
      ]);
      const querySnapshotUsers = await fetchAllUsers;
      const querySnapshotItems = await fetchAllItems;
      return [querySnapshotUsers, querySnapshotItems];
    };
    fetchData()
      .then(([querySnapshotUsers, querySnapshotItems]) => {
        const fetchUsers = [];
        const fetchItems = [];

        querySnapshotUsers.forEach((doc) => {
          return fetchUsers.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        querySnapshotItems.forEach((doc) => {
          return fetchItems.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setAllUsers(fetchUsers);
        setAllItems(fetchItems);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (allUsers && allItems) {
      const summarizeItemsData = () => {
        const tableData = [];
        allItems.forEach((item) => {
          let wantedBy = [];
          let winningBy = [];
          allUsers.forEach((user) => {
            if (user.data.wantedItems.includes(item.id)) {
              wantedBy.push(user.data.name);
            }
            if (user.data.winningItems.includes(item.id)) {
              winningBy.push(user.data.name);
            }
          });
          return tableData.push({
            id: item.id,
            name: item.data.name,
            catRef: item.data.catRef,
            popularity: wantedBy.length,
            quantity: item.data.quantity,
            wantedBy: wantedBy,
            winningBy: winningBy,
          });
        });

        setTableData(tableData);
      };
      const findAllUniqueUsers = () => {
        const allUsersCopy = [...allUsers];
        const uniqueUsers = allUsersCopy.filter(
          (user) => user.data.wantedItems.length > 0
        );
        setActiveUsers(uniqueUsers);
      };
      summarizeItemsData();
      findAllUniqueUsers();
    }
  }, [allUsers, allItems]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div>
        <button className="btn" onClick={() => navigate("/")}>
          View Recycle Shop Page
        </button>
        <h1 className="text-3xl font-extrabold sm:text-5xl mt-5">Dashboard</h1>
      </div>
      <div className="max-w-3xl mx-auto">
        <Statistic
          numUsers={activeUsers.length}
          numItems={allItems.length}
          numWishList={tableData}
        />
        <AdminControls allUsers={allUsers} />
      </div>

      <ItemsTable
        tableData={tableData}
        allItems={allItems}
        activeUsers={activeUsers}
        userCollectionPath={userCollectionPath}
      />
    </div>
  );
}

export default Dashboard;
