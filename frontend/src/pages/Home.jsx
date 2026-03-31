import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, ShieldCheck, Zap, Code, Database, Globe, Layers, BarChart } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CAT_ICONS = {
    'HTML': <Globe className="text-orange-500" />,
    'CSS': <Layers className="text-blue-500" />,
    'JavaScript': <Code className="text-yellow-500" />,
    'Python': <Zap className="text-blue-400" />,
    'PHP': <Database className="text-purple-500" />,
    'Data Structures': <BarChart className="text-green-500" />,
    'Data Science': <BarChart className="text-indigo-500" />,
    'React': <Code className="text-cyan-400" />,
    'All': <PlayCircle className="text-w3-green" />
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories');
        setCategories(['All', ...response.data.categories]);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories(['All', 'HTML', 'CSS', 'JavaScript', 'Python', 'PHP', 'Data Science', 'Data Structures']);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const startQuiz = (category) => {
    navigate(`/quiz?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-w3-bg dark:bg-[#111] text-w3-dark dark:text-gray-100 font-sans flex flex-col items-center">
      {/* Top Navbar */}
      <nav className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Globe className="text-w3-green" size={32} />
          <h1 className="text-2xl font-black tracking-tighter">W3Schools <span className="text-w3-green">QUIZ</span></h1>
        </div>
        <div className="hidden md:flex gap-6 font-bold text-sm">
          <a href="#" className="hover:text-w3-green">TUTORIALS</a>
          <a href="#" className="hover:text-w3-green">EXERCISES</a>
          <a href="#" className="hover:text-w3-green">CERTIFICATES</a>
        </div>
      </nav>

      {/* Hero / Header Section */}
      <div className="w-full bg-w3-dark text-white py-20 px-6 text-center overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in-down">The Online Quiz Practice</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 font-medium">
            Master your coding skills with interactive quizzes in HTML, CSS, JavaScript, PHP, Data Science and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => startQuiz('All')}
              className="bg-w3-green hover:bg-w3-hover text-white px-10 py-4 rounded-full font-black text-xl transition-all hover:scale-105 shadow-xl"
            >
              Start Your First Quiz
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-w3-dark px-10 py-4 rounded-full font-black text-xl transition-all">
              Try Tutorial &raquo;
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-w3-green/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl w-full p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-300 dark:border-zinc-800 pb-6">
          <div>
            <h2 className="text-4xl font-black mb-2">Practice by Category</h2>
            <p className="text-gray-500">Pick a topic and start answering questions to test your knowledge.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <span className="bg-w3-blue px-4 py-1 rounded text-xs font-bold text-w3-dark">MODERN</span>
            <span className="bg-w3-pink px-4 py-1 rounded text-xs font-bold text-w3-dark">PROFESSIONAL</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-w3-green"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div 
                key={cat} 
                onClick={() => startQuiz(cat)}
                className="bg-white dark:bg-zinc-900 border-b-8 border-transparent hover:border-w3-green p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-2 flex flex-col"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-2xl group-hover:bg-w3-green/10 transition-colors">
                    {React.cloneElement(CAT_ICONS[cat] || <ShieldCheck className="text-gray-400" />, { size: 32 })}
                  </div>
                  <div className="text-xs font-bold text-gray-400 group-hover:text-w3-green transition-colors flex items-center gap-1 uppercase">
                    Practice <Code size={14} />
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3">{cat}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">Interactive quiz for {cat} fundamentals and advanced concepts.</p>
                <div className="flex items-center text-w3-green font-bold group-hover:underline">
                  Start Quiz &raquo;
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learn Section (W3 style) */}
      <div className="w-full bg-[#D9EEE1] text-w3-dark py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Want to Learn Before You Quiz?</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto font-medium text-gray-700">
          We offer the best free tutorials for all your favorite programming languages. Check out our detailed guides!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
           <button className="bg-w3-dark text-white px-10 py-3 rounded-full font-bold hover:bg-black transition-all">Browse Tutorials</button>
           <button className="bg-white text-w3-dark px-10 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-sm">View Exercises</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
