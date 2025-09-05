import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null; // or loader while checking

  return authUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
