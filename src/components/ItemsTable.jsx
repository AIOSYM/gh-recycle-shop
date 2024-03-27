import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemListRow from "./ItemListRow";
import {
  resetResults,
  getDrawingStatus,
  setDrawingStatus,
} from "../libs/firebase";
import { toast } from "react-toastify";

function ItemsTable({ tableData, allItems, activeUsers, eventID }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [drawingStatus, setStatus] = useState({});
  const userCollectionPath = `${eventID}/users/users`;
  const navigate = useNavigate();

  useEffect(() => {
    const getStatus = async () => {
      const status = await getDrawingStatus(eventID);
      setStatus(status);
      setIsLoading(false);
      console.log(status);
    };

    getStatus();
  }, []);

  tableData.sort((a, b) => {
    return a.popularity - b.popularity;
  });

  const startDrawing = async () => {
    if (tableData.length === 0) {
      alert("No items to draw");
      return;
    } else if (activeUsers.length === 0) {
      alert("No participant to draw");
      return;
    }
    navigate("/drawing", { state: { tableData, allItems, activeUsers } });
  };

  const showResult = () => {
    navigate("/result");
  };

  const handleResetResult = async () => {
    const confirm = window.confirm(
      "Caution: You will lost your current result.\nAre you sure to reset the drawing result?"
    );
    if (!confirm) return;

    try {
      await resetResults(userCollectionPath);
      await setDrawingStatus(eventID, "pending");
      toast.success("Reset result successfully!");
      navigate(0);
    } catch (error) {
      toast.error("Cannot reset the result!");
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col w-full border rounded-md px-8 pb-8">
      {/* control */}
      <div className="flex flex-col items-center m-8">
        <h3 className="text-3xl font-bold sm:text-4xl pb-4">Items List</h3>
        {drawingStatus === "pending" ? (
          <div className="flex gap-4">
            <button className="btn btn-primary" onClick={startDrawing}>
              Start Drawing
            </button>
          </div>
        ) : (
          <div className="font-bold text-xl text-center text-primary">
            Drawing Result
          </div>
        )}
      </div>

      {/* table */}
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
              {drawingStatus === "pending" && (
                <>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Popularity
                  </th>
                  <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                    Candidates
                  </th>
                </>
              )}

              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Receiver
              </th>
              {drawingStatus === "done" && (
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Email
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tableData.map((rowData, index) => {
              return (
                <ItemListRow
                  key={index}
                  id={index}
                  data={rowData}
                  status={drawingStatus}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {drawingStatus === "done" && (
        <div className="flex w-full gap-4 justify-center items-center my-4">
          <button
            className="btn bg-red-600  hover:bg-red-700 text-white"
            onClick={handleResetResult}
          >
            Reset result
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemsTable;
