import React, { useState, useEffect } from 'react';
import api from '../api';
import useAuth from '../hooks/useAuth';
import { Plus, Trash2, Edit } from 'lucide-react';

const UserManagementPage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'recruiter' });
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/', newUser);
            setNewUser({ username: '', email: '', password: '', role: 'recruiter' });
            setShowCreateForm(false);
            fetchUsers();
        } catch (err) {
            setError('Failed to create user: ' + (err.response?.data?.detail || err.message));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                fetchUsers();
            } catch (err) {
                setError('Failed to delete user: ' + (err.response?.data?.detail || err.message));
            }
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                User Management
                            </h1>
                            <p className="text-gray-600 text-sm">Manage users and permissions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center font-semibold"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {showCreateForm ? 'Cancel' : 'Create New User'}
                    </button>
                </div>
            </div>

            {showCreateForm && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h2>
                    <form onSubmit={handleCreateUser} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Username</label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white font-medium"
                                >
                                    <option value="recruiter">Recruiter</option>
                                    <option value="admin">Admin</option>
                                    <option value="backend_team">Backend Team</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Create User
                        </button>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="space-y-4">
                {users.length > 0 ? users.map((u) => (
                    <div key={u.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex-grow space-y-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{u.username.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{u.username}</h3>
                                        <p className="text-sm text-gray-600">{u.email}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        u.is_active 
                                            ? 'bg-green-100 text-green-700 border border-green-300' 
                                            : 'bg-red-100 text-red-700 border border-red-300'
                                    }`}>
                                        {u.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="ml-15 flex items-center space-x-2">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                                        {u.role}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 ml-6">
                                <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center font-semibold"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-white/20 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
