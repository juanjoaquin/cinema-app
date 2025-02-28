import { CircleUserRound, Clapperboard, Clock, LogOut, Menu, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserData } from '../../services/authService';
import axios from 'axios';

export const Nav = () => {
  const token = localStorage.getItem('token');

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const [userOpen, setUserOpen] = useState(false);
  const toggleUser = () => setUserOpen(!userOpen);

  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [token]);

  const handleLogout = async () => {
    if (!token) return;

    try {
      await axios.post(import.meta.env.VITE_AUTH_LOGOUT, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className="bg-gray-800 px-6 py-4 w-full z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-200 text-xl">
            <Link to="/" className='flex items-center gap-2'>
              <Clapperboard className='text-gray-300' size={20} /> Cinema
            </Link>
          </h2>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
            <Link to="movies/upcoming-movies" className="text-gray-300 hover:text-white transition-colors">Upcoming Movies</Link>
            <Link to="/location" className="text-gray-300 hover:text-white transition-colors">Location</Link>
          </div>

          <div className='flex items-center '>
            <div className="relative">
              <button
                onClick={toggleUser}
                className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-700"
              >
                <User />
              </button>

              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-700 ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-in-out 
                ${userOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
              `}>
                {user ? (
                  <>
                    <span className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                      <CircleUserRound size={18} /> Hi {user.name}
                    </span>

                    <Link to="/tickets/my-tickets" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                      onClick={toggleUser}>
                      <Clock size={18} /> All tickets
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setUserOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                      onClick={() => setUserOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/auth/register"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                      onClick={() => setUserOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            <button onClick={toggleMenu} className="md:hidden text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-700">
              <Menu />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed top-0 left-0 h-full w-full bg-gray-900 text-white transform ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Menu</h3>
          <button 
            onClick={toggleMenu} 
            className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-700"
          >
            <X />
          </button>
        </div>
        <ul className="p-6 space-y-4">
          <li onClick={toggleMenu} className="cursor-pointer hover:text-gray-300 transition-colors">
            <Link to='/' className="block py-2">Home</Link>
          </li>
          <li onClick={toggleMenu} className="cursor-pointer hover:text-gray-300 transition-colors">
            <Link to='/' className="block py-2">Movies</Link>
          </li>
          <li onClick={toggleMenu} className="cursor-pointer hover:text-gray-300 transition-colors">
            <Link to='movies/upcoming-movies' className="block py-2">Upcoming Movies</Link>
          </li>
          <li onClick={toggleMenu} className="cursor-pointer hover:text-gray-300 transition-colors">
            <Link to="/location" className="block py-2">Location</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;