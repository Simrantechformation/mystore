'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/UserStore';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { signupSchema } from '@/schemas/signupSchema';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  avatar?: string;
  phone?: string;
  language: string;
  currency: string;
  theme: 'light' | 'dark';
}

interface ApiResponse {
  status: number;
  message?: string;
  user?: any;
  error?: {
    message: string;
  };
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  name: yup.string().required('Name is required'),
  avatar: yup.string().url('Invalid URL').optional(),
  phone: yup.string().matches(/^\d{10}$/, 'Invalid phone number').optional(),
  language: yup.string().required('Language is required'),
  currency: yup.string().required('Currency is required'),
  theme: yup.string().oneOf(['light', 'dark']).required('Theme is required')
});

const SignupForm = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema), // ✅ Use imported schema
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      avatar: '',
      phone: '',
      language: 'en',
      currency: 'USD',
      theme: 'light'
    }
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerMessage('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          profile: {
            name: data.name,
            avatar: data.avatar || undefined,
            phone: data.phone || undefined
          },
          preferences: {
            language: data.language,
            currency: data.currency,
            theme: data.theme
          }
        })
      });
      const result: ApiResponse = await res.json();
      if (result.status === 200) {
        toast.success(result?.message || 'Account created successfully');
        setUser(result.user);
        router.push('/products');
      } else {
        const errorMessage = result?.error?.message || 'Signup failed';
        toast.error(errorMessage);
        setServerMessage(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      toast.error(errorMessage);
      setServerMessage(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-3 max-w-lg mx-auto bg-white">
      {/* <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Account</h2> */}
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
      </div>

      {/* Name and Avatar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            {...register('name')}
            id="name"
            placeholder="Enter your full name"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>
          <input
            {...register('avatar')}
            id="avatar"
            type="url"
            placeholder="Avatar URL (optional)"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.avatar && <p className="text-sm text-red-500 mt-1">{errors.avatar.message}</p>}
        </div>
      </div>

      {/* Phone and Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            {...register('phone')}
            id="phone"
            placeholder="Phone number (optional)"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            {...register('language')}
            id="language"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
          {errors.language && <p className="text-sm text-red-500 mt-1">{errors.language.message}</p>}
        </div>
      </div>

      {/* Currency and Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            {...register('currency')}
            id="currency"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CAD">CAD</option>
          </select>
          {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>}
        </div>
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <select
            {...register('theme')}
            id="theme"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          {errors.theme && <p className="text-sm text-red-500 mt-1">{errors.theme.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-700 text-white py-3 px-4 rounded-md hover:bg-white hover:text-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>

      {serverMessage && (
        <div className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-md">
          {serverMessage}
        </div>
      )}


      {/* Already have account */}
      <p className="text-sm text-center ">
        Already have an account?{' '}
        <Link href="/accounts/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;