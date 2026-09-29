import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader fullscreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;