'use client';

import { useUserStore } from '@/store/UserStore';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useUserStore();
  const [mounted, setMounted] = useState(false); // 🟢 Track if client mounted

  useEffect(() => {
    setMounted(true); // ✅ Only show after client mount
    // Optional auth logic:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   fetch('/api/auth/me', {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       if (data.user) setUser(data.user);
    //     })
    //     .catch((err) => console.error('Auth check failed', err));
    // }
  }, [setUser]);

  if (!mounted) return null; // 🛑 Don't render on server or during hydration

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
};

export default ClientWrapper;
