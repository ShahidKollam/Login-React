import { useAuth } from "../hooks/useAuth";
import headImg from '../assets/img_header_logo.png'; // Assuming you have the image path correctly defined
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full flex justify-end pr-8">
        <img src={headImg} alt="Header Logo" className="w-20 h-auto mb-4" />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:max-w-md flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl flex flex-col items-center justify-center px-4 mb-8">
          <img src={headImg} alt="Header Logo" className="w-8 h-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome</h1>
          <div className="mb-2 text-center">
            <p className="text-xl text-blue-600 font-semibold">{user?.email}</p>
            <p className="text-xl text-blue-500 font-semibold">{user?.phoneNumber}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className=" w-60 px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
};

export default Home;
