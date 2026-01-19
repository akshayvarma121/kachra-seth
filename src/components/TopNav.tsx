import { useAuthStore } from '@/store/authStore';
import { LogOut, User as UserIcon, Bell, Radio, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const TopNav = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // 🌗 DARK MODE LOGIC
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b-2 border-black dark:border-brand-neon/30 px-4 md:px-8 h-20 flex items-center justify-between shadow-sm transition-all duration-300">
      
      {/* LEFT: BRAND & TOGGLE */}
      <div className="flex items-center gap-4">
        
        {/* LOGO */}
        <div className="bg-black dark:bg-brand-neon text-brand-neon dark:text-black px-3 py-1 rounded-lg transform -rotate-2 border-2 border-transparent hover:rotate-0 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(57,255,20,0.4)]">
          <h1 className="text-xl font-black italic tracking-tighter leading-none">
            KACHRA<br/>SETH
          </h1>
        </div>
        
        {/* 🌗 THEME TOGGLE BUTTON */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full border-2 border-black dark:border-brand-neon bg-gray-100 dark:bg-black hover:scale-110 transition-transform group"
        >
          {isDark ? (
            <Sun size={18} className="text-brand-neon animate-spin-slow" />
          ) : (
            <Moon size={18} className="text-black group-hover:rotate-12 transition-transform" />
          )}
        </button>

        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">System Online</span>
        </div>
      </div>

      {/* RIGHT: USER HUD */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Points Pill */}
        {user.role === 'citizen' && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">My Wealth</span>
            <span className="text-lg font-black text-black dark:text-white leading-none">
              {user.points} <span className="text-green-600 dark:text-brand-neon text-sm">PTS</span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group">
              <Bell size={20} className="text-black dark:text-white group-hover:rotate-12 transition-transform"/>
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black animate-pulse"></span>
            </button>

            {/* Separator */}
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>

            {/* Profile Dropdown Trigger */}
            <div className="flex items-center gap-3 pl-2 cursor-pointer group" onClick={handleLogout}>
              <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-black dark:text-white leading-tight group-hover:text-brand-neon transition-colors">{user.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{user.role}</p>
              </div>
              
              <div className="relative">
                <div className="w-10 h-10 rounded-xl border-2 border-black dark:border-brand-neon bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_0_10px_rgba(57,255,20,0.5)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-neon text-black">
                        <UserIcon size={20} />
                    </div>
                  )}
                </div>
                {/* Logout Hint */}
                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border border-white dark:border-black opacity-0 group-hover:opacity-100 transition-opacity">
                    <LogOut size={10} />
                </div>
              </div>
            </div>
        </div>
      </div>
    </nav>
  );
};