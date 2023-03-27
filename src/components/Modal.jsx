import { useState } from "react";
import ItemForm from "./ItemForm";

const Modal = ({ btnName, id, setUpdateCount }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-sm"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {btnName}
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-40">
            <div
              className="relative my-6 w-full mx-14"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="p-8">
                  <div className="flex justify-between">
                    <h1 className="text-2xl py-2">Update Item</h1>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                  <ItemForm submitType="edit" id={id} setShowModal={setShowModal} setUpdateCount={setUpdateCount}/>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
