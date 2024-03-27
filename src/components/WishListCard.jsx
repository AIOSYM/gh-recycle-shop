function WishListCard({ item, isGrantor, status }) {
  return (
    <div className="card bg-base-100 shadow-xl image-full">
      <figure>
        <img src={item.imageUrls[0]} alt="Item" />
      </figure>
      <div className="card-body flex">
        <p className="flex font-bold items-center justify-center md:text-2xl">
          {item.name}
        </p>

        {isGrantor && (
          <div className="card-actions justify-end">
            <button className="btn btn-primary">You got this item!</button>
          </div>
        )}

        {status === "done" && !isGrantor && (
          <div className="card-actions">
            <p className="bg-red-500 hover:bg-red-600 text-white break-before-all p-2 rounded-md border-gray-200 border">
              Resut: Sorry, you didn't get this!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishListCard;
