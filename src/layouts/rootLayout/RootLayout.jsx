import { Link, Outlet, useNavigate } from "react-router-dom";
import "./rootLayout.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../../authContext/auth-context";
import { useState } from "react";

const queryClient = new QueryClient();

const RootLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // ✅ Single call to useAuth()

  // console.log("user", user);
  const [isHovered, setIsHovered] = useState(false);
  const handleClick = () => {
    if (user) {
      logout();
      navigate("/");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="rootLayout">
        <header>
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Logo" />
            <span>VAMSI AI</span>
          </Link>
          <div className="user">
            {user ? (
            <button
            style={{
              padding: "10px 20px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            {isHovered ? "Logout" : `${user.name}`}
          </button>
           
            ) : (
              ""
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;
