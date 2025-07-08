import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { Bars2Icon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();
  const apiurl = import.meta.env.VITE_BACKEND_URL;
  const handlelogout=async ()=>{
     try {
      const response = await axios.get(`${apiurl}/logout`, {
        withCredentials: true, 
      });

    console.log(response.data.message);
    navigate('/login');
  } catch (error) {
    console.error("Logout failed:", error.response?.data?.message || error.message);
  }
  }
  
  const NavLinkItem = ({ to, label }) => (
    <Link
      to={to}
      className="text-white px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition font-medium"
    >
      {label}
    </Link>
  );

  const MobileNavLink = ({ to, label, setIsOpen }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className="text-white text-lg hover:underline"
    >
      {label}
    </Link>
  );


  return (
    <nav className="bg-gray-900 font-serif bg-opacity-80 shadow-lg px-6 py-3 top-0 w-full z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-9 w-9 shadow-xl/30 bg-white rounded-full" />
          <span className="text-2xl font-extrabold text-white tracking-wider">Online Judge</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLinkItem to="/" label="Home" />
          <NavLinkItem to="/problemlist" label="Problems" />
          <NavLinkItem to="/dashboard" label="Dashboard" />
          <NavLinkItem to="/compiler" label="Compiler" />
          <NavLinkItem to="/signup" label="Signup" />
          <NavLinkItem to="/login" label="Login" />
          <button
            onClick={handlelogout}
            className="bg-gradient-to-r shadow-xl/30 from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-purple-500 hover:to-blue-500 transition"
          >
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <span className="text-2xl">✖</span> : <Bars2Icon className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center gap-4 bg-gray-800 bg-opacity-90 p-6 rounded-lg transition">
          <MobileNavLink to="/" label="Home" setIsOpen={setIsOpen} />
          <MobileNavLink to="/problemlist" label="Problems" setIsOpen={setIsOpen} />
          <MobileNavLink to="/dashboard" label="Dashboard" setIsOpen={setIsOpen} />
          <MobileNavLink to="/compiler" label="Compiler" setIsOpen={setIsOpen} />
          <MobileNavLink to="/signup" label="Signup" setIsOpen={setIsOpen} />
          <MobileNavLink to="/login" label="Login" setIsOpen={setIsOpen} />
        </div>
      )}
    </nav>

  )
}


export default Navbar