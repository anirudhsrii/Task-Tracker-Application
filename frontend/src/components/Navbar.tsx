import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext)!;
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
  const { user, logout } = useAuth(); // Cleaner usage
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          TaskTracker
        </Link>
        <div className="flex items-center gap-4">
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li>
                  <span className="font-semibold">Hello, {user.username}</span>
                </li>
                <li>
                   <button onClick={onLogout} className="flex items-center gap-1 hover:text-gray-200">
                      <LogOut size={18} /> Logout
                   </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-200">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-200">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
