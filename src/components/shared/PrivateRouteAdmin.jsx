import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuthStatus";

const PrivateRouteAdmin = () => {
  const { loggedIn, checkingStatus, user } = useAuthStatus();

  if (checkingStatus) {
    return <h1></h1>;
  }
  return loggedIn && user.email === process.env.REACT_APP_ADMIN_EMAIL ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default PrivateRouteAdmin;
