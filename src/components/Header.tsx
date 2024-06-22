import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  console.log(user);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
          {user ? <li>{user.phoneNumber}</li> : <li><a href="sign-in" /></li>}


          <button onClick={handleLogout} className="text-black-700 hover:text-red-600">
            Logout
          </button>

        </ul>
      </div>
    </div>
  );
}
