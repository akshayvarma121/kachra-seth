// src/features/auth/RegisterPage.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2, User, Mail, ArrowRight, Recycle } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Removed Role from state (defaulting to citizen logic internally)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ FIX: Correct Order -> (email, name, role)
      // We hardcode 'citizen' here. If you need staff, you can add logic later or use the admin panel to promote users.
      await register(formData.email, formData.name, 'citizen');
      
      // Navigate based on role (Fresh user check)
      const freshUser = useAuthStore.getState().user;
      if (freshUser?.role === 'staff') navigate('/staff');
      else navigate('/citizen');

    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
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
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
             <div className="bg-black text-brand-neon p-2 rounded-lg">
                <Recycle size={24} />
             </div>
             <h2 className="text-3xl font-black italic uppercase">Join Us</h2>
          </div>
          <p className="text-gray-500 font-bold">Create your Kachra Seth account</p>
        </div>

        {/* 📝 REGISTER CARD */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[32px] border-2 border-black shadow-neo">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* INPUTS */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-black font-bold outline-none placeholder:text-gray-400"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  required
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-black font-bold outline-none placeholder:text-gray-400"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-600 px-4 py-3 rounded-xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-brand-neon hover:bg-green-400 text-black py-4 rounded-xl font-black text-xl uppercase tracking-wider shadow-neo border-2 border-black flex justify-center items-center gap-2 transition-all hover:-translate-y-1"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight /></>}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-xs font-bold text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-black underline decoration-2 underline-offset-2 hover:text-brand-neon">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};