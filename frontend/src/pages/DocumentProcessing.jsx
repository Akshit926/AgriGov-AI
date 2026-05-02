import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Search, Eye, CheckCircle2, AlertTriangle, FileWarning, X, FileUp, Sparkles } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import { documentHistory } from '../data/mockData';

export default function DocumentProcessing() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(false);

  const filteredDocs = filter === 'all' ? documentHistory : documentHistory.filter((d) => d.status === filter);
  const stats = { verified: documentHistory.filter(d => d.status === 'verified').length, missing: documentHistory.filter(d => d.status === 'missing_fields').length, review: documentHistory.filter(d => d.status === 'needs_review').length };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Intelligent Document Processing" subtitle="AI-powered OCR extraction and document verification" icon={FileText}
        actions={<button onClick={() => setShowUpload(true)} className="btn-primary"><Upload className="w-4 h-4" /> Upload Document</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-9">
        <StatCard title="Verified Documents" value={stats.verified} icon={CheckCircle2} color="primary" />
        <StatCard title="Missing Fields" value={stats.missing} icon={AlertTriangle} color="warning" delay={0.05} />
        <StatCard title="Needs Review" value={stats.review} icon={FileWarning} color="accent" delay={0.1} />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
          {[{ key: 'all', label: 'All' }, { key: 'verified', label: 'Verified' }, { key: 'missing_fields', label: 'Missing' }, { key: 'needs_review', label: 'Review' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`pill ${filter === f.key ? 'active green' : ''}`}>{f.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-50 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search documents..." className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-44" />
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="stat-card overflow-hidden">
        <table className="w-full table-clean">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {['Doc ID', 'Farmer Name', 'Document Type', 'Confidence', 'Status', 'Date', ''].map(h => (
                <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredDocs.map((doc, i) => (
              <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedDoc(doc)}>
                <td className="px-6 py-4 text-[13px] font-mono font-semibold text-gray-500">{doc.id}</td>
                <td className="px-6 py-4 text-[13px] font-semibold text-gray-800">{doc.farmerName}</td>
                <td className="px-6 py-4 text-[13px] text-gray-600">{doc.documentType}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 progress-track"><div className={`progress-fill ${doc.confidence >= 90 ? 'green' : doc.confidence >= 70 ? 'amber' : 'red'}`} style={{ width: `${doc.confidence}%` }} /></div>
                    <span className={`text-xs font-bold ${doc.confidence >= 90 ? 'text-emerald-600' : doc.confidence >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{doc.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                <td className="px-6 py-4 text-[13px] text-gray-400">{doc.uploadDate}</td>
                <td className="px-6 py-4"><button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100"><Eye className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setSelectedDoc(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }} className="modal-box max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><FileText className="w-5 h-5 text-emerald-600" /></div>
                  <div><h3 className="text-base font-bold text-gray-900">Document Details</h3><p className="text-xs text-gray-400">{selectedDoc.id}</p></div>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[{ l: 'Status', c: <StatusBadge status={selectedDoc.status} size="md" /> }, { l: 'Confidence', c: <span className={`text-lg font-extrabold ${selectedDoc.confidence >= 90 ? 'text-emerald-600' : selectedDoc.confidence >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{selectedDoc.confidence}%</span> }, { l: 'Farmer', c: <span className="text-sm font-semibold text-gray-800">{selectedDoc.farmerName}</span> }, { l: 'Type', c: <span className="text-sm text-gray-600">{selectedDoc.documentType}</span> }].map((x, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{x.l}</p>{x.c}</div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-500" /> AI Extracted Fields</p>
                  <div className="bg-emerald-50/50 rounded-xl p-4 space-y-2 border border-emerald-100/50">
                    {Object.entries(selectedDoc.extractedFields).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-sm"><span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span><span className="font-semibold text-gray-800 bg-white px-2 py-0.5 rounded text-xs">{v}</span></div>
                    ))}
                  </div>
                </div>
                {selectedDoc.missingFields.length > 0 && (
                  <div><p className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Missing Fields</p>
                    <div className="bg-red-50 rounded-xl p-3 space-y-1.5 border border-red-100/50">
                      {selectedDoc.missingFields.map((f, i) => <div key={i} className="flex items-center gap-2 text-sm text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{f}</div>)}
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-2"><button className="flex-1 btn-primary justify-center">Approve</button><button className="flex-1 btn-ghost justify-center">Request Re-upload</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => !processing && setShowUpload(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="modal-box max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Upload Document</h3>
                <button onClick={() => !processing && setShowUpload(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-6">
                {processing ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full border-[3px] border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-800">Processing Document...</p>
                    <p className="text-xs text-gray-400 mt-1">AI is extracting and verifying</p>
                  </div>
                ) : (
                  <>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center mx-auto mb-3 transition-all">
                        <FileUp className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Drop files here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
                    </div>
                    <button onClick={() => { setProcessing(true); setTimeout(() => { setProcessing(false); setShowUpload(false); }, 3000); }} className="mt-4 w-full btn-primary justify-center">
                      <Sparkles className="w-4 h-4" /> Process with AI
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
