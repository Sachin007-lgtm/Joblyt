import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import JdFormEditor from '../components/JdFormEditor';
import ProcessingLoader from '../components/ui/ProcessingLoader';

const JDEditPage = () => {
    const { jdId } = useParams();
    const [jd, setJd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJdDetails = async () => {
            try {
                setLoading(true);
                const jdResponse = await api.get(`/jds/${jdId}`);
                setJd(jdResponse.data);
            } catch (err) {
                setError('Failed to fetch job description details.');
            } finally {
                setLoading(false);
            }
        };
        fetchJdDetails();
    }, [jdId]);

    const handleUpdateJd = async (updatedJdDetails) => {
        try {
            setLoading(true);
            const payload = { details: updatedJdDetails };
            const response = await api.put(`/jds/${jdId}`, payload);
            setJd(response.data);
            alert('Job Description updated successfully!');
        } catch (err) {
            setError('Failed to update job description.');
            alert('Error: ' + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading && !jd) {
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Edit Job Description
                        </h1>
                        <p className="text-gray-600 text-sm">Update job details and requirements</p>
                    </div>
                </div>
            </div>

            {/* Editor Section */}
            {jd && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
                    <JdFormEditor jdData={jd.details} onUpdate={(newDetails) => setJd(prev => ({...prev, details: newDetails}))} />
                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => handleUpdateJd(jd.details)}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JDEditPage;
