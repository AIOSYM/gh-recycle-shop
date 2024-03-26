import { useNavigate } from "react-router-dom";

export const AdminControls = ({ allUsers }) => {
  const participatedUsers = allUsers.filter(
    (user) => user.data.wantedItems.length !== 0
  );

  const navigate = useNavigate();

  const handleViewAllItems = () => {
    navigate("/view-all-items");
  };

  const handleAddNewItem = () => {
    navigate("/add-new-item");
  };

  const handleUpdateAnnouncement = () => {
    navigate("/announcement");
  };

  const downloadEmailList = () => {
    const emailList = participatedUsers.map((user) => user.data.email);
    const csvContent = "data:text/csv;charset=utf-8," + emailList.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "emailList.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl mb-4 text-center font-bold">Control</h1>
      <div className="grid row-gap-8 gap-2 sm:grid-cols-4">
        <button className="btn btn-primary" onClick={handleViewAllItems}>
          View all items
        </button>

        <button className="btn btn-primary" onClick={handleAddNewItem}>
          Add new item
        </button>

        <button className="btn btn-primary" onClick={downloadEmailList}>
          Download Email list
        </button>

        <button className="btn btn-primary" onClick={handleUpdateAnnouncement}>
          Change Announcement Info
        </button>
      </div>
    </div>
  );
};
