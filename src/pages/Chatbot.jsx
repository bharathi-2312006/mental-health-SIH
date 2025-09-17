import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

// Import assets
import botAvatar from '../assets/bot-avatar.png';
import bgImage from '../assets/chatbot-bg.jpg'; // Import the new background

function Chatbot() {
  // State for messages, input, and the temporary bubble
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm here to help. What's on your mind today?", sender: 'bot', suggestions: ['Tell me about stress', 'I feel anxious'] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [bubbleText, setBubbleText] = useState('');
  const [isTyping, setIsTyping] = useState(false); // New state for the typing indicator
  const nodeRef = useRef(null);
  const chatEndRef = useRef(null); // Ref to scroll to the bottom of the chat

  // Effect to manage the "talking" bubble's visibility
  useEffect(() => {
    if (bubbleText) {
      const timer = setTimeout(() => setBubbleText(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [bubbleText]);

  // Effect to automatically scroll down when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Updated function to provide more structured responses with quick replies
  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('stress')) {
      return {
        text: "Stress is a common feeling. Techniques like deep breathing can be very helpful.",
        suggestions: ['Show me an exercise', 'Tell me more about stress']
      };
    } else if (lowerInput.includes('anxiety') || lowerInput.includes('anxious')) {
      return {
        text: "Anxiety can be tough. It often helps to ground yourself by focusing on your senses. What are five things you can see right now?",
        suggestions: []
      };
    } else if (lowerInput.includes('exercise')) {
        return {
        text: "A great one is Box Breathing. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. It calms your nervous system.",
        suggestions: ['Thanks!', 'Any other tips?']
        };
    } else {
      return {
        text: "I'm here to provide general support. For specific advice, it's always best to book a session with a professional counselor.",
        suggestions: ['How do I book a session?', 'Okay, thank you.']
      };
    }
  };

  const sendMessage = (text) => {
    if (text.trim() === '') return;

    const userMessage = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true); // Show typing indicator

    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage = { id: Date.now() + 1, ...botResponse, sender: 'bot' };
      
      setBubbleText(botResponse.text);
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false); // Hide typing indicator
    }, 1500); // Increased delay for realism

    setInputValue('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  
  const handleQuickReply = (replyText) => {
    sendMessage(replyText);
  };

  // Get the latest bot message to show quick replies
  const latestBotMessage = messages[messages.length - 1];

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div> {/* Dark overlay for readability */}
      
      {/* Draggable Avatar */}
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className="absolute top-10 left-10 cursor-move z-20">
          {bubbleText && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white p-3 rounded-lg shadow-lg text-sm text-gray-800">
              {bubbleText}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
            </div>
          )}
          <img src={botAvatar} alt="Chatbot Avatar" className="w-32 h-auto drop-shadow-lg" />
        </div>
      </Draggable>

      {/* Main Chat Window */}
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
            {isTyping && ( // Render the typing indicator
              <div className="flex items-end gap-2 justify-start">
                  <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-800 text-white">
                      <div className="flex items-center justify-center space-x-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
                      </div>
                  </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="pt-4 border-t border-white/20">
            {latestBotMessage.sender === 'bot' && latestBotMessage.suggestions?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {latestBotMessage.suggestions.map((reply, i) => (
                  <button key={i} onClick={() => handleQuickReply(reply)} className="bg-white/20 hover:bg-white/40 text-white text-sm px-3 py-1 rounded-full transition">
                    {reply}
                  </button>
                ))}
              </div>
            )}
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

export default Chatbot;