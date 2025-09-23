import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaMicrophone, FaVideo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import NeuralNetworkCanvas from '../components/NeuralNetwork.jsx'; // ✅ Import animation

// Reusable card for the choices
const ChoiceCard = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center text-white hover:bg-white/20 hover:-translate-y-2 transition-all duration-300"
  >
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-white/80">{description}</p>
  </Link>
);

function ChatHub() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      {/* 🔹 Neural Network Background Animation */}
      <NeuralNetworkCanvas />
      <div className="absolute inset-0 bg-black/60"></div> {/* Dark overlay for contrast */}

      <div className="relative z-10 text-center">
        {/* Titles */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          {t('chatHubTitle')}
        </h2>
        <p className="text-lg text-white/80 mb-12">{t('chatHubDesc')}</p>

        {/* Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ChoiceCard
            to="/text-chat"
            icon={<FaComments className="text-blue-400" />}
            title={t('textChatTitle')}
            description={t('textChatDesc')}
          />
          <ChoiceCard
            to="/voice-chat"
            icon={<FaMicrophone className="text-green-400" />}
            title={t('voiceChatTitle')}
            description={t('voiceChatDesc')}
          />
          <ChoiceCard
            to="/booking"
            icon={<FaVideo className="text-purple-400" />}
            title={t('videoCallTitle')}
            description={t('videoCallDesc')}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatHub;
