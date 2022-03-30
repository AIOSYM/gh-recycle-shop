import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ItemContext from "../context/ItemContext";

function ItemCard({ id, item }) {
  const { handleWishListButton, isAddedToWishList } = useContext(ItemContext);
  const [isSelected, setIsSelected] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    isAddedToWishList(id) ? setIsSelected(true) : setIsSelected(false);
  }, []);

  return (
    <div className="card card-side bg-base-100 border shadow-xl duration-300 transform hover:-translate-y-2">
      <figure>
        <img
          src={item.imgUrls[0]}
          alt="Furniture"
          className="object-contain h-40 md:h-60 "
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-md sm:text-2xl md:text-4xl">
          {item.name}
        </h2>
        <p className="text-xs sm:text-md">{item.description}</p>
        <p className="text-xs sm:text-md">
          Available Quantity: {item.quantity}
        </p>
        <p className="text-xs sm:text-md">Price: {item.price} Yen</p>
        <div className="text-xs underline text-primary">
          <button onClick={() => navigate(`/item/${id}`, {state:item} ) }>
            More photos
          </button>
        </div>
        <div className="card-actions justify-end ">
          <button
            className={`btn ${
              isSelected ? "btn btn-secondary" : "btn-primary"
            } text-xs btn-sm md:text-md md:btn-md`}
            onClick={() => {
              setIsSelected(!isSelected);
              handleWishListButton(id);
            }}
          >
            {isSelected ? "I don't want this" : "I want this"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
