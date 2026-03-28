import { useLanguage } from '@/context/LanguageContext';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="px-3 py-1 bg-black border border-[#39FF14] text-[#39FF14] rounded-full font-bold uppercase text-xs shadow-[0_0_10px_rgba(57,255,20,0.4)]"
    >
      {language === 'en' ? 'हिन्दी' : 'ENG'}
    </button>
  );
};