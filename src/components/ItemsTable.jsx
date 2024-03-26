import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemListRow from "./ItemListRow";
import { resetResults } from "../libs/firebase";
import { toast } from "react-toastify";

function ItemsTable({ tableData, allItems, activeUsers, userCollectionPath }) {
  const [isUploading, setIsUploading] = useState(false);
  let navigate = useNavigate();

  tableData.sort((a, b) => {
    return a.popularity - b.popularity;
  });

  const startDrawing = async () => {
    const confirm = window.confirm("Do you want to start drawing?");
    if (!confirm) return;

    if (tableData.length === 0) {
      alert("No items to draw");
      return;
    }
    navigate("/drawing", { state: { tableData, allItems, activeUsers } });
  };

  const handleResetResult = async () => {
    const confirm = window.confirm("Are you sure to reset the drawing result?");
    if (!confirm) return;

    try {
      await resetResults(userCollectionPath);
      toast.success("Reset result successfully!");
      navigate(0);
    } catch (error) {
      toast.error("Cannot reset the result!");
    }
  };

  return (
    <div className="flex flex-col w-full border px-8 pb-8">
      <div className="flex flex-col items-center m-8">
        <h3 className="text-3xl font-bold sm:text-4xl pb-4">Items List</h3>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={startDrawing}>
            Start Drawing
          </button>
          <button
            className="btn bg-red-600  hover:bg-red-700 text-white"
            onClick={handleResetResult}
          >
            Reset result
          </button>
        </div>
      </div>
      <div className="overflow-hidden overflow-x-auto border border-gray-100 rounded">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                No
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Item Name
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Avaialbe Quantity
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Popularity
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Candidates
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Receiver
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tableData.map((rowData, index) => {
              return <ItemListRow key={index} id={index} data={rowData} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItemsTable;
