import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import Avatar from '../components/Avatar.jsx';
import VideoBackground from '../components/VideoBackground.jsx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Sentiment from 'sentiment';

// Speech Recognition setup with interim results
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = true;

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
const sentiment = new Sentiment();

function VoiceChat() {
  const [userTranscript, setUserTranscript] = useState('');
  const [botResponse, setBotResponse] = useState('Click the microphone and start speaking.');
  const [status, setStatus] = useState('Click to Start');
  const [avatarState, setAvatarState] = useState('Idle');
  const [error, setError] = useState('');
  const listenersSetup = useRef(false);

  const getBotResponse = async (userInput, sentimentScore) => {
    let sentimentDescription = 'neutral';
    if (sentimentScore > 1) {
      sentimentDescription = 'positive and cheerful';
    } else if (sentimentScore < -1) {
      sentimentDescription = 'negative and sad';
    }
    const safetyPreamble = "Important: If the user mentions self-harm, suicide, or crisis, you must immediately respond with: 'It sounds like you are going through a difficult time. Please reach out for help. You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. In the UK, you can call 111.' Do not say anything else.";
    const prompt = `You are MindWell, an empathetic AI voice assistant. The user's sentiment seems ${sentimentDescription}. Please tailor your response to be emotionally appropriate. Be supportive and understanding. Do not provide medical advice. Keep your answers conversational. ${safetyPreamble}\n\nUser says: "${userInput}"\nMindWell:`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI response error:", error);
      return "I'm sorry, I'm having a little trouble connecting right now.";
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en')) || voices[0];
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.onstart = () => setAvatarState('mouthOpen');
    utterance.onend = () => setAvatarState('Idle');
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!listenersSetup.current) {
      recognition.onstart = () => {
        setStatus('Listening...');
        setError('');
        setAvatarState('Idle');
      };
      
      recognition.onresult = async (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setUserTranscript(interimTranscript || finalTranscript);

        if (finalTranscript) {
          setStatus('Thinking...');
          const result = sentiment.analyze(finalTranscript);
          const response = await getBotResponse(finalTranscript, result.score);
          setBotResponse(response);
          speak(response);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'no-speech') {
          setError("I didn't hear anything. Please try again.");
        } else {
          setError(`Error: ${event.error}. Please check your connection and mic permissions.`);
        }
      };

      recognition.onend = () => {
        setStatus('Click to Start');
        setAvatarState('Idle');
      };
      
      listenersSetup.current = true;
    }
  }, []);

  const handleListen = () => {
    if (status === 'Listening...') {
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
    <div className="min-h-screen flex flex-col items-center justify-between p-6 text-white">
      <VideoBackground videoSource="/ai-background.mp4" />
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold">MindWell AI Voice Assistant</h2>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-96 h-96">
          <Avatar animationState={avatarState} />
        </div>
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl min-h-[150px] w-full max-w-lg flex flex-col justify-center">
          <p className="text-xl font-semibold text-white min-h-[56px]">{botResponse}</p>
          <p className="text-md text-white/60 italic mt-2 min-h-[24px]">
            {userTranscript ? `You said: "${userTranscript}"` : ''}
          </p>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <button
            onClick={handleListen}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-4 border-white/20
            ${status === 'Listening...' ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
        >
            {status === 'Listening...' ? <FaMicrophoneSlash size={40} /> : <FaMicrophone size={40} />}
        </button>
        <p className="mt-4 text-white/70 font-semibold">{status}</p>
        <Link to="/chatbot" className="mt-6 text-sm text-white/50 hover:text-white/80 transition">
            ← Back to Connection Hub
        </Link>
      </div>
    </div>
  );
}

export default VoiceChat;