import React, { useEffect, useState } from "react";
import GridLayoutItem from "./layout/GridLayoutItem";
import WishListCard from "./WishListCard";


function WishListGrid({ items, winningItemsId, status}) {
  return (
    <div className="px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
      <GridLayoutItem>
        {items &&
          items.map((item) => {
            return (
              <WishListCard
                key={item.id}
                item={item.data}
                status={status}
                isGrantor={winningItemsId.includes(item.id)}
              />
            );
          })}
      </GridLayoutItem>
    </div>
  );
}

export default WishListGrid;
