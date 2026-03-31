import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, RefreshCcw, Home, Award, ArrowRight, Share2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, questions } = location.state || { result: null, questions: [] };

    if (!result) {
        return (
            <div className="min-h-screen bg-w3-bg flex flex-col items-center justify-center p-10 text-center">
               <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-3xl shadow-2xl">
                    <h2 className="text-4xl font-black mb-6 text-w3-dark leading-tight">Oops! <br/>No Result Data Found</h2>
                    <button 
                            onClick={() => navigate('/')} 
                            className="flex items-center gap-2 bg-w3-green text-white px-10 py-4 rounded-full font-black text-lg hover:bg-w3-hover transition-all"
                        >
                        <Home size={24} /> Back to Home
                    </button>
               </motion.div>
            </div>
        );
    }

    const { score, total, results } = result;
    const percentage = Math.round((score / total) * 100);
    
    // Performance assessment
    const getMessage = () => {
        if (percentage >= 90) return { title: "Outstanding Performance!", color: "text-green-500", bg: "bg-green-100", icon: <Award size={80} className="text-green-500" />, desc: "You've mastered these concepts! Ready for a certification?" };
        if (percentage >= 70) return { title: "Well Done!", color: "text-w3-green", bg: "bg-w3-bg", icon: <Check size={80} className="text-w3-green" />, desc: "Great job! A little more practice and you'll be an expert." };
        if (percentage >= 50) return { title: "Good Effort!", color: "text-yellow-500", bg: "bg-yellow-50", icon: <RefreshCcw size={80} className="text-yellow-500" />, desc: "You're on the right track. Try reviewing the tutorials." };
        return { title: "Keep Practicing!", color: "text-red-500", bg: "bg-red-50", icon: <RefreshCcw size={80} className="text-red-500" />, desc: "Don't give up! Coding takes time and practice." };
    };

    const status = getMessage();

    const feedbackDetails = questions.map((q, idx) => {
        const res = results.find(r => r.question_id === q.id);
        return {
            ...q,
            selected_option: res?.selected_option || 'No answer provided',
            correct_answer: res?.correct_answer || 'See Tutorial',
            is_correct: res?.is_correct || false
        };
    });

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans pb-20">
            {/* Success Header */}
            <header className="bg-w3-dark text-white py-16 px-6 text-center">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter">Quiz Results</h1>
                    <p className="text-xl text-gray-400">Mastery is a journey, not a destination.</p>
                </motion.div>
            </header>

            <main className="max-w-5xl mx-auto -mt-16 px-6">
                {/* Result Hero Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden mb-16 border border-gray-100 dark:border-zinc-800"
                >
                    <div className="flex flex-col md:flex-row">
                        <div className={`md:w-2/5 p-12 text-center flex flex-col items-center justify-center border-r border-gray-100 dark:border-zinc-800 ${status.bg} dark:bg-zinc-800/20`}>
                            <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-full shadow-xl">
                                {status.icon}
                            </div>
                            <h2 className={`text-4xl font-black mb-4 leading-tight ${status.color}`}>
                               {status.title}
                            </h2>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                {status.desc}
                            </p>
                            <div className="text-2xl font-black text-gray-400">
                                <span className={status.color}>{score}</span> / {total} Correct
                            </div>
                        </div>

                        <div className="md:w-3/5 p-12 flex flex-col justify-center">
                            <h3 className="text-2xl font-black mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">Quiz Summary</h3>
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div>
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Score Percentage</span>
                                    <div className="text-4xl font-black text-w3-dark dark:text-white">{percentage}%</div>
                                </div>
                                <div>
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Time spent</span>
                                    <div className="text-4xl font-black text-w3-dark dark:text-white">Active</div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => navigate('/')} className="bg-w3-dark text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95">
                                    <Home size={20}/> Back Home
                                </button>
                                <button className="border-2 border-gray-200 dark:border-zinc-700 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95">
                                    <Share2 size={20}/> Share Result
                                </button>
                                <button onClick={() => navigate(-1)} className="bg-w3-green text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-w3-hover transition-all shadow-lg active:scale-95">
                                    <RefreshCcw size={20}/> Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Feedback Section */}
                <h3 className="text-3xl font-black mb-10 flex items-center gap-4">
                    Detailed Corrections <ArrowRight className="text-w3-green"/>
                </h3>

                <div className="space-y-6">
                    {feedbackDetails.map((q, idx) => (
                        <div key={idx} className={`bg-white dark:bg-zinc-900 border-2 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all ${q.is_correct ? 'border-w3-green/20 hover:border-w3-green/50' : 'border-red-200 hover:border-red-500/50'}`}>
                            <div className="p-8">
                                <div className="flex justify-between items-start gap-6 mb-6">
                                    <div className="flex-1">
                                         <div className="flex items-center gap-3 mb-4">
                                            <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter ${q.is_correct ? 'bg-w3-blue text-w3-green' : 'bg-red-100 text-red-500'}`}>
                                                {q.is_correct ? 'Correct' : 'Incorrect'}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{q.category}</span>
                                         </div>
                                         <div dangerouslySetInnerHTML={{ __html: q.text }} className="text-2xl font-bold text-w3-dark dark:text-white leading-tight" />
                                    </div>
                                    <div className={`p-3 rounded-2xl ${q.is_correct ? 'bg-w3-green text-white' : 'bg-red-500 text-white'}`}>
                                        {q.is_correct ? <Check size={32}/> : <X size={32}/>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`p-6 rounded-2xl border-2 ${q.is_correct ? 'border-w3-green/20 bg-w3-green/5' : 'border-red-100 bg-red-50/30'}`}>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Selected Answer</span>
                                        <div className="text-lg font-bold">{q.selected_option}</div>
                                    </div>
                                    {!q.is_correct && (
                                        <div className="p-6 rounded-2xl border-2 border-w3-green/20 bg-w3-green/5">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Correct Answer</span>
                                            <div className="text-lg font-bold text-w3-green">{q.correct_answer}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* W3-style call to action bottom */}
                <div className="mt-20 bg-w3-blue dark:bg-zinc-900 border-2 border-w3-green/20 rounded-[40px] p-12 text-center">
                    <h2 className="text-4xl font-black mb-6">Level Up Your Skills!</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        Become a certified Professional Developer by completing our formal courses and passing the final exams.
                    </p>
                    <button className="bg-w3-green text-white px-12 py-4 rounded-full font-black text-xl hover:scale-105 transition-all shadow-xl flex items-center gap-3 mx-auto">
                        <BookOpen size={24}/> View Formal Exercises &raquo;
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Result;
