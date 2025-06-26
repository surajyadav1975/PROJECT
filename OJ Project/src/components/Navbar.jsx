import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { Bars2Icon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();
  const handlelogout=async ()=>{
     try {
      const response = await axios.get('http://localhost:3000/logout', {
        withCredentials: true, 
      });

    console.log(response.data.message);
    navigate('/login');
  } catch (error) {
    console.error("Logout failed:", error.response?.data?.message || error.message);
  }
  }

  return (
    <nav className="bg-transparent shadow-md px-6 py-2">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-800">Online Judge</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="bg-white text-black border px-4 py-1 rounded-lg hover:bg-black hover:text-white transition">Home</Link>
          <Link to="/problemlist" className="bg-white text-black border px-4 py-1 rounded-lg hover:bg-black hover:text-white transition">Problems</Link>
          <Link to="/dashboard" className="bg-white text-black border px-4 py-1 rounded-lg hover:bg-black hover:text-white transition">Dashboard</Link>
          <Link to="/signup" className="bg-white text-black border px-4 py-1 rounded-lg hover:bg-black hover:text-white transition">Signup</Link>
          <Link to="/login" className="bg-white text-black border px-4 py-1 rounded-lg hover:bg-black hover:text-white transition">Login</Link>
          <button onClick={handlelogout} className="bg-white text-black border px-4 py-1 rounded-lg hover:bg-black hover:text-white transition">Logout</button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <span>X</span> : <Bars2Icon className='w-10 h-10'/> }
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-10 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black transition">Home</Link>
          <Link to="/problemlist" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black transition">Problems</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black transition">Dashboard</Link>
          <Link to="/signup" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black transition">Signup</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black transition">Login</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar