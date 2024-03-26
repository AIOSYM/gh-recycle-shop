import { useNavigate } from "react-router-dom";
import AnnouncementForm from "../components/AnnouncementForm";

function AnnouncementInfo() {
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
        <AnnouncementForm />
      </div>
    </div>
  );
}

export default AnnouncementInfo;
