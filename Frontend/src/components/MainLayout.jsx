import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Brain, Briefcase, Clock, LogOut, Users } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <header className="relative z-50 bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Joblyt
                                </h1>
                                <p className="text-xs text-gray-500 -mt-1">Smart CV Matching</p>
                            </div>
                        </Link>
                        <div className="flex items-center space-x-2">
                            {user && user.role === 'admin' && (
                                <Link
                                    to="/users"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                        isActive('/users')
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                            : 'bg-white/50 hover:bg-white/80 text-gray-700 hover:shadow-md'
                                    }`}
                                >
                                    <Users className="w-5 h-5" />
                                    <span className="text-sm font-medium">Manage Users</span>
                                </Link>
                            )}
                            {user && (user.role === 'admin' || user.role === 'backend_team') && (
                                <Link
                                    to="/jds"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                        isActive('/jds')
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                            : 'bg-white/50 hover:bg-white/80 text-gray-700 hover:shadow-md'
                                    }`}
                                >
                                    <Briefcase className="w-5 h-5" />
                                    <span className="text-sm font-medium">Manage JDs</span>
                                </Link>
                            )}
                            <Link
                                to="/past-analyses"
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                    isActive('/past-analyses')
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-white/50 hover:bg-white/80 text-gray-700 hover:shadow-md'
                                }`}
                            >
                                <Clock className="w-5 h-5" />
                                <span className="text-sm font-medium">Past Analyses</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/50 hover:bg-red-50 text-red-600 hover:shadow-md transition-all duration-200 group"
                            >
                                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>

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
            `}</style>
        </div>
    );
};

export default MainLayout;