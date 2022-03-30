import { useParams, useLocation } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import Navbar from "../components/layout/Navbar";

function ItemDetail() {
  const { itemId } = useParams();
  const location = useLocation();
  const item = location.state;

  console.log(item);

  return <div className="flex flex-col ">
    <Navbar/>
    <div className="p-6">
    <h1 className="text-3xl">
  {item.name}
  </h1>
  <div className="flex flex-col">
    <h1>Available Quantity: {item.quantity}</h1>
    <h2>Description: {item.description}</h2>
    <div className="carousel-wrapper w-1/2 self-center mt-10">
      <Carousel>
        {item.imgUrls.map((img, index) => {
          return (
            <div key={index}>
              <img src={img} />
            </div>
          );
        })}
      </Carousel>
    </div>
  </div>
    </div>
</div>
}

export default ItemDetail;
