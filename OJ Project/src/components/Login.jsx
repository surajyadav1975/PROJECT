import React from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Login() {
  const navigate=useNavigate();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm()

  const onSubmit = async(data) => {
    try{
      const response= await axios.post("http://localhost:3000/login", data, {
        withCredentials: true,
      });
      console.log("user loggedin");
      localStorage.setItem('userId', response.data.userid);
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
        <h1 className="text-3xl font-bold text-center text-blue-600">Welcome Back!</h1>
        <h2 className="text-lg text-gray-500 text-center mb-6">Log in to your OJ Platform account</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("password", {
                required: { value: true, message: "Password is required" },
                minLength: { value: 8, message: "At least 8 characters" }
              })}
            />
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Log In
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login