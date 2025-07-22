import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const apiurl = import.meta.env.VITE_BACKEND_URL;

  const {
    register,
    watch, 
    formState: { errors },
    handleSubmit,
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(`${apiurl}/signup`, data, { withCredentials: true });
      toast.success("Account created successfully! Please log in.");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(err.response.data.message || "A user with this email or username already exists.");
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
      console.error("Error occurred when signing up:", err);
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-100 p-4">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        theme="light"
      />
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-600">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-6">Join our community and start solving!</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <input
              placeholder="Username"
              className="input-box"
              {...register("username", { 
                  required: "Username is required", 
                  minLength: { value: 6, message: "Username must be at least 6 characters" } 
              })}
            />
            {errors.username && <p className="error-msg">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col">
            <input placeholder="User Type" value="User" readOnly className="input-box bg-gray-100 text-gray-600 cursor-not-allowed"
                  {...register("usertype")} />
           </div>

          {/* Full Name Input */}
          <div className="flex flex-col">
            <input
              placeholder="Full Name"
              className="input-box"
              {...register("fullname", { required: "Full Name is required" })}
            />
            {errors.fullname && <p className="error-msg">{errors.fullname.message}</p>}
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <input
              placeholder="Email"
              className="input-box"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
              })}
            />
            {errors.email && <p className="error-msg">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <input
              placeholder="Password"
              type="password"
              className="input-box"
              {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 8, message: "Password must be at least 8 characters" } 
              })}
            />
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Input with validation */}
          <div className="flex flex-col">
            <input
              placeholder="Confirm Password"
              type="password"
              className="input-box"
              {...register("confirmpassword", {
                required: "Please confirm your password",
                validate: value =>
                  value === password || "The passwords do not match"
              })}
            />
            {errors.confirmpassword && <p className="error-msg">{errors.confirmpassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;