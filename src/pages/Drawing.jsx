import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { X } from "lucide-react";

import { doc, collection, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { setDrawingStatus } from "../libs/firebase";

function Drawing() {
  const [itemIndex, setItemIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [receivedParticipants, setReceivedParticipants] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [currentCatRef, setCurrentCatRef] = useState({});
  const [drawingResults, setDrawingResult] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const messageState = location.state;
  const { tableData, allItems, activeUsers } = messageState;
  const numAllItems = allItems.length;
  const remainingItems = numAllItems - Object.keys(drawingResults).length;
  const eventID = process.env.REACT_APP_EVENT_ID;

  const userCollectionPath = `${eventID}/users/users`;
  const resultCollectionPath = `${eventID}/results/results`;

  useEffect(() => {
    const images = () => {
      const item = allItems.find((item) => item.id === tableData[itemIndex].id);

      setImages(item.data.imageUrls);
    };
    images();
  }, [itemIndex]);

  useEffect(() => {
    const allParticipants = activeUsers.map((user) => user.data.name);
    setAllParticipants(allParticipants);
  }, []);

  const performDrawingForItem = (itemId) => {
    const item = tableData[itemId];
    const catRef = item.catRef;
    const wantedBy = item.wantedBy;
    const available = item.quantity;

    let receivedList = [...receivedParticipants];
    let currentCatRefObj = { ...currentCatRef };
    let prohibitedList = [];

    if (currentCatRef[catRef]) {
      prohibitedList = Array.from(currentCatRefObj[catRef]);
    }

    let drawingList = [...wantedBy];
    let currentList = [];
    let remaining = available;

    //console.log("PROHIBITED FOR " + catRef + " : ", prohibitedList);

    // reset the receiveList if all participants win any item, except those that get an item in that category
    if (receivedList.length === allParticipants.length) {
      receivedList = [];
    }
    drawingList = drawingList.filter((val) => !receivedList.includes(val));
    // reset the drawingList if everyone is already won any item
    if (drawingList.length === 0) {
      drawingList = [...wantedBy];
    }
    // remove the user who already got item from the same category
    drawingList = drawingList.filter((val) => !prohibitedList.includes(val));
    while (remaining > 0 && drawingList.length > 0) {
      const randomeIndex = Math.floor(Math.random() * drawingList.length);
      const randomWinner = drawingList[randomeIndex];
      receivedList.push(randomWinner);
      currentList.push(randomWinner);
      prohibitedList.push(randomWinner);
      drawingList.splice(randomeIndex, 1);
      remaining = available - currentList.length;

      if (remaining === 0 && drawingList.length === 0) {
      } else if (remaining === 0) {
      } else if (drawingList.length === 0) {
        let newDrawingList = [...wantedBy];
        newDrawingList = newDrawingList.filter(
          (val) => !currentList.includes(val)
        );
        newDrawingList = newDrawingList.filter(
          (val) => !prohibitedList.includes(val)
        );
        drawingList = [...newDrawingList];
        if (drawingList.length === 0) {
          //console.log("Run out of wishlist");
        }
      }
    }
    const resultObj = {
      id: tableData[itemId].id,
      name: tableData[itemId].name,
      results: currentList,
    };
    let drawingResult = {
      ...drawingResults,
      [itemId]: resultObj,
    };

    let newCurrentCatRef = {
      ...currentCatRef,
      [catRef]: prohibitedList,
    };

    if (currentList.length === 0) {
      toast.info("No winner");
    }

    setDrawingResult(drawingResult);
    setReceivedParticipants(receivedList);
    setCurrentParticipants(currentList);
    setCurrentCatRef(newCurrentCatRef);

    if (itemId === tableData.length - 1) {
      setShowSaveButton(true);
    }
  };

  const handleCancelDrawing = async () => {
    const result = window.confirm(
      "Caution: your result will not be saved. \nAre you sure you want to cancel?"
    );
    if (result) {
      navigate(-1);
      return;
    }
  };

  // update each user winningItems
  const updateUserWinningItems = async () => {
    const allParticipantCopy = [...activeUsers];
    const drawResultArr = Object.keys(drawingResults).map((key) => {
      return drawingResults[key];
    });
    allParticipantCopy.forEach(async (user) => {
      const name = user.data.name;
      const userId = user.id;
      const winningItemsFromDraw = drawResultArr.filter((item) =>
        item.results.includes(name)
      );
      const winningItemsId = winningItemsFromDraw.map((item) => item.id);

      let updatedData = { ...user.data, winningItems: winningItemsId };
      try {
        await setDoc(doc(db, userCollectionPath, userId), updatedData);
        await setDrawingStatus(eventID, "done");
        toast.success("Notify the winning item to user successfully");
      } catch (error) {
        toast.error(error);
      }
    });
  };

  const uploadToDatabase = async () => {
    if (remainingItems !== 0) {
      alert("There are still undrawn items\nGo back and draw all items first");
      return;
    }
    try {
      setIsUploading(true);
      const drawingResultsCopy = {
        data: { ...drawingResults },
        timestamp: serverTimestamp(),
      };
      const newTableDataRef = doc(collection(db, resultCollectionPath));
      await setDoc(newTableDataRef, drawingResultsCopy);
      setIsUploading(false);
    } catch (error) {
      toast.error(error);
    }
    await updateUserWinningItems();
  };

  const handleBack = () => {
    setItemIndex((prev) => {
      if (prev - 1 >= 0) {
        return prev - 1;
      }
      return 0;
    });
  };

  const handleNext = () => {
    setItemIndex((prev) => {
      if (prev + 1 < numAllItems) {
        return prev + 1;
      }
      return numAllItems - 1;
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen px-8 overflow-hidden items-center">
      <h1 className="text-5xl my-4 font-bold text-center">
        Drawing{` (${itemIndex + 1}/${tableData.length})`}
      </h1>

      <div className="flex justify-between border-4 w-full p-4 mb-4">
        <div className="flex flex-col gap-2 w-1/3">
          {showSaveButton && itemIndex === numAllItems - 1 ? (
            <button
              className="btn btn-success w-full text-white"
              onClick={uploadToDatabase}
              disabled={isUploading}
            >
              Save result{" "}
              {remainingItems !== 0 && `(${remainingItems} undrawn items left)`}
            </button>
          ) : (
            <button
              disabled={drawingResults[itemIndex]}
              className="btn w-full bg-primary"
              onClick={() => performDrawingForItem(itemIndex)}
            >
              Draw this item
            </button>
          )}

          <div className="flex gap-2">
            <button
              disabled={itemIndex === 0}
              className={`btn flex-1`}
              onClick={handleBack}
            >
              {`< Back`}
            </button>

            <div className="flex-1">
              <button
                disabled={itemIndex === numAllItems - 1}
                className={`btn w-full`}
                onClick={handleNext}
              >
                {`Next >`}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn bg-red-600 text-white mt-6 hover:bg-red-700"
            onClick={handleCancelDrawing}
          >
            <span className="flex items-center">
              <X className="w-6 h-6" />
              Cancel Drawing
            </span>
          </button>
        </div>
      </div>

      <div className="flex overflow-y-scroll border-4 w-full my-4 p-4 gap-4">
        {/* left panel */}
        <div className="flex flex-col flex-1 px-4 border-r-4">
          {drawingResults[itemIndex] &&
          drawingResults[itemIndex].results.length !== 0 ? (
            <div className="flex flex-col justify-center items-center w-full h-full">
              <p className="font-bold text-center text-3xl">
                Item: {tableData[itemIndex].name}
              </p>
              <p className="font-bold text-2xl p-4">Congratulation!! 🎉🥳</p>
              <div className="flex flex-col">
                {drawingResults[itemIndex].results.map((user, index) => {
                  return (
                    <p key={index} className="badge p-2">
                      {`${user}`}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : drawingResults[itemIndex] &&
            drawingResults[itemIndex].results.length === 0 ? (
            <div>
              <p className="font-bold">Item: {tableData[itemIndex].name}</p>
              <p>Quantity: {tableData[itemIndex].quantity}</p>
              <p>
                Description:{" "}
                {tableData[itemIndex].description || "No Description"}
              </p>
              <p>Wish List{`(${tableData[itemIndex].wantedBy.length})`}</p>
              <div className="flex flex-col gap-2 p-8">
                <p className="text-center font-bold">No winner! 🥺</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-bold">Item: {tableData[itemIndex].name}</p>
              <p>Quantity: {tableData[itemIndex].quantity}</p>
              <p>
                Description:{" "}
                {tableData[itemIndex].description || "No Description"}
              </p>
              <p>Wish List{`(${tableData[itemIndex].wantedBy.length})`}</p>
              <div className="flex flex-col gap-2 p-8">
                {tableData[itemIndex].wantedBy.map((user, index) => {
                  return (
                    <p key={index} className="badge">
                      {`${index + 1}. ${user}`}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* right panel */}
        <div className="carousel-wrapper flex-1">
          <Carousel thumbWidth={48} className="bg-primary/20">
            {images.map((img, index) => {
              return (
                <div key={index} className="w-1/2 mx-auto">
                  <img src={img} className="object-contain" />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Drawing;
