import React from 'react';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

const UploadStep = ({ files, dragOver, handleDrop, handleDragOver, handleDragLeave, handleFileSelect, handleRemoveFile, extractJD, processing }) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Upload Your Documents</h2>
      <p className="text-gray-600 text-lg">Upload a Job Description to get started. You can upload resumes now or later.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Job Description</h3>
          <p className="text-gray-600">Upload the job posting or requirements</p>
        </div>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragOver.jd
              ? 'border-indigo-400 bg-indigo-50 scale-105'
              : files.jd
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
          }`}
          onDrop={(e) => handleDrop(e, 'jd')}
          onDragOver={(e) => handleDragOver(e, 'jd')}
          onDragLeave={(e) => handleDragLeave(e, 'jd')}
        >
          {files.jd ? (
            <div className="text-green-600">
              <CheckCircle className="w-10 h-10 mx-auto mb-3" />
              <div className="flex items-center justify-center">
                <p className="font-semibold text-gray-800">{files.jd.name}</p>
                <button onClick={() => handleRemoveFile('jd')} className="ml-2 text-gray-600 hover:text-gray-800 p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">✓ Ready to extract</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 font-medium">Drop your JD here or</p>
              <input
                type="file"
                id="jd-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileSelect(e, 'jd')}
              />
              <label
                htmlFor="jd-upload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse Files
              </label>
            </>
          )}
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Resume / CV(s)</h3>
          <p className="text-gray-600">Upload one or more candidate resumes</p>
        </div>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragOver.cv
              ? 'border-purple-400 bg-purple-50 scale-105'
              : files.cv && files.cv.length > 0
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
          }`}
          onDrop={(e) => handleDrop(e, 'cv')}
          onDragOver={(e) => handleDragOver(e, 'cv')}
          onDragLeave={(e) => handleDragLeave(e, 'cv')}
        >
          {files.cv && files.cv.length > 0 ? (
            <div className="text-green-600">
              <CheckCircle className="w-10 h-10 mx-auto mb-3" />
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {files.cv.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-center text-gray-800 bg-white rounded-lg px-3 py-2 shadow-sm">
                    <span className="font-medium text-sm truncate max-w-xs">{file.name}</span>
                    <button onClick={() => handleRemoveFile('cv', idx)} className="ml-2 text-gray-600 hover:text-gray-800 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3 font-medium">✓ {files.cv.length} file{files.cv.length > 1 ? 's' : ''} ready</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 font-medium">Drop your CV(s) here or</p>
              <input
                type="file"
                id="cv-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                onChange={(e) => handleFileSelect(e, 'cv')}
              />
              <label
                htmlFor="cv-upload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse Files
              </label>
            </>
          )}
        </div>
      </div>
    </div>
    {files.jd && (
      <div className="text-center">
        <button
          onClick={extractJD}
          className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
          disabled={processing}
        >
          <FileText className="w-6 h-6 inline mr-2 group-hover:rotate-12 transition-transform duration-200" />
          {files.cv.length > 0 ? 'Extract JD & Resumes' : 'Extract JD'}
        </button>
      </div>
    )}
  </div>
);

export default UploadStep;
