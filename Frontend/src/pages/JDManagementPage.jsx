import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const JDManagementPage = () => {
    const [jds, setJds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState(''); // Separate input state
    const [statusFilter, setStatusFilter] = useState('All');
    const [editingJd, setEditingJd] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchJds();
    }, []);

    const fetchJds = async () => {
        try {
            setLoading(true);
            const response = await api.get('/jds');
            setJds(response.data);
        } catch (err) {
            setError('Failed to fetch job descriptions.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (jdId) => {
        try {
            await api.patch(`/jds/${jdId}`, { status: newStatus });
            setEditingJd(null);
            fetchJds(); // Refetch to get the updated list
        } catch (err) {
            setError('Failed to update job description.');
        }
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchTerm('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const filteredJds = jds.filter(jd => {
        const matchesSearch = searchTerm === '' || 
            jd.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (jd.company_name && jd.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (jd.location && jd.location.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || jd.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading && jds.length === 0) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Job Description Management
                    </h1>
                </div>
                <p className="text-gray-600 ml-14">Manage and organize your job descriptions</p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by position, company, or location..."
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search</span>
                    </button>
                    <select
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white font-medium text-gray-700"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Hold">Hold</option>
                        <option value="Not Active">Not Active</option>
                    </select>
                </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
                {filteredJds.length > 0 ? filteredJds.map((jd) => (
                    <div key={jd.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div className="flex-grow space-y-2">
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-2xl font-bold text-gray-900">{jd.job_title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        jd.status === 'Active' 
                                            ? 'bg-green-100 text-green-700 border border-green-300' 
                                            : jd.status === 'Hold' 
                                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                                            : 'bg-red-100 text-red-700 border border-red-300'
                                    }`}>
                                        {jd.status}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="text-sm font-medium">{jd.company_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm">{jd.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-medium">CTC: {jd.ctc || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Created: {new Date(jd.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex-shrink-0 ml-6">
                                {editingJd === jd.id ? (
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Hold">Hold</option>
                                            <option value="Not Active">Not Active</option>
                                        </select>
                                        <button
                                            onClick={() => handleUpdateStatus(jd.id)}
                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingJd(null)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => {
                                                setEditingJd(jd.id);
                                                setNewStatus(jd.status);
                                            }}
                                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            Edit Status
                                        </button>
                                        <Link 
                                            to={`/jds/${jd.id}/edit`} 
                                            className="px-4 py-2 bg-white border-2 border-indigo-200 text-indigo-600 text-sm text-center rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                                        >
                                            Edit JD
                                        </Link>
                                        <Link 
                                            to={`/jds/${jd.id}/analyses`} 
                                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm text-center rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            View Analyses
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-white/20 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No job descriptions found.</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JDManagementPage;
