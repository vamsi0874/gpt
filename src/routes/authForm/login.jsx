
// import { useState } from 'react';

// import { useMutation } from '@tanstack/react-query';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../authContext/auth-context.jsx';

// import { loginSchema } from '../../services/schema.js';


// export default function LoginPage() {
//   const { login } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState(null);

//   const { mutate, isPending } = useMutation({
//     mutationFn: login,
//     onSuccess: () => {
      
//     },
//     onError: (err) => {
//       console.error("Login failed", err);
//       setError(err?.respons.data.errors || 'Login failed. Please try again.');
//     }
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = (data) => {
//     mutate(data);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-black-100 px-4">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-black-100 shadow-lg rounded-xl p-8 w-full max-w-md"
//       >
//         <h2 className="text-3xl font-bold text-center text-white mb-6">login</h2>

       
  
//         <div className="mb-5">
//           <input
//             {...register('email')}
//             placeholder="email"
//             className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//           )}
//         </div>
     

       
//         <div className="mb-6 relative">
//           <input
//             {...register('password')}
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Password"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
//           />
//           <span
//             className="absolute right-4 top-3 text-gray-600 cursor-pointer"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
//           </span>
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//           )}
//         </div>

     
//         {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

     
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition disabled:opacity-50"
//         >
//           {isPending ? 'Logging in...' : 'Login'}
//         </button>

     
//         <p className="mt-6 text-center text-sm text-gray-700">
//           Don&apos;t have an account? &apos;
//           <Link to="/signup" className="text-green-600 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import  { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthContext, useAuth } from "../../authContext/auth-context";
import { useNavigate } from "react-router-dom";
import "./authForm.css";



const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {user} = useContext(AuthContext)

  if(user){
    navigate("/dashboard");
    return
  }

  const onSubmit = async (data) => {

      const res = await login(data); 
      console.log("Login Response:", res);
      if(res){
        navigate("/dashboard");
      }
      
  };

  return (
    <div className="auth-container text-black">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

        <div className="input-group">
          <input {...register("email")} type="email" placeholder="Email" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <input {...register("password")} type="password" placeholder="Password" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="auth-button">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="toggle-text">
        Don't have an account?
        <button onClick={() => navigate("/signup")} className="toggle-button">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
