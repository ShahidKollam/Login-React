import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in');
  };

  return (
    <div className="bg-slate-300">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold">Login total-x APP</h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>

          {
            user && (
              <li>{user.displayName}</li>
            )
          }



          {user ? <button
            onClick={handleLogout}
            className="text-black-700 hover:text-red-600">
            Logout
          </button> :
            <Link to="/sign-in">
              <li>Login</li>
            </Link>
          }

        </ul>
      </div>
    </div>
  );
}
