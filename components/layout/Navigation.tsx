"use client";

import { ThemeToggle } from '@/utils/ThemeToggle';
import { Heart, MapPin, ShoppingCart, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Drawer from '../ui/Drawer';
import CartPage from '../product/CartPage';
import { useUserStore } from '@/store/UserStore';
import { useRouter } from 'next/navigation';

const Navigation = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const userButtonRef = useRef<HTMLButtonElement>(null);
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isUserMenuOpen) setIsUserMenuOpen(false);
    };

    const handleClickCart = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        if (isMenuOpen) setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem('token');
        router.push('/');
    }


    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (
                isUserMenuOpen &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target) &&
                userButtonRef.current &&
                !userButtonRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    return (
        <header className="w-full bg-white shadow sticky top-0 z-50 dark:text-white dark:bg-gray-800">
            <div className="mx-auto flex items-center justify-between px-4 py-3 gap-4">
                {/* Hamburger Menu Button for Mobile */}
                <button
                    className="lg:hidden text-gray-700 dark:text-white"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Location - Hidden in mobile view when menu is open */}
                {!isMenuOpen && (
                    <div className="text-lg flex items-center md:flex">
                        <MapPin className="hidden lg:inline w-5 h-5 mr-1 text-gray-700 dark:text-white" />
                        <span className="hidden lg:inline text-gray-700">California</span>
                    </div>
                )}

                {/* Navigation Links */}
                <nav
                    className={`${isMenuOpen
                        ? 'flex flex-col absolute top-16 left-0 w-full bg-gray-700 dark:bg-gray-800 p-4 text-white z-50'
                        : 'hidden lg:flex flex-row gap-4'
                        } lg:static lg:w-auto lg:bg-transparent lg:dark:bg-transparent lg:p-0 lg:gap-4 lg:text-gray-700 lg:dark:text-white`}
                >
                    <Link href="/" className="hover:text-green-600">Home</Link>
                    <Link href="/products" className="hover:text-green-600">All Products</Link>
                    <Link href="/products" className="hover:text-green-600">Best Sellers</Link>
                    <Link href="/products" className="hover:text-green-600">New Arrivals</Link>
                    <Link href="/products" className="hover:text-green-600">Trends</Link>
                    <Link href="/products" className="hover:text-green-600">Home & Living</Link>
                    <Link href="/products" className="hover:text-green-600">Beauty</Link>
                    {/* Location - shown only in mobile menu */}
                    <div className="flex items-center text-white lg:hidden">
                        <MapPin className="w-5 h-5 mr-1" />
                        <span>California</span>
                    </div>
                </nav>

                <div className="flex items-center gap-5 relative">
                    <ThemeToggle />
                    <Link href="/wishlist" className="hover:text-green-600 flex gap-1" title="Wishlist">
                        <Heart className="w-6 h-6 text-gray-700 dark:text-white hover:text-green-600" />
                    </Link>
                    <Link href="/cart" className="hover:text-green-600 flex gap-1" title="Wishlist">
                    <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-white hover:text-green-600" />
                    </Link>

                    {/* <button
                        onClick={handleClickCart}
                        className="hover:text-green-600 flex gap-1"
                        title="Cart"
                    >
                        <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-white hover:text-green-600" />
                    </button> */}
                    <div className="relative">
                       {user && <button
                            ref={userButtonRef}
                            onClick={toggleUserMenu}
                            className="hover:text-green-600 flex gap-1"
                            title="Profile"
                            // disabled={!user}
                        >
                            <User className="w-6 h-6 text-gray-700 dark:text-white hover:text-green-600" />
                        </button>}

                        {/* Menu */}
                        {isUserMenuOpen && (
                            <div
                                ref={userMenuRef}
                                className="absolute right-0 mt-2 w-48 bg-[#e8e9eb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                            >
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <p className="font-semibold text-gray-700 dark:text-white">{user?.profile?.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                                <div className="py-2">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Orders
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <Link
                                        href="/accounts/login"
                                        className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={isCartOpen}
                onClose={handleCloseCart}
                title="Your Cart"
            >
                <p>Your cart items will appear here.</p>
            </Drawer>
        </header>
    );
};

export default Navigation;