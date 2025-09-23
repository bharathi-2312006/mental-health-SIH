import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaCalendarAlt, FaClock, FaUser, FaCheckCircle, FaRulerVertical, FaWeight, FaBirthdayCake } from 'react-icons/fa';
import bgImage from '../assets/booking-bg.jpg';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

// --- Helper Functions & Data ---
const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // These are often kept short and might not need translation, but could be.

const generateCalendar = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push({ day: null });
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    const isPast = dayDate < new Date().setHours(0, 0, 0, 0);
    calendarDays.push({ day: i, date: dayDate, isPast });
  }
  return calendarDays;
};

// --- Main Component ---
function Booking() {
  const { t } = useTranslation(); // 2. Initialize the hook
  const [step, setStep] = useState('details'); 
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.displayName) {
      setPatientDetails(prev => ({ ...prev, name: user.displayName }));
    }
  }, []);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (patientDetails.name && patientDetails.age > 0 && patientDetails.height > 0 && patientDetails.weight > 0) {
      setStep('calendar');
    } else {
      alert("Please fill in all details correctly.");
    }
  };
  
  const handleMonthChange = (increment) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }
    setIsLoading(true);
    const user = auth.currentUser;

    try {
      await addDoc(collection(db, "appointments"), {
        ...patientDetails,
        userId: user.uid,
        userEmail: user.email,
        date: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedTime,
        status: 'Confirmed',
        createdAt: serverTimestamp(),
      });
      setStep('confirmed');
    } catch (error) {
      console.error("Error booking appointment: ", error);
      alert("There was an error booking your appointment.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER LOGIC ---
  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('bookingConfirmedTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('bookingConfirmedDesc')}</p>
          <button onClick={() => window.location.reload()} className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition">{t('bookAnother')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black/50"></div>
      
      {step === 'details' && (
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('bookingDetailsTitle')}</h2>
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div className="relative"><FaUser className="absolute top-3.5 left-3 text-gray-400" /><input type="text" name="name" value={patientDetails.name} onChange={handleDetailsChange} placeholder={t('fullName')} className="w-full pl-10 p-3 border rounded-lg" required /></div>
            <div className="relative"><FaBirthdayCake className="absolute top-3.5 left-3 text-gray-400" /><input type="number" name="age" value={patientDetails.age} onChange={handleDetailsChange} placeholder={t('screeningNew.age')} className="w-full pl-10 p-3 border rounded-lg" required /></div>
            <div className="relative"><FaRulerVertical className="absolute top-3.5 left-3 text-gray-400" /><input type="number" name="height" value={patientDetails.height} onChange={handleDetailsChange} placeholder={t('height')} className="w-full pl-10 p-3 border rounded-lg" required /></div>
            <div className="relative"><FaWeight className="absolute top-3.5 left-3 text-gray-400" /><input type="number" name="weight" value={patientDetails.weight} onChange={handleDetailsChange} placeholder={t('weight')} className="w-full pl-10 p-3 border rounded-lg" required /></div>
            <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">{t('bookingNextStep')}</button>
          </form>
        </div>
      )}

      {step === 'calendar' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaCalendarAlt /> {t('selectDate')}</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => handleMonthChange(-1)} className="font-bold text-lg p-2 rounded-full hover:bg-gray-200">‹</button>
                <h3 className="font-bold text-lg">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => handleMonthChange(1)} className="font-bold text-lg p-2 rounded-full hover:bg-gray-200">›</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {daysOfWeek.map(day => <div key={day} className="font-medium text-xs text-gray-500">{day}</div>)}
                {generateCalendar(currentMonth).map((day, index) => (
                    <button 
                        key={index} 
                        onClick={() => !day.isPast && setSelectedDate(day.date)} 
                        className={`p-2 rounded-full text-sm transition-colors ${day.isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-100'} ${selectedDate?.getTime() === day.date?.getTime() ? 'bg-blue-500 text-white' : ''}`} 
                        disabled={day.isPast}
                    >
                        {day.day}
                    </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaClock /> {t('selectTime')}</h2>
            <div className="flex-grow grid grid-cols-2 gap-3">
              {timeSlots.map(time => (
                  <button 
                      key={time} 
                      onClick={() => setSelectedTime(time)} 
                      disabled={!selectedDate} 
                      className={`p-3 rounded-lg border-2 text-center font-semibold transition ${!selectedDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'} ${selectedTime === time ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'}`}
                  >
                      {time}
                  </button>
              ))}
            </div>
            <div className="mt-6">
              <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
                <p className="font-semibold">{t('yourSelection')}</p>
                <p className="text-sm">{t('date')}: {selectedDate ? selectedDate.toLocaleDateString() : t('notSelected')}</p>
                <p className="text-sm">{t('time')}: {selectedTime || t('notSelected')}</p>
              </div>
              <button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTime || isLoading} className="mt-4 w-full bg-green-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition">{isLoading ? t('booking') : t('confirmAppointment')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;

