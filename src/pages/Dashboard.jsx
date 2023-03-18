import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { Statistic } from "../components/Statistic";
import ItemsTable from "../components/ItemsTable";
import { AdminControls } from "../components/admin/AdminControls";

function Dashboard() {
  const [allUsers, setAllUsers] = useState(null);
  const [allItems, setAllItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [activeUsers, setActiveUsers] = useState(null);

  useEffect(() => {
    //console.log("API CALL:Dashboard");
    setLoading(true);
    const fetchData = async () => {
      const [fetchAllUsers, fetchAllItems] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "items")),
        getDocs(collection(db, "catRef")),
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
        //console.log(error);
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
    return <h1>User loading...</h1>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold sm:text-5xl">Dashboard</h1>
      <Statistic
        numUsers={activeUsers.length}
        numItems={allItems.length}
        numWishList={tableData}
      />
      <AdminControls/>
      <ItemsTable
        tableData={tableData}
        allItems={allItems}
        activeUsers={activeUsers}
      />
    </div>
  );
}

export default Dashboard;
