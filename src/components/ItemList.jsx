import { useContext } from "react";
import ItemContext from "../context/ItemContext";
import ItemCard from "./ItemCard";
import GridLayoutItem from "./layout/GridLayoutItem";
import ScrollToAnchor from "./ScrollLink";

function ItemList() {
  const { items, itemsLoading, userLoading } = useContext(ItemContext);

  if (itemsLoading || userLoading) {
    return null;
  }

  return (
    <div className="flex flex-col w-screen">
      <ScrollToAnchor />
      <div className="max-w-xl px-4 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12 py-10">
        <p className="inline-block px-3 py-px mb-4 text-md lg:text-2xl font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
          Recycling Items | リサイクル物品
        </p>
        <div className="border p-4">
          <p className="inline-block px-3 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            Please select any items that you want before the drawing session
            starts
          </p>
          <br />
          <p className="inline-block px-3 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            抽選会が始まるまでに「I want
            this」ボタンで欲しい物品を選んでください
          </p>
        </div>
      </div>

      <div className="my-4 px-4 max-w-5xl mx-auto ">
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
