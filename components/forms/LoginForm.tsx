'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/UserStore';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data, "data");

    if (data.status === 200) {
      toast.success(data?.message || 'Account created successfully');
      setUser(data.user); //Store user in Zustand
      localStorage.setItem('token', data.token); // Optional: store JWT
      router.push('/products'); // Navigate to products
    } else {
      toast.error(data?.error?.message || 'Login failed');
      setMessage(data.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-md  text-gray-700 ">Login to your account.</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-700 text-white py-2 rounded hover:bg-white hover:text-gray-700 hover:border-2 hover:border-gray-700"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {message && <p className="text-sm text-center text-red-500">{message}</p>}
    </form>
  );
};

export default LoginForm;
