import React, { useState, useEffect } from 'react';
import api from '../../../api';
import useAuth from '../../../hooks/useAuth';

const PastAnalyses = () => {
    const { user } = useAuth();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true); // Start with true since we're loading data
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAnalyses = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/analyses`);
                setAnalyses(res.data);
            } catch (err) {
                setError('Failed to fetch past analyses.');
                console.error('Error fetching analyses:', err); // Add error logging
            }
            setLoading(false);
        };

        if (user) {
            fetchAnalyses();
        } else {
            setLoading(false); // If no user, stop loading
        }
    }, [user]);

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

    // Filter analyses based on search term
    const filteredAnalyses = analyses.filter(analysis => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (analysis.candidate?.name && analysis.candidate.name.toLowerCase().includes(searchLower)) ||
            (analysis.candidate?.email && analysis.candidate.email.toLowerCase().includes(searchLower)) ||
            (analysis.candidate?.phone && analysis.candidate.phone.toLowerCase().includes(searchLower))
        );
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // Add a safety check for analyses data
    if (!analyses || !Array.isArray(analyses)) {
        return <div className="text-red-500">Error: Invalid data format received.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Past Analyses</h2>
                <p className="text-gray-600 text-lg">Review candidates you have uploaded.</p>
            </div>

            {/* Search Section */}
            <div className="max-w-7xl mx-auto mb-6">
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
                                placeholder="Search by candidate name, email, or phone..."
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
                    </div>
                    {searchTerm && (
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredAnalyses.length} of {analyses.length} candidates
                        </div>
                    )}
                </div>
            </div>

            {filteredAnalyses.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="overflow-x-auto rounded-2xl shadow-lg">
                        <table className="min-w-full bg-white rounded-2xl overflow-hidden">
                            <thead>
                                <tr className="bg-red-100 text-gray-800 text-sm">
                                    <th className="px-4 py-2 text-left">Recruiter Name</th>
                                    <th className="px-4 py-2 text-left">Candidate Name</th>
                                    <th className="px-4 py-2 text-left">Date Uploaded</th>
                                    <th className="px-4 py-2 text-left">Candidate Mobile</th>
                                    <th className="px-4 py-2 text-left">Assessment Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnalyses.map((analysis, idx) => {
                                    // Add safety checks for analysis data
                                    if (!analysis || !analysis.candidate) {
                                        return (
                                            <tr key={idx} className="border-t hover:bg-red-50 text-sm">
                                                <td colSpan="5" className="px-4 py-2 text-red-500">
                                                    Error: Incomplete data for analysis #{idx}
                                                </td>
                                            </tr>
                                        );
                                    }
                                    
                                    return (
                                        <tr key={idx} className="border-t hover:bg-red-50 text-sm">
                                            <td className="px-4 py-2 whitespace-nowrap">{user.username}</td>
                                            <td className="px-4 py-2 font-semibold whitespace-nowrap">{analysis.candidate.name || 'N/A'}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {analysis.candidate.uploaded_at 
                                                    ? new Date(analysis.candidate.uploaded_at).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">{analysis.candidate.phone || 'N/A'}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {analysis.score !== undefined && analysis.score !== null 
                                                    ? `${analysis.score.toFixed(2)}%` 
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-white/20 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">
                        {searchTerm ? 'No candidates found matching your search.' : 'No past analyses found.'}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={handleClearSearch}
                            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PastAnalyses;
