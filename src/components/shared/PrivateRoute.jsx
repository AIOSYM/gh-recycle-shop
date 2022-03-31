import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuthStatus";

const PrivateRoute = () => {
  const { loggedIn, checkingStatus, user } = useAuthStatus();
  if (checkingStatus) {
    return <h1></h1>;
  }
  //console.log("PrivateRoute:", user);
  return loggedIn ? <Outlet /> : <Navigate to="/sign-up" />;
};

export default PrivateRoute;
