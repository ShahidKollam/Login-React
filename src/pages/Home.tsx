import { useAuth } from "../hooks/useAuth";

const Home = () => {

  const {user} = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome {}</h1>
        <div className="mb-4">
          <p className="text-xl text-blue-600 font-semibold mb-2">{user?.displayName}</p>
          <p className="text-lg text-gray-700">{user?.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
