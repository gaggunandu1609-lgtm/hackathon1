import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, CheckCircle, Timer, Menu, X, BookOpen, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || 'All';
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(600);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
             try {
                const response = await axios.get(`/questions`, {
                    params: { category, limit: 10 }
                });
                setQuestions(response.data);
                setLoading(false);
            } catch (err) {
                 console.error('Error fetching questions:', err);
                 setQuestions([
                    {
                        "id": 1,
                        "text": "What does <code>HTML</code> stand for?",
                        "options": ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language"],
                        "category": "HTML",
                        "difficulty": "Easy"
                    }
                 ]);
                 setLoading(false);
            }
        };
        fetchQuestions();
    }, [category]);

    useEffect(() => {
        if (timer > 0 && !loading) {
            const intervalId = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(intervalId);
        } else if (timer === 0) {
            submitQuiz();
        }
    }, [timer, loading]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleOptionSelect = (option) => {
        setAnswers({
            ...answers,
            [questions[currentIdx].id]: option
        });
    };

    const submitQuiz = async () => {
        const submission = {
            answers: questions.map(q => ({
                question_id: q.id,
                selected_option: answers[q.id] || null
            }))
        };
        
        try {
            const response = await axios.post('/submit', submission);
            navigate('/result', { state: { result: response.data, questions } });
        } catch (err) {
            console.error('Submit Error:', err);
            const score = questions.reduce((acc, q) => acc + (answers[q.id] ? 1 : 0), 0);
            navigate('/result', { state: { 
                 result: { score, total: questions.length, results: [] }, 
                 questions 
             }});
        }
    };

    if (loading) {
         return (
             <div className="min-h-screen bg-w3-bg dark:bg-[#111] flex items-center justify-center">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-w3-green"></div>
             </div>
         );
    }

    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-w3-bg dark:bg-zinc-950 flex">
            {/* Sidebar (Desktop) */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                        <h2 className="font-black text-xl tracking-tighter">QUIZ MENU</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100"><X size={20}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="px-6 mb-6">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                            <div className="mt-2 space-y-2">
                                {questions.map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setCurrentIdx(i)}
                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-colors ${currentIdx === i ? 'bg-w3-green text-white' : answers[questions[i].id] ? 'bg-green-100 text-w3-green dark:bg-w3-green/10' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800'}`}
                                    >
                                        Question {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-500 hover:text-w3-green cursor-pointer"><BookOpen size={18}/> Tutorials</div>
                            <div className="flex items-center gap-3 text-gray-500 hover:text-w3-green cursor-pointer"><Settings size={18}/> Settings</div>
                        </div>
                    </div>
                    <div className="p-6 bg-w3-bg dark:bg-zinc-800/50">
                        <button onClick={() => navigate('/')} className="w-full bg-w3-dark text-white py-2 rounded font-bold text-sm">Exit Quiz</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
                <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4 sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg"><Menu size={20}/></button>
                        <h1 className="text-xl font-bold dark:text-white">{category} Quiz Practice</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Timer size={18} className={timer < 60 ? 'text-red-500' : 'text-w3-green'} />
                            <span className={timer < 60 ? 'text-red-500 animate-pulse' : 'text-gray-500'}>{formatTime(timer)}</span>
                        </div>
                        <button onClick={submitQuiz} className="bg-w3-green text-white px-6 py-2 rounded font-bold text-sm hover:scale-105 transition-all">Submit</button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-w3-bg/30 dark:bg-zinc-950/30">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 md:p-12 mb-10 border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
                             {/* Question Header */}
                             <div className="flex justify-between items-start mb-10">
                                <div>
                                    <span className="text-sm font-black text-w3-green uppercase mb-2 block tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
                                    <div dangerouslySetInnerHTML={{ __html: currentQuestion.text }} className="text-2xl md:text-4xl font-bold leading-tight" />
                                </div>
                             </div>

                             {/* Options */}
                             <div className="space-y-4">
                                {currentQuestion.options.map((option, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${answers[currentQuestion.id] === option ? 'border-w3-green bg-w3-green/5 ring-4 ring-w3-green/10' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/30'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-colors ${answers[currentQuestion.id] === option ? 'bg-w3-green text-white' : 'bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700'}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="text-xl font-medium">{option}</span>
                                        </div>
                                        {answers[currentQuestion.id] === option && <CheckCircle className="text-w3-green" size={24}/>}
                                    </div>
                                ))}
                             </div>

                             {/* Progress Bar Bottom */}
                             <div className="absolute bottom-0 left-0 h-1 bg-w3-green transition-all" style={{ width: `${progress}%` }} />
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <button 
                                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                                disabled={currentIdx === 0}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-lg transition-all ${currentIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-white dark:bg-zinc-800 shadow-md hover:shadow-lg active:scale-95'}`}
                            >
                                <ChevronLeft size={24}/> Previous
                            </button>
                            <button 
                                onClick={() => currentIdx === questions.length - 1 ? submitQuiz() : setCurrentIdx(prev => prev + 1)}
                                className="bg-w3-dark text-white flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all active:scale-95 translate-y-0 hover:-translate-y-1"
                            >
                                {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ChevronRight size={24}/>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Quiz;
