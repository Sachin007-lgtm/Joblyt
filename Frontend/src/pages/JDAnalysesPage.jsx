import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ProcessingLoader from '../components/ui/ProcessingLoader';

const JDAnalysesPage = () => {
    const { jdId } = useParams();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                setLoading(true);
                const analysesResponse = await api.get(`/jds/${jdId}/results`);
                setAnalyses(analysesResponse.data);
            } catch (err) {
                setError('Failed to fetch analyses.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalyses();
    }, [jdId]);

    if (loading) {
        return <ProcessingLoader />;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Job Analysis Results
                        </h1>
                        <p className="text-gray-600 text-sm">View all candidate analyses for this position</p>
                    </div>
                </div>
            </div>

            {/* Analyses List */}
            <div className="space-y-4">
                {analyses.length > 0 ? analyses.map((analysis) => (
                    <div key={analysis.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        {analysis.candidate.name?.charAt(0).toUpperCase() || 'C'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{analysis.candidate.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm text-gray-600">{analysis.candidate.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            {analysis.score?.toFixed(2)}%
                                        </p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                                            analysis.score >= 80 
                                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                                : analysis.score >= 60 
                                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                                                : 'bg-red-100 text-red-700 border border-red-300'
                                        }`}>
                                            {analysis.match_level || 'No Match'}
                                        </span>
                                    </div>
                                    <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-white/20 text-center">
                        <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg font-medium">No analyses found</p>
                        <p className="text-gray-500 text-sm mt-2">Upload CVs to start analyzing candidates for this position</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JDAnalysesPage;
