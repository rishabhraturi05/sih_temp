"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student', // default selection
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message
                alert(`Welcome back, ${data.user.firstName}!`);
                
                // Redirect based on role
                const userRole = data.user.role || formData.role;
                if (userRole === 'student') {
                    window.location.href = '/Dashboard/Student';
                } else if (userRole === 'mentor') {
                    window.location.href = '/Dashboard/Mentor';
                } else {
                    window.location.href = '/';
                }
            } else {
                // Handle login errors
                alert(data.message || 'Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Network error. Please check your connection and try again.');
        }
    };

    return (
        <>
            <section className="relative min-h-screen w-full flex items-center justify-center">
                <div>
                    <img
                        src="/background2.jpg"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover -z-10"
                    />
                    <div className="absolute inset-0 bg-black opacity-60 z-10 w-full h-full" />
                </div>

                <div className="relative z-20 w-full max-w-md mx-auto p-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                        {/* Logo and Title */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="Evolvia Logo"
                                    width={60}
                                    height={60}
                                    priority
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-gray-300">Sign in to continue your journey</p>
                        </div>

                        {/* Role Selection */}
                        <div className="mb-6">
                            <p className="block text-sm font-medium text-white mb-2">
                                Sign in as
                            </p>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-gray-200 text-sm cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={formData.role === 'student'}
                                        onChange={handleChange}
                                        className="text-[#F39C12] focus:ring-[#F39C12]"
                                    />
                                    <span>Student</span>
                                </label>
                                <label className="flex items-center gap-2 text-gray-200 text-sm cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="mentor"
                                        checked={formData.role === 'mentor'}
                                        onChange={handleChange}
                                        className="text-[#F39C12] focus:ring-[#F39C12]"
                                    />
                                    <span>Mentor</span>
                                </label>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent transition duration-300"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:border-transparent transition duration-300"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-[#F39C12] bg-white/10 border-white/20 rounded focus:ring-[#F39C12] focus:ring-2"
                                    />
                                    <span className="ml-2 text-sm text-gray-300">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-sm text-[#F39C12] hover:text-yellow-400 transition duration-300">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#F39C12] hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F39C12] focus:ring-offset-2 focus:ring-offset-transparent"
                            >
                                Sign In
                                <i className="ml-2 fa-solid fa-arrow-right"></i>
                            </button>
                        </form>


                        {/* Sign Up Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-300">
                                Don&apos;t have an account?{' '}
                                <Link href="/sign-up" className="text-[#F39C12] hover:text-yellow-400 font-medium transition duration-300">
                                    Sign up here
                                </Link>
                            </p>
                        </div>

                        {/* Back to Home */}
                        <div className="text-center mt-4">
                            <Link href="/" className="text-gray-400 hover:text-white text-sm transition duration-300">
                                <i className="fa-solid fa-arrow-left mr-2"></i>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
