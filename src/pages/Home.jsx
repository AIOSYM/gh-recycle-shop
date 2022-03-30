import { useAuthStatus } from "../hooks/useAuthStatus";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ItemProvider } from "../context/ItemContext";
import NavBar from "../components/layout/Navbar";
import Banner from "../components/Banner";
import Step from "../components/Step";
import ItemList from "../components/ItemList";

function Home() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { loggedIn, checkingStatus, user } = useAuthStatus();

  

  const handleSignOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  return (
    user && (
      <ItemProvider>
        <div className="flex flex-col justify-start h-screen">
          <NavBar signOut={handleSignOut} />
          <Banner user={user} />
          <Step />
          <ItemList />
        </div>
      </ItemProvider>
    )
  );
}

export default Home;
