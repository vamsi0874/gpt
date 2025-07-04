
import  { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthContext, useAuth } from "../../authContext/auth-context";
import { useNavigate } from "react-router-dom";
import "./authForm.css";
import { signupSchema } from "../../services/schema"; 




const SignupPage = () => {

  const {  signup } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors , isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const {user} = useContext(AuthContext)

  if(user){
    navigate("/dashboard");
    return
  }

  const onSubmit = async (data) => {

       const res = await signup(data); 
   
        if(res){
          navigate("/dashboard");
        }
 
  };

  return (
    <div className="auth-container">

      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Signup</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
     
          <div className="input-group">
            <input {...register("name")} 
            
            placeholder="Full Name" />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>
      

        <div className="input-group">
          <input {...register("email")} type="email" 
       
          placeholder="Email" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <input {...register("password")} type="password" placeholder="Password" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="auth-button">
          {isSubmitting ? "Signing up..." : "Sign Up"}

        </button>
      </form>

      <p className="toggle-text">
        Already have an account?
        <button onClick={() => navigate('/login')} className="toggle-button">
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupPage;
