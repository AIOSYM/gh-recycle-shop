import ItemListRow from "./ItemListRow";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ItemsTable({ tableData, allItems, activeUsers }) {
  const [isUploading, setIsUploading] = useState(false);
  let navigate = useNavigate();

  tableData.sort((a, b) => {
    return a.popularity - b.popularity;
  });

  const startDrawing = async () => {
    if (tableData.length === 0) {
      alert("No items to draw");
      return;
    }
    navigate("/drawing", { state: { tableData, allItems, activeUsers } });
  };

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-3xl font-bold sm:text-4xl pb-4">Items List</h3>
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
                Name List
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Grantor List
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
      <div className="self-center p-4">
        <button className="btn btn-primary" onClick={startDrawing}>
          Start Drawing
        </button>
      </div>
    </div>
  );
}

export default ItemsTable;
