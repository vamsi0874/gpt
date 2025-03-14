import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData) => {
    try {

    
    const response = await authService.login(userData.email, userData.password);
    // console.log("response", response);
    if (response) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response));
        // console.log('response',response)
         return response
      }
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed');
    }
  }

  const signup = async (values) => {
    try {
      const {name, email, password} = values
      const response = await authService.signup(name, email, password);
      // console.log('response',response)
      if (response) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response));
        // console.log('response',response)
         return response
      }
    } catch (error) {
      console.error('Signup failed', error);
      throw new Error('Signup failed');
    }
  };


  const logout = () => {
    setUser(null);
  
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
