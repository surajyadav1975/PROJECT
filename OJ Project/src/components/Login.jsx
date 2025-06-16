import React from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import axios from 'axios';

function Login() {
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
    }
    catch(err){
      alert(err.response.data.message);
      console.log(" err occured when signingup");
    }
  };
  

  return (
    <div className="min-h-screen flex">

      <div className="flex items-center w-full mt-10 justify-center p-8">
        <div className="max-w-md space-y-4 p-10 rounded-lg shadow-xl/30">
          <h1 className="text-3xl font-bold text-black">Hello & Welcome</h1>
          <h2 className="text-xl text-gray-500">To Our OJ Platform</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              placeholder="Username"
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none'
              {...register("username", 
                { required: {value:true, message:"First name is required"}, 
                minLength: {value:6, message:"Minimum length is 6"},})}
            />
            {errors.username && (
              <p>{errors.username.message}</p>
            )}
            <input
              placeholder="Email"
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none'
              {...register("email", { required: {value:true, message:"Email is required"}, 
                pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                    },})}
            />
            {errors.email && (
              <p>{errors.email.message}</p>
            )}
            <input
              placeholder="Password"
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none'
              {...register("password", { required: {value:true, message:"Password is required"}, minLength: {value:8, message:"Atleast 8 char"} })}
            />
            {errors.password && (
              <p>{errors.password.message}</p>
            )}
            <input className='w-full bg-blue-400 p-3 border border-gray-300 rounded-md' type="submit" />
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login