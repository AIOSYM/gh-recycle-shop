import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuthStatus";

const PrivateRoute = () => {
  const { loggedIn, checkingStatus, user } = useAuthStatus();
  if (checkingStatus) {
    return <h1>Loading status..</h1>;
  }
  console.log(user);
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
