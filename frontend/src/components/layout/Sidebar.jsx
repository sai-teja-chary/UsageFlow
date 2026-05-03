import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navItemClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-60 h-screen border-r bg-white p-4 flex flex-col">
      
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold mb-6">UsageFlow</h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={navItemClass}>
          Dashboard
        </NavLink>

        <NavLink to="/explore-apis" className={navItemClass}>
          Explore APIs
        </NavLink>

        <NavLink to="/keys" className={navItemClass}>
          API Keys
        </NavLink>

        <NavLink to="/billing" className={navItemClass}>
          Billing
        </NavLink>

        <NavLink to="/invoices" className={navItemClass}>
          Invoice
        </NavLink>

        <hr className="my-3" />

        {/* 🔥 Dynamic Section */}

        {/* 👤 Consumer */}
        {user?.role === "consumer" && (
          <NavLink
            to="/upgrade"
            className={`text-blue-600 font-medium ${navItemClass}`}
          >
            🚀 Become a Provider
          </NavLink>
        )}

        {/* 🧑‍💼 Provider */}
        {user?.role === "owner" && (
          <>
            <NavLink to="/my-apis" className={navItemClass}>📦 My APIs</NavLink>
            <NavLink to="/create-api" className={navItemClass}>➕ Create API</NavLink>
          </>
        )}

      </nav>

      {/* Bottom section (optional future use) */}
      <div className="mt-auto text-xs text-gray-400">
        © {new Date().getFullYear()} UsageFlow
      </div>
    </div>
  );
};
