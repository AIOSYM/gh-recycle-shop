import { Link, useNavigate } from "react-router-dom";
import { FaRecycle } from "react-icons/fa";
import { getAuth } from "firebase/auth";

function Navbar() {
  const auth = getAuth();
  let navigate = useNavigate();

  const handleSignOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  const goToAccount = () => {
    navigate("/account");
  };

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          <div className="flex flex-row items-center justify-between">
            <FaRecycle className="inline mx-2 text-xs sm:text-xl" />
            <p className="text-xs sm:text-xl">GH Recyling Shop</p>
          </div>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 text-xs sm:text-sm md:text-lg">
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
