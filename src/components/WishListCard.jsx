function WishListCard({ item, isGrantor }) {
  return (
    <div className="card bg-base-100 shadow-xl image-full">
      <figure>
        <img src={item.imageUrls[0]} alt="Item" />
      </figure>
      <div className="card-body">
        <p className="card-title text-xs">{item.name}</p>

        {isGrantor && (
          <div className="card-actions justify-end">
            <button className="btn btn-primary">You got this item!</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishListCard;
