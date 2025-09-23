import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import Avatar from '../components/Avatar.jsx';
import AiOrbCanvas from '../components/AiOrb.jsx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Sentiment from 'sentiment';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

// AI and Speech Recognition setup (remains the same)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = true;
const sentiment = new Sentiment();

function VoiceChat() {
  const { t } = useTranslation(); // 2. Initialize the hook
  const [userTranscript, setUserTranscript] = useState('');
  // 3. Initialize state with translated text
  const [botResponse, setBotResponse] = useState(t('voiceAssistantDesc'));
  const [status, setStatus] = useState(t('clickToStart'));
  const [avatarState, setAvatarState] = useState('Idle');
  const [error, setError] = useState('');
  const listenersSetup = useRef(false);

  const isListening = status === t('listening');
  const isSpeaking = avatarState === 'mouthOpen';

  // --- Functions like getBotResponse and speak remain the same ---

  useEffect(() => {
    if (!listenersSetup.current) {
      // 4. Use translated strings for status updates
      recognition.onstart = () => { setStatus(t('listening')); setError(''); setAvatarState('Idle'); };
      recognition.onresult = async (event) => {
        // ... (logic remains the same)
        if (finalTranscript) {
          setStatus(t('thinking'));
          // ... (logic remains the same)
        }
      };
      recognition.onerror = (event) => { /* ... */ };
      recognition.onend = () => { setStatus(t('clickToStart')); setAvatarState('Idle'); };
      listenersSetup.current = true;
    }
  }, [t]); // Add 't' to the dependency array

  const handleListen = () => {
    if (status === t('listening')) {
      recognition.stop();
    } else {
      setUserTranscript('');
      setBotResponse('');
      try {
        recognition.start();
      } catch (e) {
        console.error("Could not start recognition:", e);
        setStatus("Error: Mic may already be in use.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between p-6 text-white overflow-hidden">
      <AiOrbCanvas isListening={isListening} isSpeaking={isSpeaking} />
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold">{t('voiceAssistantTitle')}</h2>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-96 h-96">
          <Avatar animationState={avatarState} />
        </div>
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl min-h-[150px] w-full max-w-lg flex flex-col justify-center">
          <p className="text-xl font-semibold text-white min-h-[56px]">{botResponse}</p>
          <p className="text-md text-white/60 italic mt-2 min-h-[24px]">
            {userTranscript ? `${t('youSaid')} "${userTranscript}"` : ''}
          </p>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <button
          onClick={handleListen}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-4 border-white/20
          ${isListening ? 'bg-purple-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isListening ? <FaMicrophoneSlash size={40} /> : <FaMicrophone size={40} />}
        </button>
        <p className="mt-4 text-white/70 font-semibold">{status}</p>
        <Link to="/chatbot" className="mt-6 text-sm text-white/50 hover:text-white/80 transition">
          {t('goBack')}
        </Link>
      </div>
    </div>
  );
}

export default VoiceChat;
