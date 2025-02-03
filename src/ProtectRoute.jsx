import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext/auth-context";

import AuthForm from "./routes/authForm/auth-form";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // return user ? children : <Navigate to="/" />;
  return user ? children : <AuthForm />;
};

export default ProtectedRoute;
