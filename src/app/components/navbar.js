"use client"
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
// import { useSession, signIn, signOut } from "next-auth/react"

// The main Navbar component
export const Navbar = () => {
    // State to manage the visibility of the mobile menu
//     const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
//     if(session) {
//     return <>
//       Signed in as {session.user.email} <br/>
//       <button onClick={() => signOut()}>Sign out</button>
//     </>
//   }

    // Initialize auth state from localStorage and listen to storage changes
    useEffect(() => {
        const loadAuth = () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                if (token && storedUser) {
                    setIsAuthenticated(true);
                    setUser(JSON.parse(storedUser));
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (_) {
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        loadAuth();

        const onStorage = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                loadAuth();
            }
        };
        window.addEventListener('storage', onStorage);

        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const toggleDropdown = () => setIsDropdownOpen((v) => !v);

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (_) {}
        setIsAuthenticated(false);
        setUser(null);
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
        window.location.href = '/';
    };

    const navLinks = [
        { href: "/", text: "Home" },
        { href: "/Flowcharts", text: "Flowcharts" },
        { href: "/mentorships", text: "Mentorships" },
        { href: "/resources", text: "Resources" },
        { href: "/QuizAi", text: "QuizAI"}
    ];

    return (
        <nav className="bg-[#0F172A] font-sans sticky top-0 z-100 h-16">
            <div className="mx-auto pb-1 sm:px-6 lg:px-8 items-center">
                <div className="px-8 flex items-center justify-between h-15">

                    {/* Left section: Logo and Brand Name */}
                    <div className="flex gap-3">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/logo.png"
                                alt="LOGO"
                                width={40}
                                height={40}
                                priority />
                        </Link>
                        <Link href="/">
                            <div className="font-bold text-2xl">
                                <h1>Evolvia</h1>
                            </div>
                            <div className="text-xs font-medium">
                                <p>Navigate, Learn, Achieve</p>
                            </div>
                        </Link>
                    </div>

                    {/* Center section: Navigation Links for Desktop */}
                    <div className="ml-10 flex items-baseline space-x-6 flex-row">
                        <button className="hidden md:block">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.text}
                                    href={link.href}
                                    className="p-3 rounded-2xl font-medium hover:px-4 transition-all duration-100 hover:bg-[#f39d12]"
                                >
                                    {link.text} 
                                </Link>
                            ))}
                        </button>


                        {/* Right section: Auth area for Desktop */}
                        <div className="hidden md:block relative" ref={dropdownRef}>
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={toggleDropdown}
                                        aria-haspopup="true"
                                        aria-expanded={isDropdownOpen}
                                        className="w-10 h-10 rounded-full bg-[#F39C12] text-white font-bold flex items-center justify-center hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F39C12]"
                                        title={user?.firstName ? `Hello, ${user.firstName}` : 'Profile'}
                                    >
                                        {(user?.firstName?.[0] || 'U').toUpperCase()}
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b">Hello{user?.firstName ? `, ${user.firstName}` : ''}</div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href="/login">
                                    <button className="bg-[#F39C12] text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 hover:cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105">
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <div className="-mr-2 flex md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        {/* Icon for hamburger menu */}
                        <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        {/* Icon for close menu */}
                        <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.text}
                            href={link.href}
                            className={`
                ${index === 0 ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                block px-3 py-2 rounded-md text-base font-medium
              `}
                        >
                            {link.text}
                        </Link>
                    ))}
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        {isAuthenticated ? (
                            <div className="space-y-2">
                                <div className="text-gray-300 px-3">Hello{user?.firstName ? `, ${user.firstName}` : ''}</div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left bg-[#F39C12] text-[#2C3E50] font-bold py-2 px-3 rounded-md hover:bg-yellow-400 transition-colors duration-300"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className="w-full text-left bg-[#F39C12] text-[#2C3E50] font-bold py-2 px-3 rounded-md hover:bg-yellow-400 transition-colors duration-300">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    );
};


