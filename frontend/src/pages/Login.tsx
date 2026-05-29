import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="card w-96">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Sign in to pick up where you left off.</p>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} className="input-field" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} className="input-field" required />
          </div>
          <button type="submit" className="w-full btn-primary">Login</button>
        </form>
        <p className="mt-4 text-center">
          New here? <Link to="/register" className="text-blue-600 hover:text-blue-800">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
