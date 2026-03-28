import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/apiClient';
import { Send, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext'; // 👈 Import Translation Hook

const WARDS = ["Sector 1", "Sector 2", "Sector 3", "Market Area", "Old City"];

// ✅ NEW: Map English Values to Translation Keys
const ISSUE_OPTIONS = [
  { value: "Missed Pickup", labelKey: "issue_missed" },
  { value: "Overflowing Bin", labelKey: "issue_overflow" },
  { value: "Illegal Dumping", labelKey: "issue_illegal" },
  { value: "Dead Animal", labelKey: "issue_dead" },
  { value: "Staff Misbehavior", labelKey: "issue_staff" },
  { value: "Other", labelKey: "issue_other" }
];

export const ReportIssuePage = () => {
  const { t } = useLanguage(); // 👈 Initialize Translator
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    ward: WARDS[0],
    issueType: ISSUE_OPTIONS[0].value, // Default to English value
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API receives English value (e.g., "Missed Pickup")
      await api.fileComplaint(formData.ward, formData.issueType, formData.description);
      alert(t('report_success')); // 👈 Translated Alert
      navigate('/citizen'); 
    } catch (error) {
      console.error(error);
      alert(t('report_fail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 pt-8">
      
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">
        <ArrowLeft size={20} /> {t('report_back')}
      </button>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 rounded-[32px] border-2 border-black dark:border-gray-700 shadow-neo">
        
        <h2 className="text-3xl font-black italic uppercase mb-6 flex items-center gap-2 dark:text-white">
          <AlertTriangle className="text-red-500" size={32} />
          {t('report_title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Ward Selector */}
          <div>
            <label className="block font-bold text-sm mb-2 text-gray-500">{t('report_ward')}</label>
            <div className="relative">
                <select 
                  className="w-full p-4 bg-gray-100 text-black dark:bg-gray-800 dark:text-white rounded-xl border-2 border-transparent focus:border-black font-bold outline-none appearance-none"
                  value={formData.ward}
                  onChange={(e) => setFormData({...formData, ward: e.target.value})}
                >
                  {WARDS.map(w => <option key={w} value={w} className="text-black">{w}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>

          {/* ✅ Issue Type Selector (Translated) */}
          <div>
            <label className="block font-bold text-sm mb-2 text-gray-500">{t('report_type')}</label>
            <div className="relative">
                <select 
                  className="w-full p-4 bg-gray-100 text-black dark:bg-gray-800 dark:text-white rounded-xl border-2 border-transparent focus:border-black font-bold outline-none appearance-none"
                  value={formData.issueType}
                  onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                >
                  {ISSUE_OPTIONS.map((opt) => (
                    // Value is English (for API), Display is Hindi (for User)
                    <option key={opt.value} value={opt.value} className="text-black">
                      {t(opt.labelKey as any)} 
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-sm mb-2 text-gray-500">{t('report_desc')}</label>
            <textarea 
              rows={4}
              required
              className="w-full p-4 bg-gray-100 text-black dark:bg-gray-800 dark:text-white rounded-xl border-2 border-transparent focus:border-black font-bold outline-none resize-none placeholder:text-gray-400"
              placeholder={t('report_placeholder')}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-400 text-white py-4 rounded-xl font-black text-xl uppercase tracking-wider shadow-neo border-2 border-black flex justify-center items-center gap-2 transition-transform hover:-translate-y-1"
          >
            {loading ? t('report_sending') : <>{t('report_submit')} <Send size={20} /></>}
          </button>

        </form>
      </div>
    </div>
  );
};