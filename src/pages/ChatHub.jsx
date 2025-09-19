// src/pages/ChatHub.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/chatbot-bg.jpg';
import { FaComments, FaMicrophone, FaVideo } from 'react-icons/fa';

// Reusable card for the choices
const ChoiceCard = ({ to, icon, title, description }) => (
  <Link to={to} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center text-white hover:bg-white/20 hover:-translate-y-2 transition-all duration-300">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-white/80">{description}</p>
  </Link>
);


function ChatHub() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div> {/* Darker overlay */}
      
      <div className="relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">How would you like to connect?</h2>
        <p className="text-lg text-white/80 mb-12">Choose the option you're most comfortable with.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ChoiceCard
            to="/text-chat"
            icon={<FaComments className="text-blue-400" />}
            title="Text Chat"
            description="Chat with our friendly AI for instant, text-based support and guidance."
          />
          <ChoiceCard
            to="/voice-chat"
            icon={<FaMicrophone className="text-green-400" />}
            title="Voice Chat"
            description="Talk with our AI in a voice conversation. (Feature coming soon)"
          />
          <ChoiceCard
            to="/booking"
            icon={<FaVideo className="text-purple-400" />}
            title="Video Call"
            description="Schedule a private and secure video session with a professional counselor."
          />
        </div>
      </div>
    </div>
  );
}

export default ChatHub;