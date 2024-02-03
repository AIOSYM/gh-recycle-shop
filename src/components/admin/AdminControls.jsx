import { useNavigate } from "react-router-dom";

export const AdminControls = ({ allUsers }) => {
  const navigate = useNavigate();

  const handleViewAllItems = () => {
    navigate("/view-all-items");
  };

  const handleAddNewItem = () => {
    navigate("/add-new-item");
  };

  const downloadEmailList = () => {
    const emailList = allUsers.map((user) => user.data.email);
    const csvContent = "data:text/csv;charset=utf-8," + emailList.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "emailList.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="px-4 py-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 text-neutral">
      <h1 className="text-2xl mb-4 self-start">Control</h1>
      <div className="grid row-gap-8 gap-y-2 sm:grid-cols-3">
        <div className="text-center">
          <button className="btn btn-primary" onClick={handleViewAllItems}>
            View all items
          </button>
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={handleAddNewItem}>
            Add new item
          </button>
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={downloadEmailList}>
            Download Email list
          </button>
        </div>
      </div>
    </div>
  );
};
