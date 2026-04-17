import React, { useState, useEffect } from 'react'; // Added useEffect import
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // 1. All state at the top
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [userName, setUserName] = useState("");

  // 2. useEffect to check if someone is already logged in (Optional but good)
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const { email, password } = formData;

  // 3. Handlers
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // The "res" variable is defined here inside the try block
      const res = await api.post('/auth/login', formData); 

      // Save to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userRole', res.data.user.role);

      // Redirect logic
      if (res.data.user.role === 'volunteer') {
        navigate('/volunteer-dashboard');
      } else {
        navigate('/ngo-dashboard');
      }
    } catch (err) {
      // Direct peer-to-peer tip: Use optional chaining ?. to avoid crashing on errors
      alert(err.response?.data?.msg || "Login Failed. Check your backend connection.");
    }
  };

  return (
    <div className="min-h-screen bg-volconn-blue flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-b-8 border-volconn-gold">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-volconn-navy tracking-tight">Volconn</h1>
          <p className="text-gray-400 font-medium">Welcome back, login to continue</p>
          {userName && <p className="text-xs text-volconn-accent mt-2 font-bold">Previous session: {userName}</p>}
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-volconn-gold" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-volconn-accent focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-volconn-gold" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-volconn-accent focus:bg-white outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-volconn-navy text-white py-4 rounded-2xl font-black text-lg hover:bg-volconn-accent transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            New to Volconn?{' '}
            <Link to="/register" className="text-volconn-accent font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;