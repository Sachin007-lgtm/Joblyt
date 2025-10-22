import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { UploadCloud } from 'lucide-react';

const UploadCVsPage = () => {
    const { jdId } = useParams();
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one CV to upload.');
            return;
        }

        setProcessing(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        const jdResponse = await api.get(`/jds/${jdId}`);
        formData.append('jd_json', JSON.stringify(jdResponse.data.details));
        for (let i = 0; i < files.length; i++) {
            formData.append('resume_files', files[i]);
        }

        try {
            await api.post('/extract_resumes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess('CVs uploaded and processed successfully!');
            setFiles([]);
        } catch (err) {
            setError('Failed to upload CVs.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Upload CVs
                        </h1>
                        <p className="text-gray-600 text-sm">Upload candidate resumes for Job ID: {jdId}</p>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
                <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                        dragOver 
                            ? 'border-indigo-400 bg-indigo-50 scale-105' 
                            : files.length > 0 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
                        <UploadCloud className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">Upload Candidate CVs</p>
                    <p className="text-gray-600 mb-6">Drag and drop your CVs here, or click to select files</p>
                    
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        id="cv-upload"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileSelect}
                    />
                    <label 
                        htmlFor="cv-upload" 
                        className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Select Files
                    </label>
                    
                    {files.length > 0 && (
                        <div className="mt-8 p-4 bg-white rounded-xl shadow-sm">
                            <p className="font-semibold text-gray-800 mb-3">
                                ✓ {files.length} file{files.length > 1 ? 's' : ''} selected
                            </p>
                            <div className="max-h-32 overflow-y-auto space-y-2">
                                {files.map((file, idx) => (
                                    <div key={idx} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                        📄 {file.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleUpload}
                        disabled={processing || files.length === 0}
                        className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center mx-auto"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload and Process CVs
                            </>
                        )}
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
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
                {success && (
                    <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700 font-medium">{success}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadCVsPage;
