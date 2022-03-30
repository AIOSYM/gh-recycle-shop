import { useState, useEffect, useContext } from "react";
import ItemContext from "../context/ItemContext";

function ItemCard({ id, item }) {
  const { handleWishListButton, isAddedToWishList } = useContext(ItemContext);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    isAddedToWishList(id) ? setIsSelected(true) : setIsSelected(false);
  }, []);

  return (
    <div className="card card-side bg-base-100 border shadow-xl duration-300 transform hover:-translate-y-2">
      <figure>
        <img
          src={item.imgUrls[0]}
          alt="Furniture"
          className="object-contain h-60 w-60"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p>{item.description}</p>
        <p>Available Quantity: {item.quantity}</p>
        <p>Price: {item.price} Yen</p>
        <p>There are {item.popularity} people who want this.</p>
        <div className="card-actions justify-end">
          <button
            className={`btn ${
              isSelected ? "btn btn-secondary" : "btn-primary"
            }`}
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
