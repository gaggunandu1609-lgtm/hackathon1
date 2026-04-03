import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://hackathon1-1-rdqt.onrender.com/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        
        if (res.data.role === 'provider') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-w3-bg dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-zinc-900 border-t-8 border-w3-green rounded-2xl shadow-2xl p-8 max-w-sm w-full">
        <div className="flex flex-col items-center mb-6">
          <LogIn size={48} className="text-w3-dark dark:text-gray-300 mb-2" />
          <h2 className="text-3xl font-black text-center text-w3-dark dark:text-white">Sign In</h2>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center font-bold">{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Username" 
            className="bg-gray-100 dark:bg-zinc-800 p-3 rounded text-black dark:text-white border border-gray-300 dark:border-zinc-700 focus:outline-w3-green"
            value={username} onChange={(e) => setUsername(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" 
            className="bg-gray-100 dark:bg-zinc-800 p-3 rounded text-black dark:text-white border border-gray-300 dark:border-zinc-700 focus:outline-w3-green"
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          <button type="submit" className="bg-w3-green text-white font-bold p-3 rounded hover:bg-w3-hover mt-2">Login to Account</button>
        </form>
        <button onClick={() => navigate('/')} className="text-sm text-w3-green font-bold w-full text-center mt-6 hover:underline">Or Create an Account</button>
      </div>
    </div>
  );
};

export default Login;
