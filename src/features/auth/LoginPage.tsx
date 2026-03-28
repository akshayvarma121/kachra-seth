import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2, User, Mail, ArrowRight, Recycle, AlertTriangle } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🟢 CLEAN STATE: Start empty so you have to type
  const [formData, setFormData] = useState({ email: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // API Call
      await login(formData.email, formData.name);
      
      // Check Role & Redirect
      const freshUser = useAuthStore.getState().user;
      if (freshUser) {
        if (freshUser.role === 'admin') navigate('/admin');
        else if (freshUser.role === 'staff') navigate('/staff');
        else navigate('/citizen');
      }
    } catch (err: any) {
      console.error("Login Failed:", err);
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-neon rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-purple-500 rounded-full blur-[80px] opacity-20"></div>

      <div className="w-full max-w-sm relative z-10">
        
        {/* LOGO */}
        <div className="relative mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="absolute top-2 left-2 w-full h-full bg-brand-neon rounded-xl border-2 border-black"></div>
          <div className="relative bg-black text-white p-6 rounded-xl border-2 border-black flex items-center justify-between shadow-neo">
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="bg-brand-neon text-black text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Official App</span>
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter leading-[0.85]">
                  KACHRA<br/><span className="text-brand-neon text-stroke-white">SETH</span>
                </h1>
             </div>
             <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center border-2 border-black rotate-3">
                <Recycle size={32} className="text-black animate-spin-slow" />
             </div>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[32px] border-2 border-black shadow-neo">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500 z-10" />
                <input
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-black font-bold text-lg outline-none"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative group">
                <User className="absolute left-4 top-4 h-5 w-5 text-gray-500 z-10" />
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-black font-bold text-lg outline-none"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-black text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transform rotate-1">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-black text-xl uppercase tracking-wider shadow-neo hover:-translate-y-1 transition-all flex justify-center items-center gap-3 border-2 border-black"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-brand-neon" />
              ) : (
                <>Login <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t-2 border-gray-100 dark:border-gray-700 pt-4">
            <p className="text-xs font-bold text-gray-500">
              New to Kachra Seth?{' '}
              <Link to="/register" className="text-black dark:text-white underline decoration-2 underline-offset-2 hover:text-brand-neon">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};