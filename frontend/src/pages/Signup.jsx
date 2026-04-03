import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, BookOpen, ShieldAlert } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/signup', { username, password, role });
      if (res.data.success) {
        setSuccess('Signup successful! Redirecting to login...');
        setError('');
        setTimeout(() => navigate('/login'), 1500); // redirect to login
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Username might exist.');
    }
  };

  return (
    <div className="min-h-screen bg-w3-bg dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="bg-white dark:bg-zinc-900 border-t-8 border-w3-green rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <UserPlus size={48} className="text-w3-dark dark:text-gray-300 mb-2" />
          <h2 className="text-3xl font-black text-center text-w3-dark dark:text-white">Create Account</h2>
          <p className="text-gray-500 mt-2 text-center text-sm">Sign up as a Student to take quizzes, or a Provider to create them.</p>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center font-bold bg-red-50 p-2 rounded">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center font-bold bg-green-50 p-2 rounded">{success}</p>}
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Choose Username" 
            className="bg-gray-100 dark:bg-zinc-800 p-3 rounded text-black dark:text-white border border-gray-300 dark:border-zinc-700 focus:outline-w3-green w-full"
            value={username} onChange={(e) => setUsername(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Choose Password" 
            className="bg-gray-100 dark:bg-zinc-800 p-3 rounded text-black dark:text-white border border-gray-300 dark:border-zinc-700 focus:outline-w3-green w-full"
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          
          <div className="flex gap-4 mt-2">
            <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all text-center flex flex-col items-center gap-2 ${role === 'student' ? 'border-w3-green bg-green-50 dark:bg-zinc-800 text-w3-green' : 'border-gray-200 text-gray-400 hover:border-w3-green'}`}>
              <BookOpen size={24} />
              <input type="radio" value="student" checked={role === 'student'} onChange={(e) => setRole(e.target.value)} className="hidden" />
              <span className="font-bold">Student</span>
            </label>
            <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all text-center flex flex-col items-center gap-2 ${role === 'provider' ? 'border-w3-green bg-green-50 dark:bg-zinc-800 text-w3-green' : 'border-gray-200 text-gray-400 hover:border-w3-green'}`}>
              <ShieldAlert size={24} />
              <input type="radio" value="provider" checked={role === 'provider'} onChange={(e) => setRole(e.target.value)} className="hidden" />
              <span className="font-bold">Provider</span>
            </label>
          </div>

          <button type="submit" className="bg-w3-dark text-white font-bold p-4 rounded-xl hover:bg-black mt-4 transition-all">Sign Up Now</button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <span onClick={() => navigate('/login')} className="text-w3-green font-bold cursor-pointer hover:underline">Log in here</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
