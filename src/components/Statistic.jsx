export const Statistic = ({ numUsers, numItems, numWishList }) => {
  const numWL = numWishList.reduce((pre, cur) => pre + cur.wantedBy.length, 0);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-4 text-center font-bold">Summary</h1>
      <div className="grid row-gap-8 sm:grid-cols-3">
        <div className="text-center">
          <h6 className="text-5xl font-bold text-primary">{numUsers}</h6>
          <p className="font-bold">Participants</p>
        </div>
        <div className="text-center">
          <h6 className="text-5xl font-bold text-primary">{numItems}</h6>
          <p className="font-bold">Available Items</p>
        </div>
        <div className="text-center">
          <h6 className="text-5xl font-bold text-primary">{numWL}</h6>
          <p className="font-bold">Wishlist Items</p>
        </div>
      </div>
    </div>
  );
};
