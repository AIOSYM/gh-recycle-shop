import { useNavigate } from "react-router-dom";
import ItemForm from "../components/ItemForm";

function AddNewItem() {

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div>
        <button className="btn btn-primary mb-8" onClick={handleGoBack}>
          {" "}
          {`< Go back to dashboard`}
        </button>
        <ItemForm submitType="add"/>
      </div>

    </div>
  );
}

export default AddNewItem;
