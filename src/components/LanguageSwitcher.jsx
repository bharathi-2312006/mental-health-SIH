import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <div className="relative">
      <select 
        value={i18n.language} 
        onChange={handleLanguageChange}
        className="bg-white/20 text-white rounded-md py-1 px-2 appearance-none focus:outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ்</option>
        <option value="hi">हिन्दी</option>
        <option value="ur">اردو</option>
        <option value="ks">کٲشُر</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;