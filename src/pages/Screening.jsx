import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaBirthdayCake, FaVenusMars } from 'react-icons/fa';
import NeuralNetworkCanvas from '../components/NeuralNetwork.jsx';
import { useTranslation } from 'react-i18next';

// Import your option images
import stressedImg from '../assets/stressed.png';
import relaxedImg from '../assets/relaxed.png';
import anxiousImg from '../assets/anxious.png';
import calmImg from '../assets/calm.png';

// The scoring logic remains the same
const scoreMap = { stressed: 1, relaxed: 0, 'very often': 1, rarely: 0, yes_lost_interest: 1, no_interest: 0, feel_hopeless: 1, feel_okay: 0, feel_nervous: 1, feel_calm: 0, worry_a_lot: 1, manage_worries: 0, cannot_focus: 1, can_focus: 0, feel_strain: 1, feel_relaxed: 0, };

function Screening() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState('details');
  const [userDetails, setUserDetails] = useState({ age: '', gender: '' });
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // Define questions inside the component to access 't'
  const questions = [
    {id: 'q1', text: t('screeningNew.questions.q1'), options: [{ value: 'stressed', label: t('screeningNew.options.stressed'), imgSrc: stressedImg },{ value: 'relaxed', label: t('screeningNew.options.relaxed'), imgSrc: relaxedImg },],},
    {id: 'q2', text: t('screeningNew.questions.q2'), options: [{ value: 'very often', label: t('screeningNew.options.veryOften'), imgSrc: anxiousImg },{ value: 'rarely', label: t('screeningNew.options.rarely'), imgSrc: calmImg },],},
    {id: 'q3', text: t('screeningNew.questions.q3'), options: [{ value: 'no_interest', label: t('screeningNew.options.noInterest'), imgSrc: relaxedImg },{ value: 'yes_lost_interest', label: t('screeningNew.options.yesLostInterest'), imgSrc: stressedImg },],},
    {id: 'q4', text: t('screeningNew.questions.q4'), options: [{ value: 'feel_okay', label: t('screeningNew.options.feelOkay'), imgSrc: calmImg },{ value: 'feel_hopeless', label: t('screeningNew.options.feelHopeless'), imgSrc: anxiousImg },],},
    {id: 'q5', text: t('screeningNew.questions.q5'), options: [{ value: 'feel_calm', label: t('screeningNew.options.feelCalm'), imgSrc: calmImg },{ value: 'feel_nervous', label: t('screeningNew.options.feelNervous'), imgSrc: anxiousImg },],},
    {id: 'q6', text: t('screeningNew.questions.q6'), options: [{ value: 'manage_worries', label: t('screeningNew.options.manageWorries'), imgSrc: relaxedImg },{ value: 'worry_a_lot', label: t('screeningNew.options.worryALot'), imgSrc: stressedImg },],},
    {id: 'q7', text: t('screeningNew.questions.q7'), options: [{ value: 'can_focus', label: t('screeningNew.options.canFocus'), imgSrc: relaxedImg },{ value: 'cannot_focus', label: t('screeningNew.options.cannotFocus'), imgSrc: stressedImg },],},
    {id: 'q8', text: t('screeningNew.questions.q8'), options: [{ value: 'feel_relaxed', label: t('screeningNew.options.feelRelaxed'), imgSrc: calmImg },{ value: 'feel_strain', label: t('screeningNew.options.feelStrain'), imgSrc: anxiousImg },],},
  ];


  // --- All handler functions remain the same ---
  const handleDetailsChange = (e) => { setUserDetails({ ...userDetails, [e.target.name]: e.target.value }); };
  const handleDetailsSubmit = (e) => { e.preventDefault(); if (userDetails.age && userDetails.gender) { setStep('questions'); } else { alert("Please fill in all your details."); } };
  const handleSelect = (optionValue) => setAnswers({ ...answers, [questions[currentStep].id]: optionValue });
  const handleNext = () => { if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1); };
  const handlePrevious = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const handleFinish = async () => {
    let totalScore = 0;
    for (const questionId in answers) { totalScore += scoreMap[answers[questionId]] || 0; }
    let resultLevel = 'Mild';
    if (totalScore > 5) resultLevel = 'High';
    else if (totalScore > 2) resultLevel = 'Moderate';

    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "screenings"), { ...userDetails, userId: user.uid, userEmail: user.email, userName: user.displayName || 'Anonymous', result: resultLevel, score: totalScore, createdAt: serverTimestamp(), });
      } catch (error) { console.error("Error writing screening document: ", error); }
    }
    if (resultLevel === 'Mild') navigate('/resources');
    else if (resultLevel === 'Moderate') navigate('/chatbot', { state: { score: totalScore, level: 'Moderate' } });
    else navigate('/booking');
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-10 font-sans text-white">
      <NeuralNetworkCanvas />
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 w-full max-w-2xl">
        {step === 'details' && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('screeningNew.introTitle')}</h2>
            <p className="text-center text-white/80 mb-6">{t('screeningNew.introDesc')}</p>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="relative"><FaBirthdayCake className="absolute top-3.5 left-4 text-gray-400" /><input type="number" name="age" value={userDetails.age} onChange={handleDetailsChange} placeholder={t('screeningNew.age')} className="w-full pl-12 p-3 border rounded-lg bg-white/10 border-white/20" required /></div>
              <div className="relative"><FaVenusMars className="absolute top-3.5 left-4 text-gray-400" />
                <select name="gender" value={userDetails.gender} onChange={handleDetailsChange} className="w-full pl-12 p-3 border rounded-lg appearance-none bg-white/10 border-white/20" required>
                  <option value="" className="text-black">{t('screeningNew.selectGender')}</option>
                  <option value="Male" className="text-black">{t('screeningNew.male')}</option>
                  <option value="Female" className="text-black">{t('screeningNew.female')}</option>
                  <option value="Other" className="text-black">{t('screeningNew.other')}</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-4 bg-blue-600 font-bold py-3 rounded-lg hover:bg-blue-700 transition">{t('screeningNew.start')}</button>
            </form>
          </div>
        )}

        {step === 'questions' && (
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-wide">{t('screeningNew.questionnaireTitle')}</h2>
            <div className="w-full max-w-md h-3 bg-gray-700 rounded-full mb-8 relative">
              <div className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="bg-white/5 p-6 rounded-xl w-full text-center">
              <p className="text-lg font-medium mb-6">{questions[currentStep].text}</p>
              <div className="flex justify-center gap-4 sm:gap-8">
                {questions[currentStep].options.map((option) => (
                  <div key={option.value} className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all duration-200 w-32 sm:w-40 ${answers[questions[currentStep].id] === option.value ? 'ring-4 ring-blue-500 bg-blue-900/50' : 'bg-white/10 hover:bg-white/20'}`} onClick={() => handleSelect(option.value)}>
                    <img src={option.imgSrc} alt={option.label} className="w-24 h-24 object-contain mb-2" />
                    <span className="text-sm font-semibold">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between w-full max-w-lg mt-8">
              <button onClick={handlePrevious} disabled={currentStep === 0} className="bg-gray-600 text-lg font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">{t('screeningNew.previous')}</button>
              {currentStep === questions.length - 1 ? (
                <button onClick={handleFinish} className="bg-green-600 text-lg font-semibold py-2 px-8 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">{t('screeningNew.finish')}</button>
              ) : (
                <button onClick={handleNext} className="bg-blue-600 text-lg font-semibold py-2 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">{t('screeningNew.next')}</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Screening;

