import React from 'react';
import { FileText, Edit3, X, Plus, SlidersHorizontal } from 'lucide-react';
import JdFormEditor from '../../../components/JdFormEditor';

const ReviewJdStep = ({
  editedJdJson,
  skillCategories,
  newSkill,
  showJsonView,
  setEditedJdJson,
  moveSkill,
  addSkill,
  removeSkill,
  setNewSkill,
  setShowJsonView,
  extractResumes,
  saveJd,
  resetApp,
  processing,
  user
}) => {
  const hasCvFiles = user?.role !== 'recruiter'; // Simplified logic, adjust as needed

  // Calculate total weight
  const calculateTotalWeight = (weights) => {
    const critical = weights?.critical || 0;
    const important = weights?.important || 0;
    const desired = weights?.desired || 0;
    const base = weights?.base || 0;
    return critical + important + desired + base;
  };

  const totalWeight = calculateTotalWeight(editedJdJson?.skillWeights);
  const isWeightValid = totalWeight <= 1.0;

  return (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Review & Categorize JD Skills</h2>
      <p className="text-gray-600 text-lg">Categorize required skills and edit other JD fields if needed.</p>
    </div>
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
      {/* Skill Categorization UI */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">Required Skills Categorization</label>
        <div className="flex flex-wrap gap-4 mb-4">
          {['critical', 'important', 'extra'].map(cat => (
            <div key={cat} className="flex-1 min-w-[180px]">
              <div className={`font-semibold mb-2 capitalize ${cat === 'critical' ? 'text-rose-700' : cat === 'important' ? 'text-amber-700' : 'text-indigo-700'}`}>{cat}</div>
        <div className="flex flex-wrap gap-2 mb-2">
                {skillCategories[cat].map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {skill}
              <button
                className="ml-2 text-gray-600 hover:text-gray-800"
                      onClick={() => removeSkill(skill, cat)}
              >
                <X className="w-4 h-4" />
              </button>
                    <span className="ml-2 flex gap-1">
                      {['critical', 'important', 'extra'].filter(c => c !== cat).map(targetCat => (
                        <button
                          key={targetCat}
                          className={`text-xs px-1 py-0.5 rounded ${targetCat === 'critical' ? 'bg-rose-200 text-rose-700' : targetCat === 'important' ? 'bg-amber-200 text-amber-700' : 'bg-indigo-200 text-indigo-700'}`}
                          onClick={() => moveSkill(skill, cat, targetCat)}
                        >
                          {targetCat.charAt(0).toUpperCase()}
                        </button>
                      ))}
                    </span>
            </span>
          ))}
        </div>
              <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
                  placeholder={`Add to ${cat}`}
            onKeyDown={e => {
              if (e.key === 'Enter' && newSkill.trim()) {
                      addSkill(newSkill, cat);
              }
            }}
          />
          <button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all duration-200"
                  onClick={() => addSkill(newSkill, cat)}
          >
            <Plus className="w-4 h-4" />
          </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Collapsible advanced JSON editor */}
      {/* Weights & Rejection Rules */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold">
          <SlidersHorizontal className="w-4 h-4" />
          Skill Weights & Rejection Rules (optional)
        </div>
        {/* Weight Validation Warning */}
        {totalWeight > 0 && (
          <div className={`text-sm p-2 rounded ${
            isWeightValid 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            Total Weight: {totalWeight.toFixed(2)} / 1.00
            {!isWeightValid && (
              <span className="font-semibold ml-2">⚠️ Total exceeds 1.0! Please adjust.</span>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-700">Critical Weight</label>
            <input type="number" step="0.01" min="0" max="1"
                   className={`border rounded px-2 py-1 text-sm ${
                     !isWeightValid ? 'border-red-300 bg-red-50' : ''
                   }`}
                   value={(editedJdJson?.skillWeights?.critical ?? '')}
                   onChange={e => setEditedJdJson(prev => ({
                     ...prev,
                     skillWeights: { ...(prev?.skillWeights||{}), critical: Number(e.target.value) }
                   }))}
                   placeholder="Default 0.4" />
            <label className="text-sm text-gray-700">Important Weight</label>
            <input type="number" step="0.01" min="0" max="1"
                   className={`border rounded px-2 py-1 text-sm ${
                     !isWeightValid ? 'border-red-300 bg-red-50' : ''
                   }`}
                   value={(editedJdJson?.skillWeights?.important ?? '')}
                   onChange={e => setEditedJdJson(prev => ({
                     ...prev,
                     skillWeights: { ...(prev?.skillWeights||{}), important: Number(e.target.value) }
                   }))}
                   placeholder="Default 0.3" />
            <label className="text-sm text-gray-700">Desired Weight</label>
            <input type="number" step="0.01" min="0" max="1"
                   className={`border rounded px-2 py-1 text-sm ${
                     !isWeightValid ? 'border-red-300 bg-red-50' : ''
                   }`}
                   value={(editedJdJson?.skillWeights?.desired ?? '')}
                   onChange={e => setEditedJdJson(prev => ({
                     ...prev,
                     skillWeights: { ...(prev?.skillWeights||{}), desired: Number(e.target.value) }
                   }))}
                   placeholder="Default 0.2" />
            <label className="text-sm text-gray-700">Base Skill Score</label>
            <input type="number" step="0.01" min="0" max="1"
                   className={`border rounded px-2 py-1 text-sm ${
                     !isWeightValid ? 'border-red-300 bg-red-50' : ''
                   }`}
                   value={(editedJdJson?.skillWeights?.base ?? '')}
                   onChange={e => setEditedJdJson(prev => ({
                     ...prev,
                     skillWeights: { ...(prev?.skillWeights||{}), base: Number(e.target.value) }
                   }))}
                   placeholder="Default 0.1" />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-sm text-gray-700">Critical Min % (Reject if below)</label>
            <input type="number" step="1" min="0" max="100"
                   className="border rounded px-2 py-1 text-sm"
                   value={(editedJdJson?.rejectionRules?.criticalMinPercent ?? '')}
                   onChange={e => setEditedJdJson(prev => ({
                     ...prev,
                     rejectionRules: { ...(prev?.rejectionRules||{}), criticalMinPercent: Number(e.target.value) }
                   }))}
                   placeholder="Default 70" />
            <label className="text-sm text-gray-700">Pass Min Overall</label>
            <input type="number" step="0.01" min="0" max="1"
                   className="border rounded px-2 py-1 text-sm"
                   value={(editedJdJson?.rejectionRules?.passMin ?? '')}
                   onChange={e => setEditedJdJson(prev => ({
                     ...prev,
                     rejectionRules: { ...(prev?.rejectionRules||{}), passMin: Number(e.target.value) }
                   }))}
                   placeholder="Default 0.7" />
            <label className="text-sm text-gray-700">Reject Below Overall</label>
            <input type="number" step="0.01" min="0" max="1"
                   className="border rounded px-2 py-1 text-sm"
                   value={(editedJdJson?.rejectionRules?.rejectBelow ?? '')}
                   onChange={e => setEditedJdJson(prev => ({
                     ...prev,
                     rejectionRules: { ...(prev?.rejectionRules||{}), rejectBelow: Number(e.target.value) }
                   }))}
                   placeholder="Default 0.4" />
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">Leave blank to use defaults.</div>
      </div>

      {/* Collapsible advanced JSON editor */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-700">JD Form Editor</span>
        <button
          className="flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200"
          onClick={() => setShowJsonView(!showJsonView)}
        >
          {showJsonView ? <Edit3 className="w-4 h-4 mr-1" /> : <FileText className="w-4 h-4 mr-1" />}
          {showJsonView ? 'Edit Form' : 'View JSON'}
        </button>
      </div>
      {showJsonView ? (
        <pre className="bg-gray-50 rounded p-4 text-xs overflow-x-auto">{JSON.stringify(editedJdJson, null, 2)}</pre>
      ) : (
        <JdFormEditor jdData={editedJdJson} onUpdate={setEditedJdJson} />
      )}
    </div>
    <div className="text-center flex gap-4 justify-center">
      <button
        onClick={extractResumes}
        disabled={processing || !hasCvFiles || !isWeightValid}
        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        title={!isWeightValid ? "Total weight must be ≤ 1.0" : ""}
      >
        <FileText className="w-5 h-5 inline mr-2" />
        Extract Resumes
      </button>
      {(user?.role === 'admin' || user?.role === 'backend_team') && (
        <button
          onClick={saveJd}
          disabled={processing || !isWeightValid}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          title={!isWeightValid ? "Total weight must be ≤ 1.0" : ""}
        >
          Save JD
        </button>
      )}
      <button
        onClick={resetApp}
        className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
      >
        Reset
      </button>
    </div>
  </div>
)};

export default ReviewJdStep;
