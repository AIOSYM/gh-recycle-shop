import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./components/shared/PrivateRoute";
import PrivateRouteAdmin from "./components/shared/PrivateRouteAdmin";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ItemDetail from "./pages/ItemDetail";
import Dashboard from "./pages/Dashboard";
import Drawing from "./pages/Drawing";
import AddNewItem from "./pages/AddNewItem";
import ViewAllItems from "./pages/ViewAllItems";
import AnnouncementInfo from "./pages/AnnouncementInfo";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/account" element={<PrivateRoute />}>
            <Route path="/account" element={<MyAccount />} />
          </Route>
          <Route path="/item/:itemId" element={<ItemDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<PrivateRouteAdmin />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/drawing" element={<PrivateRouteAdmin />}>
            <Route path="/drawing" element={<Drawing />} />
          </Route>
          <Route path="/add-new-item" element={<PrivateRouteAdmin />}>
            <Route path="/add-new-item" element={<AddNewItem />} />
          </Route>
          <Route path="/view-all-items" element={<PrivateRouteAdmin />}>
            <Route path="/view-all-items" element={<ViewAllItems />} />
          </Route>
          <Route path="/announcement" element={<PrivateRouteAdmin />}>
            <Route path="/announcement" element={<AnnouncementInfo />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
