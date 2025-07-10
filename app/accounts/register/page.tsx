'use client';

import React from 'react';
import Link from 'next/link';
import SignupForm from '../../../components/forms/SignupForm';
import bg from "../../../public/images/herosection/signup.png";
import Image from 'next/image';

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to My Store</h1>
      <p className="text-gray-600">Create an account to continue</p>
      </div>

      {/* Login Form Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <SignupForm />
        
        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
  );
};

export default Page;