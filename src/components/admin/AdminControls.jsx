import { useNavigate } from "react-router-dom";

export const AdminControls = () => {
  const navigate = useNavigate();

  const handleAddNewItem = () => {
    navigate("/add-new-item");
  };

  return (
    <div className="px-4 py-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 text-neutral">
      <h1 className="text-2xl mb-4 self-start">Control</h1>
      <div className="grid row-gap-8 gap-y-2 sm:grid-cols-3">
        <div className="text-center">
          <button className="btn btn-primary">View all items</button>
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={handleAddNewItem}>
            Add new item
          </button>
        </div>
        <div className="text-center">
          <button className="btn btn-primary">Start drawing</button>
        </div>
      </div>
    </div>
  );
};
