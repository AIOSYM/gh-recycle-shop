function WishListCard({item, isGrantor}) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl image-full">
      <figure>
        <img src={item.imgUrls[0]} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p>{item.description}</p>
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
