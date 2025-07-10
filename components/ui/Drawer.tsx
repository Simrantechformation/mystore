'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
}

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
}: DrawerProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isMounted) return null;

  return (
    <>
      {/* Overlay that closes drawer when clicked */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent bg-opacity-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
       className={`
        fixed top-0 z-50 h-full w-[90%] sm:w-[400px] bg-[#e8e9eb] dark:bg-gray-900 shadow-lg
        transform transition-transform duration-300
        ${position === 'right' ? 'right-0' : 'left-0'}
        ${isOpen ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}
      `}
        onClick={(e) => e.stopPropagation()} // prevent overlay close
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b dark:border-gray-700">
          <button onClick={onClose} className="text-gray-700 dark:text-white">
            {/* <X className="w-5 h-5" /> */}
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg  text-green-600 ">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto h-[calc(100%-64px)]">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
