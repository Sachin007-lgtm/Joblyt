import React from 'react';

const SelectJdStep = ({ jds, onSelectJd, processing }) => {
    if (jds.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-white/20 text-center">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg font-medium">No Job Descriptions available</p>
                <p className="text-gray-500 text-sm mt-2">Please contact the backend team to create job descriptions</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Select a Job Description</h1>
                <p className="text-gray-600 text-lg">Choose a JD to upload CVs against</p>
            </div>
            
            <div className="space-y-4">
                {jds.map((jd) => (
                    <div key={jd.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
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
                            </div>
                            <div className="flex-shrink-0 ml-6">
                                <button
                                    onClick={() => onSelectJd(jd)}
                                    disabled={processing || jd.status !== 'Active'}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                        jd.status === 'Active'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    title={jd.status !== 'Active' ? 'This JD is not active' : 'Select this JD'}
                                >
                                    {jd.status === 'Active' ? (
                                        <>
                                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Select & Upload CVs
                                        </>
                                    ) : (
                                        'Not Available'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelectJdStep;
