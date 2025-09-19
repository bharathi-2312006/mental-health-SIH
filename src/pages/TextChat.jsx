import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import assets
import botAvatar from '../assets/bot-avatar.png';
import bgImage from '../assets/chatbot-bg.jpg';

// Initialize the AI with your API Key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// A helper function to create a delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function TextChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm a supportive AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const nodeRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // This function now includes the retry logic
  const fetchBotResponse = async (userInput) => {
    const safetyPreamble = "Important: If the user mentions self-harm, suicide, or crisis, you must immediately respond with: 'It sounds like you are going through a difficult time. Please reach out for help. You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. In the UK, you can call 111.' Do not say anything else.";
    const prompt = `You are MindWell, a friendly and supportive AI assistant... ${safetyPreamble}\n\nUser: ${userInput}\nMindWell:`;
    
    let retries = 3;
    let delay = 1000; // Start with a 1-second delay

    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        // Check if it's the specific "overloaded" error
        if (error.message && error.message.includes('503')) {
          retries--;
          if (retries === 0) {
            console.error("AI response error after multiple retries:", error);
            return "The AI is currently busy. Please try again in a moment.";
          }
          console.log(`Model overloaded. Retrying in ${delay / 1000}s...`);
          await sleep(delay);
          delay *= 2; // Double the delay for the next retry
        } else {
          // For any other error, fail immediately
          console.error("AI response error:", error);
          return "I'm sorry, I'm having a little trouble connecting right now.";
        }
      }
    }
  };

  const sendMessage = async (text) => {
    if (text.trim() === '') return;

    const userMessage = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const botResponseText = await fetchBotResponse(text);
    const botMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className="absolute top-10 left-10 cursor-move z-20">
          <img src={botAvatar} alt="Chatbot Avatar" className="w-32 h-auto drop-shadow-lg" />
        </div>
      </Draggable>

      <div className="flex flex-col items-center justify-end min-h-screen p-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-lg">
          <div className="border-b border-white/20 pb-2 mb-4 text-center text-white font-bold">MindWell AI</div>
          <div className="h-96 overflow-y-auto space-y-4 pr-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                  <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-800 text-white">
                      <div className="flex items-center justify-center space-x-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-150"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-300"></span>
                      </div>
                  </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-white/50 text-center mb-2">
              This AI is for informational purposes and is not a replacement for professional medical advice.
            </p>
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your message..." className="w-full p-2 bg-gray-800/50 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextChat;
