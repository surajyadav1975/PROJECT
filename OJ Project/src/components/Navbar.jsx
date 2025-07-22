import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars2Icon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handlelogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavLinkItem = ({ to, label }) => (
    <Link
      to={to}
      className="text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
    >
      {label}
    </Link>
  );

  const MobileNavLink = ({ to, label, action }) => (
    <Link
      to={to}
      onClick={() => {
        setIsOpen(false);
        if (action) action();
      }}
      className="block text-center w-full py-3 text-white text-lg hover:bg-gray-700 rounded-md"
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-gray-900 font-serif bg-opacity-80 shadow-lg px-6 py-3 top-0 w-full z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-9 w-9 bg-white rounded-full" />
          <span className="text-2xl font-extrabold text-white tracking-wider">Online Judge</span>
        </Link>

        {/* Desktop Menu */}
         <div className="hidden md:flex items-center gap-4">
          <NavLinkItem to="/" label="Home" />

          {isLoggedIn ? (
            <>
              <NavLinkItem to="/problemlist" label="Problems" />
              <NavLinkItem to="/compiler" label="Compiler" />
              <NavLinkItem to="/dashboard" label="Dashboard" />
              <button className="bg-red-500 text-white px-4 py-2 hover:cursor-pointer rounded-lg hover:bg-red-600 transition font-bold" onClick={handlelogout} >
                Logout
              </button>
            </>
          ) : (
            <NavLinkItem to="/login" label="Login" />
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <span className="text-3xl font-bold">✖</span> : <Bars2Icon className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center gap-2 bg-gray-800 bg-opacity-95 p-4 rounded-lg">
          <MobileNavLink to="/" label="Home" />
          <MobileNavLink to="/problemlist" label="Problems" />
          <MobileNavLink to="/compiler" label="Compiler" />
          
          {isLoggedIn ? (
            <>
              <MobileNavLink to="/dashboard" label="Dashboard" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  handlelogout();
                }}
                className="w-full text-center py-3 bg-red-500 text-white text-lg rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <MobileNavLink to="/login" label="Login"/>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;