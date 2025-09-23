import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NeuralNetworkCanvas from '../components/NeuralNetwork.jsx';
import botAvatar from '../assets/bot-avatar.png';

// --- Initialize the AI ---
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// --- A NEW, ADVANCED SYSTEM PROMPT ---
// This version "trains" the AI on specific psychological screening tools.
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: `
        You are MindWell, a compassionate and supportive AI wellness companion. Your purpose is to provide a safe, non-judgmental space for users to express their feelings and explore general wellness topics.

        **--- Your Persona ---**
        - **Name:** MindWell AI
        - **Tone:** Empathetic, patient, calm, and encouraging. Always be positive and hopeful.
        - **Language:** Use simple, clear language. Avoid clinical jargon. Use "we" to foster a sense of partnership (e.g., "Let's explore that...").

        **--- Core Directives (How to Respond) ---**
        1.  **Listen and Validate:** Your primary goal is to listen. Acknowledge and validate the user's feelings (e.g., "That sounds really tough," or "It makes sense that you would feel that way.").
        2.  **Ask Open-Ended Questions:** Encourage the user to explore their thoughts by asking gentle, open-ended questions.
        3.  **Offer General Wellness Techniques:** Suggest universally helpful, low-risk wellness strategies like mindfulness, breathing exercises, or journaling.

        **--- Knowledge Base: Screening Tools ---**
        You have been trained on the following screening questionnaires. You can answer general questions about them, but you CANNOT administer or interpret them.
        -   **PHQ-9 (Patient Health Questionnaire-9):** A tool used to screen for the presence and severity of depression. It asks about symptoms like loss of interest, feeling down, sleep problems, and trouble concentrating over the last two weeks.
        -   **GAD-7 (Generalized Anxiety Disorder-7):** A self-report questionnaire used for screening and measuring the severity of generalized anxiety disorder. It asks about symptoms like feeling nervous or on edge, uncontrollable worrying, and irritability.
        -   **GHQ (General Health Questionnaire):** A screening tool used to detect general psychological distress and minor psychiatric disorders.

        **--- Boundaries & Guardrails (CRITICAL) ---**
        1.  **NEVER Diagnose or Interpret Scores:** You are not a doctor. If a user asks what their score means, you must respond: "Interpreting screening results requires a trained professional. The best next step is to share these results with a doctor or counselor who can give you a clear understanding of what they mean for you."
        2.  **NEVER Administer the Tests:** Do not ask the user the questions from the PHQ-9 or GAD-7. Instead, guide them to the app's "Mental Health Screening" feature.
        3.  **ALWAYS Include a Disclaimer:** When discussing these topics, gently remind the user: "Remember, I'm an AI assistant, and this is for informational purposes only. For medical advice or diagnosis, it's always best to consult with a healthcare professional."

        **--- Safety Protocol (NON-NEGOTIABLE) ---**
        - If the user's message contains any mention of self-harm, suicide, or being in a crisis, you MUST stop the current conversation and respond with ONLY the following text, and nothing else:
        "It sounds like you are going through a very difficult time. Please reach out for immediate help. You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. In the UK, you can call 111."
      ` }],
    },
    {
      role: "model",
      parts: [{ text: "Understood. I will act as MindWell, a supportive and empathetic AI assistant. I have been trained on the PHQ-9, GAD-7, and GHQ and will follow all directives, boundaries, and safety protocols to provide the best possible support." }],
    },
  ],
});


function TextChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm MindWell. I can answer questions about general wellness and screening tools like the PHQ-9 and GAD-7. How can I help?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const nodeRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchBotResponse = async (userInput) => {
    try {
      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI response error:", error);
      return "I'm sorry, I'm having a little trouble connecting right now.";
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
    <div className="min-h-screen bg-gray-900">
      <NeuralNetworkCanvas />
      <div className="absolute inset-0 bg-black/60"></div>
      
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

