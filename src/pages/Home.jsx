import { useAuthStatus } from "../hooks/useAuthStatus";
import { ItemProvider } from "../context/ItemContext";
import NavBar from "../components/layout/Navbar";
import Banner from "../components/Banner";
import Step from "../components/Step";
import ItemList from "../components/ItemList";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import ScrollToAnchor from "../components/ScrollLink";

function Home() {
  const { loggedIn, checkingStatus, user } = useAuthStatus();

  return (
    user && (
      <ItemProvider event="2024">
        <div className="flex flex-col justify-start h-screen">
          <NavBar />
          <Banner user={user} />
          <Step />
          <Announcement />
          <ItemList />
          <Footer />
        </div>
      </ItemProvider>
    )
  );
}

export default Home;
