import { useParams, useLocation } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ItemDetail() {
  const { itemId } = useParams();
  const location = useLocation();
  const item = location.state;

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(`/#${itemId}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-col px-4 flex-1 overflow-y-scroll">
        <div className="mt-4">
          <Link to={`/#${itemId}`} className="btn btn-primary">
            {`< Go back to dashboard`}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <div className="border-4 rounded-md p-8">
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p>Category: {item.catRef}</p>
            <p>Available Quantity: {item.quantity}</p>
            <p>Description: {item.description || "No Description"}</p>
            <p>Price: {item.price}円</p>
          </div>
          <div className="border-4 rounded-md py-8">
            <div className="carousel-wrapper w-1/2 self-center mx-auto border rounded-md">
              <Carousel>
                {item.imageUrls.map((img, index) => {
                  return (
                    <div key={index}>
                      <img src={img} className="object-contain" />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
