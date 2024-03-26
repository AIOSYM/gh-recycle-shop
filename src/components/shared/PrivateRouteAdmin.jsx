import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import useGetAdminEmail from "../../hooks/useGetAdminEmail";
import Loading from "./Loading";

const PrivateRouteAdmin = () => {
  const { loggedIn, checkingStatus, user } = useAuthStatus();
  const { adminEmails, isFetching } = useGetAdminEmail();

  if (checkingStatus || isFetching) {
    return (
      <div className="flex h-screen w-screen">
        <Loading />;
      </div>
    );
  }

  return loggedIn && adminEmails.includes(user.email) ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default PrivateRouteAdmin;
