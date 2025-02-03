import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../authContext/auth-context";
import { useNavigate } from "react-router-dom";
import "./authForm.css";

// Validation Schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
  });

  const onSubmit = async (data) => {
    // console.log(isSignup ? "Signup Data:" : "Login Data:", data);
    if(isSignup){
      // console.log(data)
     await signup(data); // Store user in context
      navigate("/dashboard"); // Redirect after login
    }
    else{
      // console.log(data)
      await login(data); // Store user in context
    }
   
    // navigate("/dashboard"); // Redirect after login
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        {isSignup && (
          <div className="input-group">
            <input {...register("name")} placeholder="Full Name" />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>
        )}

        <div className="input-group">
          <input {...register("email")} type="email" placeholder="Email" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <input {...register("password")} type="password" placeholder="Password" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="auth-button">
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <p className="toggle-text">
        {isSignup ? "Already have an account?" : "Don't have an account?"}
        <button onClick={() => setIsSignup(!isSignup)} className="toggle-button">
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
