import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ItemContext from "../context/ItemContext";

function ItemCard({ id, item }) {
  const { handleWishListButton, isAddedToWishList } = useContext(ItemContext);
  const [isSelected, setIsSelected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    isAddedToWishList(id) ? setIsSelected(true) : setIsSelected(false);
  }, []);

  return (
    <div
      className="card bg-base-100 shadow-xl duration-300 transform hover:-translate-y-2 border break-all"
      id={id}
    >
      <figure className="h-60 object-center object-cover">
        <img src={item.imageUrls[0]} alt="item" />
      </figure>
      <div className="card-body justify-between">
        <h2 className="card-title font-bold">
          {item.name}
          <div className="badge badge-secondary">{item.price}円</div>
        </h2>
        <div className="flex flex-col">
          <p className="text-xs sm:text-base">{item.description}</p>
          <p className="text-xs sm:text-base">
            Available Quantity: {item.quantity}
          </p>
          <div className="text-xs underline text-primary md:text-base">
            <button onClick={() => navigate(`/item/${id}`, { state: item })}>
              <p className="underline">More photos</p>
            </button>
          </div>
        </div>
        <div className="card-actions justify-end ">
          <button
            className={`btn ${
              isSelected ? "btn-error" : "btn-secondary"
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
