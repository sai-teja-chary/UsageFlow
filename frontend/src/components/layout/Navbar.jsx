import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="h-14 px-6 flex items-center justify-between border-b bg-white">

        <span className="text-md text-black text-xl">
          {user?.name}
        </span>

        <button
          onClick={logout}
          className="text-sm px-3 py-1.5 bg-black text-white rounded-lg hover:opacity-90"
        >
          Logout
        </button>
      </div>
  );
};