import { useContext } from "react";
import ItemContext from "../context/ItemContext";
import ItemCard from "./ItemCard";
import GridLayoutItem from "./layout/GridLayoutItem";

function ItemList() {
  const { items, itemsLoading, userLoading} = useContext(ItemContext);

  if (itemsLoading || userLoading) {
    return <h1>Loading available items..</h1>;
  }
  return (
    <div>
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <p className="inline-block px-3 py-px mb-4 text-md font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
          リサイクル物品 | Recycling Items
        </p>
      </div>
      <div className="px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
        <GridLayoutItem>
          {items &&
            items.map((item) => {
              return (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  item={item.data}
                />
              );
            })}
        </GridLayoutItem>
      </div>
    </div>
  );
}

export default ItemList;
