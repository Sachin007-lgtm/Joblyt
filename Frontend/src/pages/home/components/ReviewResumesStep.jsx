import React from 'react';
import { Brain, Edit3 } from 'lucide-react';
import SkillBadge from '../../../components/ui/SkillBadge';

const ReviewResumesStep = ({ cvExtractionResults, setEditingCvIndex, matchResults, resetApp, processing }) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Resumes Extracted</h2>
      <p className="text-gray-600 text-lg">Review extracted CVs and skill presence. Proceed to match.</p>
    </div>
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <th className="px-4 py-2 text-left">Candidate</th>
              <th className="px-4 py-2 text-left">Skill Presence</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cvExtractionResults.map((cv, idx) => (
              <tr key={idx} className="border-t hover:bg-indigo-50">
                <td className="px-4 py-2 font-semibold">{cv.cv_json["Personal Data"]?.firstName} {cv.cv_json["Personal Data"]?.lastName}</td>
                <td className="px-4 py-2">
                  {Object.keys(cv.skill_presence || {}).length > 0 ? (
                    Object.entries(cv.skill_presence || {}).map(([skill, isPresent], i) => (
                      <SkillBadge key={i} text={skill} type={isPresent ? "present" : "absent"} />
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No skills analyzed</span>
                  )}
                </td>
                <td className="px-4 py-2">
                    <button
                        onClick={() => setEditingCvIndex(idx)}
                        className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="text-center flex gap-4 justify-center">
      <button
        onClick={matchResults}
        disabled={processing}
        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Brain className="w-5 h-5 inline mr-2" />
        Run Matching
      </button>
      <button
        onClick={resetApp}
        className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
      >
        Reset
      </button>
    </div>
  </div>
);

export default ReviewResumesStep;
