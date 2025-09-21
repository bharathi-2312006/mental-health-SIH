import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaRobot, FaClipboardList, FaBook, FaChartLine, FaHome } from 'react-icons/fa';
import CalmParticleCanvas from '../components/CalmParticles'; // 1. Import the new particle animation
import { motion } from 'framer-motion';

// --- Data for each section/reel ---
const sectionsData = [
  {
    id: "my-journey",
    to: "/my-journey",
    icon: <FaChartLine />,
    title: "My Journey",
    description: "Track your screening history and private journal entries.",
    color: "from-yellow-500/80 to-amber-600/80"
  },
  {
    id: "ai-coach",
    to: "/chatbot",
    icon: <FaRobot />,
    title: "AI Wellness Coach",
    description: "Chat with our AI for immediate, supportive guidance.",
    color: "from-purple-500/80 to-indigo-600/80"
  },
  {
    id: "screening",
    to: "/screening",
    icon: <FaClipboardList />,
    title: "Mental Health Screening",
    description: "A confidential questionnaire to understand your needs.",
    color: "from-blue-500/80 to-sky-600/80"
  },
  {
    id: "resources",
    to: "/resources",
    icon: <FaBook />,
    title: "Interactive Resources",
    description: "Fun, engaging activities to boost your mood and relax.",
    color: "from-green-500/80 to-emerald-600/80"
  }
];

// --- Reusable "Reel" Card Component ---
const SectionCard = ({ section }) => (
  <div id={section.id} className="h-screen w-full flex-shrink-0 flex flex-col items-center justify-center text-center p-8 relative scroll-snap-align-start">
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${section.color}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.8 }}
      transition={{ duration: 1 }}
    />
    <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ amount: 0.8 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="text-6xl mb-6"
      >
        {section.icon}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.8 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        className="text-4xl font-bold mb-3"
      >
        {section.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.8 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
        className="text-white/80 max-w-sm mb-8"
      >
        {section.description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ amount: 0.8 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
      >
        <Link to={section.to} className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-full transition-colors">
          Explore
        </Link>
      </motion.div>
    </div>
  </div>
);

// --- Sidebar Navigation Component ---
const Sidebar = ({ sections, onScrollTo }) => (
  <motion.nav 
    className="fixed top-0 left-0 h-full bg-black/30 backdrop-blur-lg p-4 z-20 flex flex-col justify-center"
    initial={{ x: -100 }}
    animate={{ x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <ul className="space-y-4">
      <li>
        <button onClick={() => onScrollTo('welcome')} className="w-full flex items-center gap-4 p-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          <FaHome size={20} />
          <span className="font-semibold">Home</span>
        </button>
      </li>
      {sections.map(section => (
        <li key={section.id}>
          <button onClick={() => onScrollTo(section.id)} className="w-full flex items-center gap-4 p-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            {React.cloneElement(section.icon, { size: 20 })}
            <span className="font-semibold">{section.title}</span>
          </button>
        </li>
      ))}
    </ul>
  </motion.nav>
);

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          navigate('/admin');
          return;
        }
        setUserName(user.displayName ? user.displayName.split(' ')[0] : 'User');
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };
  
  const handleScrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Authenticating...</div>;
  }

  return (
    <div className="h-screen w-full bg-black text-white relative overflow-hidden">
      {/* 2. Replace the old video background with the new particle animation */}
      <CalmParticleCanvas />
      <div className="absolute inset-0 bg-black/40"></div>
      
      <Sidebar sections={sectionsData} onScrollTo={handleScrollTo} />

      <main className="w-full h-full overflow-y-auto scroll-snap-type-y-mandatory pl-48">
        <button onClick={handleLogoutClick} className="fixed top-6 right-6 z-20 bg-red-600/80 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition-colors">
          Logout
        </button>

        {/* --- Welcome Section --- */}
        <div id="welcome" className="h-screen w-full flex-shrink-0 flex items-center justify-center text-center p-8 relative scroll-snap-align-start">
           <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} >
             <h1 className="text-5xl md:text-6xl font-bold mb-2">{greeting}, {userName}!</h1>
             <p className="text-lg md:text-xl text-white/80">Welcome to your personal wellness space.</p>
           </motion.div>
        </div>

        {/* --- Map over the data to create a section for each option --- */}
        {sectionsData.map((section, index) => (
          <SectionCard key={index} section={section} />
        ))}
      </main>
    </div>
  );
}

export default Dashboard;

