import {  useNavigate } from "react-router-dom";
import { useAuth } from "./authContext/auth-context";



const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  const navigate = useNavigate()
  return user ? children : navigate("/login", { replace: true }); ;
};

export default ProtectedRoute;
