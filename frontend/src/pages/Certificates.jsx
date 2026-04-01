import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowLeft, ShieldCheck } from 'lucide-react';

const Certificates = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-w3-bg dark:bg-[#111] text-w3-dark dark:text-gray-100 font-sans flex flex-col items-center py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <Award size={64} className="text-w3-green mb-6" />
        <h2 className="text-5xl md:text-7xl font-black mb-6">Earn Your Certificates</h2>
        <p className="text-xl md:text-2xl text-gray-500 mb-10 font-medium max-w-2xl">
          Get certified by completing our intensive coding quizzes. Demonstrate your skills and upgrade your resume.
        </p>
        
        <div className="bg-white dark:bg-zinc-900 border-4 border-w3-green p-10 rounded-3xl shadow-xl w-full flex flex-col items-center mb-12">
            <ShieldCheck size={48} className="text-yellow-500 mb-4" />
            <h3 className="text-3xl font-bold mb-4">CodeMastery Certified Developer</h3>
            <p className="text-gray-500 text-lg mb-6">Stand out among your peers with an official certification.</p>
            <button disabled className="bg-w3-green text-white font-bold py-3 px-8 rounded-full shadow-lg opacity-70 cursor-not-allowed uppercase">
              Certification Module Opening Soon
            </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="bg-w3-dark text-white px-10 py-4 rounded-full font-black text-xl transition-all hover:bg-black shadow-xl flex items-center gap-2"
        >
          <ArrowLeft size={24} /> Return to Quiz
        </button>
      </div>
    </div>
  );
};

export default Certificates;
