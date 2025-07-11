'use client';

import Link from 'next/link';
import { Heart, LogOut, ShoppingCart, User } from 'lucide-react';
import SearchBar from '../forms/SearchBar';
import { useUserStore } from '@/store/UserStore'; 
import { useRouter } from 'next/navigation';

const Header = () => {
  const router=useRouter();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleLogout=()=>{
    logout();
    localStorage.removeItem('token');
    router.push('/');
  }
  
  return (
    <header className="w-full bg-gray-700 shadow sticky top-0 z-50 dark:bg-gray-800 dark:text-white">
      <div className="mx-auto flex items-center justify-between px-4 py-2 gap-4">
        {/* Brand Logo */}
        <Link href="/" className="text-1xl font-bold text-white">
          MyStore
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {!user ? (
            <Link href="/accounts/register" className="flex items-center gap-1 hover:text-green-600" title="Sign In">
              Sign In
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:underline"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
