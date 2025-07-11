// components/auth/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/UserStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user?._id) {
      router.replace('/accounts/login'); // Redirect to login if not authenticated
    }
  }, [user]);

  if (!user?._id) {
    return null; // or a loading spinner
  }

  return children;
};

export default ProtectedRoute;
