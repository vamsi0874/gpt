
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from './layouts/rootLayout/RootLayout.jsx';

import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.jsx';
import DashboardPage from './routes/dashboardPage/DashboardPage.jsx';
import ChatPage from './routes/chatPage/ChatPage.jsx';
import ProtectedRoute from "./ProtectRoute.jsx";
import { AuthProvider } from "./authContext/auth-context.jsx";
import AuthForm from "./routes/authForm/auth-form.jsx";
import Homepage from "./routes/homepage/HomePage.jsx";
import LoginPage from "./routes/authForm/login.jsx";
import SignupPage from "./routes/authForm/signup.jsx";


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        element:( 
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
          ),
        children: [
          {
            path: "/dashboard",
            
            
                element:( 
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
                ),
           
            
          },
          {
            path: "/dashboard/chats/:id",
            element:( 
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
              ),
          },
        ],
      },
    ],
  },
],
// { basename: "/" }
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <AuthProvider>
  
    <RouterProvider router={router} />
 
    </AuthProvider>
  </React.StrictMode>
);