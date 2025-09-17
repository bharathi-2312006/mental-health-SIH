import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Import the new background image
import bgImage from '../assets/screening-bg.jpg'; 

// Import your option images
import stressedImg from '../assets/stressed.png';
import relaxedImg from '../assets/relaxed.png';
import anxiousImg from '../assets/anxious.png';
import calmImg from '../assets/calm.png';

const questions = [
  {id: 'q1', text: 'Over the past week, have you felt unable to relax due to work/school pressure?', options: [{ value: 'stressed', label: 'Stressed', imgSrc: stressedImg },{ value: 'relaxed', label: 'Relaxed', imgSrc: relaxedImg },],},
  {id: 'q2', text: 'How often do you feel nervous or anxious in social situations?', options: [{ value: 'very often', label: 'Very Often', imgSrc: anxiousImg },{ value: 'rarely', label: 'Rarely', imgSrc: calmImg },],},
  {id: 'q3', text: 'Little interest or pleasure in doing things?', options: [{ value: 'no_interest', label: 'No, I enjoy activities.', imgSrc: relaxedImg },{ value: 'yes_lost_interest', label: 'Yes, I’ve lost interest.', imgSrc: stressedImg },],},
  {id: 'q4', text: 'Feeling down, depressed, or hopeless?', options: [{ value: 'feel_okay', label: 'No, I feel okay.', imgSrc: calmImg },{ value: 'feel_hopeless', label: 'Yes, I often feel hopeless.', imgSrc: anxiousImg },],},
  {id: 'q5', text: 'Feeling nervous, anxious, or on edge?', options: [{ value: 'feel_calm', label: 'No, I feel calm.', imgSrc: calmImg },{ value: 'feel_nervous', label: 'Yes, I feel nervous often.', imgSrc: anxiousImg },],},
  {id: 'q6', text: 'Worrying too much about different things?', options: [{ value: 'manage_worries', label: 'No, I manage worries well.', imgSrc: relaxedImg },{ value: 'worry_a_lot', label: 'Yes, I worry a lot.', imgSrc: stressedImg },],},
  {id: 'q7', text: 'Have you recently been able to concentrate on what you’re doing?', options: [{ value: 'can_focus', label: 'Yes, I can focus.', imgSrc: relaxedImg },{ value: 'cannot_focus', label: 'No, I find it hard to concentrate.', imgSrc: stressedImg },],},
  {id: 'q8', text: 'Have you recently felt constantly under strain?', options: [{ value: 'feel_relaxed', label: 'No, I feel relaxed.', imgSrc: calmImg },{ value: 'feel_strain', label: 'Yes, I feel under pressure.', imgSrc: anxiousImg },],},
];

const scoreMap = {
  stressed: 1, relaxed: 0,
  'very often': 1, rarely: 0,
  yes_lost_interest: 1, no_interest: 0,
  feel_hopeless: 1, feel_okay: 0,
  feel_nervous: 1, feel_calm: 0,
  worry_a_lot: 1, manage_worries: 0,
  cannot_focus: 1, can_focus: 0,
  feel_strain: 1, feel_relaxed: 0,
};

function Screening() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleSelect = (optionValue) => {
    setAnswers({ ...answers, [questions[currentStep].id]: optionValue });
  };
  
  const handleNext = () => {
    if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  
  const handleFinish = () => {
    let totalScore = 0;
    for (const questionId in answers) {
      const answerValue = answers[questionId];
      totalScore += scoreMap[answerValue] || 0;
    }

    if (totalScore <= 2) {
      navigate('/resources');
    } else if (totalScore <= 5) {
      navigate('/chatbot', { state: { score: totalScore, level: 'Moderate' } });
    } else {
      navigate('/booking');
    }
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    // 2. Apply the background image using an inline style
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 sm:p-10 font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* 3. Add a subtle overlay for better readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* 4. Add relative and z-10 to ensure content is on top of the overlay */}
      <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col items-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2 tracking-wide">QUESTIONNAIRE</h2>
        <div className="w-full max-w-md h-3 bg-gray-200 rounded-full mb-8 relative">
          <div 
            className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="bg-white p-6 rounded-xl w-full text-center">
          <p className="text-gray-800 text-lg font-medium mb-6">{questions[currentStep].text}</p>
          <div className="flex justify-center gap-4 sm:gap-8">
            {questions[currentStep].options.map((option) => (
              <div
                key={option.value}
                className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all duration-200 w-32 sm:w-40
                            ${answers[questions[currentStep].id] === option.value ? 'ring-4 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'}`}
                onClick={() => handleSelect(option.value)}
              >
                <img src={option.imgSrc} alt={option.label} className="w-24 h-24 object-contain mb-2" />
                <span className="text-gray-700 text-sm font-semibold">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between w-full max-w-lg mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-gray-300 text-gray-700 text-lg font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          {currentStep === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              className="bg-green-600 text-white text-lg font-semibold py-2 px-8 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white text-lg font-semibold py-2 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Screening;