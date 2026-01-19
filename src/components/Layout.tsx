import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomTicker } from './BottomTicker';
import { useAuthStore } from '@/store/authStore';

export const Layout = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <TopNav />
      
      {/* 🚀 SCROLL FIX EXPLAINED:
         - pt-24: Push content down so it's not hidden behind TopNav (h-20)
         - pb-20: Push content up so it's not hidden behind BottomTicker
         - w-full: Ensure it takes full width
         - overflow-x-hidden: Prevent horizontal scrollbars if animations go wide
      */}
      <main className="flex-grow pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Show ticker only if user is logged in */}
      {user && <BottomTicker />}
    </div>
  );
};