import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur text-white shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          TaskFlow
        </Link>
        <div className="flex items-center gap-4">
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li>
                  <span className="font-semibold">Hi, {user.username}</span>
                </li>
                <li>
                   <button onClick={onLogout} className="flex items-center gap-1 hover:text-gray-200">
                      <LogOut size={18} /> Sign out
                   </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-200">Log in</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-200">Create account</Link>
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
