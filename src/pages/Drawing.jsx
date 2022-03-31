import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { confirm } from "react-confirm-box";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { doc, collection, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Drawing() {
  const [itemIndex, setItemIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [receivedParticipants, setReceivedParticipants] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [currentCatRef, setCurrentCatRef] = useState({});
  const [drawingResults, setDrawingResult] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const location = useLocation();
  let navigate = useNavigate();
  const messageState = location.state;
  const { tableData, allItems, activeUsers} = messageState;

  const numAllItems = allItems.length;

  useEffect(() => {
    const images = () => {
      const item = allItems.find((item) => item.id === tableData[itemIndex].id);
      setImages(item.data.imgUrls);
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
      toast.info("No more winner");
    }

    setDrawingResult(drawingResult);
    setReceivedParticipants(receivedList);
    setCurrentParticipants(currentList);
    setCurrentCatRef(newCurrentCatRef);
  };

  const handleClick = async () => {
    const result = await confirm("Are you sure?");
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
      //console.log("updatedData");
      const name = user.data.name;
      const userId = user.id;
      const winningItemsFromDraw = drawResultArr.filter((item) =>
        item.results.includes(name)
      );
      const winningItemsId = winningItemsFromDraw.map((item) => item.id);

      let updatedData = { ...user.data, winningItems: winningItemsId };
      //console.log(name, winningItemsFromDraw);
      try {
        await setDoc(doc(db, "users", userId), updatedData);
        toast.success("Update was successful");
      } catch (error) {
        toast.error(error);
      }
    });
  };

  const uploadToDatabase = async () => {
    try {
      setIsUploading(true);
      const drawingResultsCopy = {
        data: { ...drawingResults },
        timestamp: serverTimestamp(),
      };
      const newTableDataRef = doc(collection(db, "drawingResults"));
      await setDoc(newTableDataRef, drawingResultsCopy);
      toast.success("Upload was successful");
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
    <div className="flex flex-col p-6">
      <h1 className="text-3xl">
        Drawing{` (${itemIndex + 1}/${tableData.length})`}
      </h1>
      <div className="flex flex-col">
        <h1>{tableData[itemIndex].name}</h1>
        <h1>Quantity: {tableData[itemIndex].quantity}</h1>
        <h1>
          Wish List{`(${tableData[itemIndex].wantedBy.length})`}:{" "}
          {tableData[itemIndex].wantedBy.join(", ")}
        </h1>
        <h1>
          Draw result:{" "}
          {drawingResults[itemIndex] &&
            drawingResults[itemIndex].results.join(", ")}
        </h1>
        <button
          className="btn btn-info w-1/4 self-center my-4"
          onClick={() => performDrawingForItem(itemIndex)}
        >
          Start drawing
        </button>

        <div className="flex flex-row justify-center p-4">
          {itemIndex !== 0 && (
            <button
              className="btn btn-circle btn-accent mx-2"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          {itemIndex < numAllItems - 1 && (
            <button className="btn btn-circle btn-accent" onClick={handleNext}>
              Next
            </button>
          )}
        </div>

        <div className="carousel-wrapper w-1/2 self-center">
          <Carousel>
            {images.map((img, index) => {
              return (
                <div key={index}>
                  <img src={img} />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>

      {itemIndex === numAllItems - 1 && (
        <button
          className="btn btn-success mt-6"
          onClick={uploadToDatabase}
          disabled={isUploading}
        >
          Save result
        </button>
      )}
      <button className="btn btn-warning mt-6" onClick={handleClick}>
        Go back
      </button>
    </div>
  );
}

export default Drawing;
