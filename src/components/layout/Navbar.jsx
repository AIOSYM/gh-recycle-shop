import { Link, useNavigate } from "react-router-dom";
import { FaRecycle } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import useGetAdminEmail from "../../hooks/useGetAdminEmail";

function Navbar() {
  const auth = getAuth();
  let navigate = useNavigate();

  const { adminEmails, isFetching } = useGetAdminEmail();

  const handleSignOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  const goToAccount = () => {
    navigate("/account");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  if (isFetching) {
    return null;
  }

  const isAdmin = !!adminEmails.includes(auth.currentUser.email);

  return (
    <div className="flex justify-between navbar bg-base-200">
      <div className="flex">
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          <div className="flex flex-row items-center justify-between">
            <FaRecycle className="inline mx-2 text-xs sm:text-xl" />
            <p className="text-xs sm:text-xl">GH Recyling Shop</p>
          </div>
        </Link>
      </div>
      <div className="flex">
        <ul className="menu menu-horizontal p-0 text-xs sm:text-sm md:text-lg font-bold">
          {isAdmin && (
            <li className="hidden sm:block">
              <p onClick={goToDashboard}>Admin Dashboard</p>
            </li>
          )}

          <li>
            <p onClick={goToAccount}>My List</p>
          </li>

          <li>
            <a onClick={handleSignOut}>Sign out</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
