import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Globe, Database, ArrowLeft } from 'lucide-react';

const Tutorials = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#D9EEE1] dark:bg-[#111] text-w3-dark dark:text-gray-100 font-sans flex flex-col items-center py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <BookOpen size={64} className="text-w3-green mb-6" />
        <h2 className="text-5xl md:text-7xl font-black mb-6">Learn to Code</h2>
        <p className="text-xl md:text-2xl text-w3-dark dark:text-gray-300 mb-10 font-medium max-w-2xl">
          With our free, CodeMastery tutorials, you will learn how to code from scratch. More comprehensive guides are coming soon!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {['HTML & CSS', 'JavaScript Context', 'Python Basics', 'Advanced PHP', 'SQL Mastery', 'React Context API'].map((topic, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg border-l-8 border-w3-green text-left flex flex-col justify-between">
              <h3 className="text-xl font-bold mb-3">{topic}</h3>
              <p className="text-gray-500 text-sm mb-4">Detailed step-by-step guides with code examples.</p>
              <button disabled className="bg-gray-200 text-gray-500 font-bold py-2 rounded uppercase text-sm w-full cursor-not-allowed">Coming Soon</button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/')}
          className="bg-w3-dark text-white px-10 py-4 rounded-full font-black text-xl transition-all hover:bg-black shadow-xl flex items-center gap-2"
        >
          <ArrowLeft size={24} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default Tutorials;
