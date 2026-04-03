import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, PlusCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const Admin = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Question Form State
  const [qText, setQText] = useState('');
  const [qCat, setQCat] = useState('HTML');
  const [qDiff, setQDiff] = useState('Medium');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOpt, setCorrectOpt] = useState('1');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    const options = [opt1, opt2, opt3, opt4];
    const correct_answer = options[parseInt(correctOpt) - 1];

    try {
      const payload = {
        text: qText,
        options: options,
        correct_answer: correct_answer,
        category: qCat,
        difficulty: qDiff,
      };
      
      const res = await axios.post('/admin/questions', payload);
      if (res.data.success) {
        setSuccessMsg('Question successfully added to database!');
        setQText('');
        setOpt1(''); setOpt2(''); setOpt3(''); setOpt4('');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError('Failed to add question');
    }
  };

  if (!token || role !== 'provider') {
    return (
      <div className="min-h-screen bg-w3-bg dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h2 className="text-3xl font-black mb-4">Access Denied</h2>
        <p className="text-gray-500 mb-8 max-w-md">You do not have Provider access. Please log in with a Provider account to view this dashboard.</p>
        <button onClick={() => navigate('/login')} className="bg-w3-green text-white font-bold px-8 py-3 rounded-full hover:bg-w3-hover">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-w3-bg dark:bg-[#111] text-w3-dark dark:text-gray-100 font-sans flex flex-col items-center py-10 px-6">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg mb-8 border-l-8 border-w3-green">
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, Provider. Manage your quiz content here.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/')} className="flex items-center gap-2 font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"><ArrowLeft size={16} /> Student View</button>
             <button onClick={handleLogout} className="bg-w3-dark text-white px-4 py-2 rounded font-bold text-sm">Logout</button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl w-full">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-zinc-800 pb-4">
            <PlusCircle className="text-w3-green" />
            <h2 className="text-2xl font-bold">Add New Question</h2>
          </div>
          
          {successMsg && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center gap-2" role="alert">
              <CheckCircle size={20} />
              <span className="block sm:inline font-bold">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitQuestion} className="flex flex-col gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Question Text</label>
              <textarea 
                required value={qText} onChange={(e) => setQText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border p-3 rounded" rows="3"
                placeholder="E.g., What does HTML stand for?"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Category</label>
                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border p-3 rounded" value={qCat} onChange={(e) => setQCat(e.target.value)} placeholder="E.g., HTML" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Difficulty</label>
                <select className="w-full bg-gray-50 dark:bg-zinc-800 border p-3 rounded" value={qDiff} onChange={(e) => setQDiff(e.target.value)}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[opt1, opt2, opt3, opt4].map((opt, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input type="radio" name="correct" value={i+1} checked={correctOpt === String(i+1)} onChange={(e) => setCorrectOpt(e.target.value)} />
                  <input required placeholder={`Option ${i+1}`} className="w-full bg-gray-50 dark:bg-zinc-800 border p-3 rounded" value={opt} onChange={(e) => {
                    const setters = [setOpt1, setOpt2, setOpt3, setOpt4];
                    setters[i](e.target.value);
                  }} />
                </div>
              ))}
            </div>

            <button type="submit" className="bg-w3-green text-white font-black text-lg py-4 rounded-xl hover:bg-w3-hover transition-all mt-4 w-full md:w-auto self-end px-10">
              Publish Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
