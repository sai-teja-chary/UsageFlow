import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const ProtectedRoute = () => {
  const { user, userLoading, initialized } = useContext(AuthContext);

  const location = useLocation();

  if (!initialized) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
