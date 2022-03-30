import { Link } from "react-router-dom";
import { FaRecycle } from "react-icons/fa";

function Navbar({ signOut }) {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          <div className="flex flex-row items-center justify-between">
            <FaRecycle className="inline mx-2" />
            <p>GH Recyling Shop</p>
          </div>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to="account">My account</Link>
          </li>

          <li>
            <a onClick={signOut}>Sign out</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
