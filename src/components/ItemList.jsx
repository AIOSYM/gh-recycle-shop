import { useContext } from "react";
import ItemContext from "../context/ItemContext";
import ItemCard from "./ItemCard";
import GridLayoutItem from "./layout/GridLayoutItem";

function ItemList() {
  const { items, itemsLoading, userLoading } = useContext(ItemContext);

  if (itemsLoading || userLoading) {
    return <h1></h1>;
  }
  return (
    <div className="flex flex-col w-screen">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12 py-10">
        <p className="inline-block px-3 py-px mb-4 text-md lg:text-2xl font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
          Recycling Items | リサイクル物品
        </p>
        <div className="border">
          <p className="inline-block px-3 mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            Please select any items that you want before the drawing session
            starts
          </p>
          <br />
          <p className="inline-block px-3  mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            抽選会が始まるまでに「I want
            this」ボタンで欲しい物品を選んでください
          </p>
        </div>
      </div>
      <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10 ">
        <GridLayoutItem>
          {items &&
            items.map((item) => {
              return <ItemCard key={item.id} id={item.id} item={item.data} />;
            })}
        </GridLayoutItem>
      </div>
    </div>
  );
}

export default ItemList;
