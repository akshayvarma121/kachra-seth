import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { performMockLogin } from '@/lib/authHelpers';
import { Loader2, Lock, Mail, ArrowRight, Recycle } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: 'citizen@ks.com', password: '123' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await performMockLogin(formData.email, formData.password);
      login(user);
      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'staff': navigate('/staff'); break;
        default: navigate('/citizen');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 relative overflow-hidden">
      
      {/* 🟢 BACKGROUND NOISE & GRAFFITI */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-neon rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-purple-500 rounded-full blur-[80px] opacity-20"></div>

      <div className="w-full max-w-sm relative z-10">
        
        {/* 🏷️ THE NEW LOGO (STICKER STYLE) */}
        <div className="relative mb-12 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          
          {/* Shadow Block */}
          <div className="absolute top-2 left-2 w-full h-full bg-brand-neon rounded-xl border-2 border-black"></div>
          
          {/* Main Logo Block */}
          <div className="relative bg-black text-white p-6 rounded-xl border-2 border-black flex items-center justify-between shadow-neo">
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="bg-brand-neon text-black text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Official App</span>
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter leading-[0.85]">
                  KACHRA<br/>
                  <span className="text-brand-neon text-stroke-white">SETH</span>
                </h1>
             </div>
             
             {/* Icon Box */}
             <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center border-2 border-black rotate-3">
                <Recycle size={32} className="text-black animate-spin-slow" />
             </div>
          </div>
        </div>

        {/* 🔲 LOGIN CARD */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[32px] border-2 border-black shadow-neo">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-black focus:shadow-neo-sm transition-all outline-none font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-black focus:shadow-neo-sm transition-all outline-none font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-black text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transform rotate-1">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-black text-xl uppercase tracking-wider shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0 active:shadow-none transition-all flex justify-center items-center gap-3 border-2 border-black"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-brand-neon" />
              ) : (
                <>
                  Enter <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>

          {/* Quick Switcher */}
          <div className="mt-8 flex flex-col items-center gap-2">
             <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Select Prototype Role</p>
             
             <div className="flex gap-3">
               {['Citizen', 'Staff', 'Admin'].map(role => (
                 <button 
                   key={role}
                   onClick={() => setFormData({email: `${role.toLowerCase()}@ks.com`, password: '123'})}
                   className="
                     text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all border-2
                     
                     /* Light Mode Styles */
                     bg-gray-100 text-gray-500 border-transparent 
                     hover:bg-black hover:text-white hover:border-black hover:-translate-y-0.5
                     
                     /* Dark Mode Styles */
                     dark:bg-black dark:text-gray-400 dark:border-gray-700
                     dark:hover:border-brand-neon dark:hover:text-brand-neon dark:hover:shadow-[0_0_10px_rgba(57,255,20,0.5)]
                   "
                 >
                   {role}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};