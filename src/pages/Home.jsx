import { useAuthStatus } from "../hooks/useAuthStatus";
import { ItemProvider } from "../context/ItemContext";
import NavBar from "../components/layout/Navbar";
import Banner from "../components/Banner";
import Step from "../components/Step";
import ItemList from "../components/ItemList";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";

function Home() {
  const { loggedIn, checkingStatus, user } = useAuthStatus();
  const event_id = process.env.REACT_APP_EVENT_ID;

  return (
    user && (
      <ItemProvider eventID={event_id}>
        <div className="flex flex-col justify-start h-screen">
          <NavBar />
          <Banner user={user} eventID={event_id}/>
          <Step />
          <Announcement eventID={event_id} />
          <ItemList />
          <Footer />
        </div>
      </ItemProvider>
    )
  );
}

export default Home;
