import React from 'react'
import { useForm } from "react-hook-form"
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate=useNavigate();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm()

  const onSubmit = async(data) => {
    try{
      const response= await axios.post("http://localhost:3000/signup", data, { withCredentials: true });
      console.log("user created");
      navigate('/');
    }
    catch(err){
      alert(err.response.data.message);
      console.log(" err occured when signingup");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-600">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-6">Join our community and start solving problems!</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <input
              placeholder="Username"
              className="input-box"
              {...register("username", { required: { value: true, message: "Username is required" }, minLength: { value: 6, message: "Minimum length is 6" } })}
            />
            {errors.username && <p className="error-msg">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col">
            <input
              placeholder="User Type"
              value="User"
              readOnly
              className="input-box bg-gray-100 text-gray-600 cursor-not-allowed"
              {...register("usertype")}
            />
          </div>

          <div className="flex flex-col">
            <input
              placeholder="Full Name"
              className="input-box"
              {...register("fullname", { required: { value: true, message: "Full Name is required" } })}
            />
            {errors.fullname && <p className="error-msg">{errors.fullname.message}</p>}
          </div>

          <div className="flex flex-col">
            <input
              placeholder="Email"
              className="input-box"
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
              })}
            />
            {errors.email && <p className="error-msg">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col">
            <input
              placeholder="Password"
              type="password"
              className="input-box"
              {...register("password", { required: { value: true, message: "Password is required" }, minLength: { value: 8, message: "At least 8 characters" } })}
            />
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col">
            <input
              placeholder="Confirm Password"
              type="password"
              className="input-box"
              {...register("confirmpassword", { required: { value: true, message: "Confirm Password is required" } })}
            />
            {errors.confirmpassword && <p className="error-msg">{errors.confirmpassword.message}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Sign Up
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