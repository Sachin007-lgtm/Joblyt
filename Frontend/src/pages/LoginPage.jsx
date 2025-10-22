import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/token', new URLSearchParams({
                username,
                password,
                keep_signed_in: keepSignedIn
            }));
            
            const storage = keepSignedIn ? localStorage : sessionStorage;
            storage.setItem('token', response.data.access_token);

            // Fetch user data and store it
            const userResponse = await api.get('/users/me');
            const user = userResponse.data;
            if (user) {
                storage.setItem('user', JSON.stringify(user));
            }

            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo and Brand */}
                    <div className="text-left space-y-4">
                        <div className="inline-flex items-center space-x-2 group">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                    <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Georgia, serif' }}>J</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                                Joblyt
                            </h2>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back
                            </h1>
                            <p className="text-gray-600">
                                Sign in to continue to your dashboard
                            </p>
                        </div>
                        
                        {/* Demo Credentials */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-1">
                            <p className="text-sm font-semibold text-indigo-900">
                                Demo Credentials:
                            </p>
                            <p className="text-sm text-indigo-700">
                                <span className="font-medium">Username:</span> admin@cvautomation.com
                            </p>
                            <p className="text-sm text-indigo-700">
                                <span className="font-medium">Password:</span> password123
                            </p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Username Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="Enter your username"
                                    className="block w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    className="block w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Keep Signed In Checkbox */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="keep-signed-in"
                                    name="keep-signed-in"
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    checked={keepSignedIn}
                                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                                />
                                <label
                                    htmlFor="keep-signed-in"
                                    className="ml-2 block text-sm text-gray-700 cursor-pointer"
                                >
                                    Keep me signed in
                                </label>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full px-4 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            <span className="relative flex items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-500">
                            Powered by <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Joblyt AI</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image & Info */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
                    <div className="max-w-lg space-y-8">
                        {/* Icon/Illustration */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl">
                                    <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="absolute inset-0 bg-white/30 rounded-3xl blur-2xl"></div>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-bold leading-tight">
                                AI-Powered CV Matching Made Simple
                            </h2>
                            <p className="text-lg text-purple-100 leading-relaxed">
                                Transform your recruitment process with intelligent resume analysis and job matching
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-transform duration-200">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Smart Matching</h3>
                                    <p className="text-sm text-purple-100">AI-driven candidate-job matching</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-transform duration-200">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Detailed Analytics</h3>
                                    <p className="text-sm text-purple-100">Comprehensive skill & experience analysis</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-transform duration-200">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Save Time</h3>
                                    <p className="text-sm text-purple-100">Automate resume screening instantly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;