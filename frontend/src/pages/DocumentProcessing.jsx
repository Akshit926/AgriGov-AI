import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Search, Eye, CheckCircle2,
  AlertTriangle, FileWarning, X, FileUp, Sparkles,
} from 'lucide-react';
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
  const stats = {
    verified: documentHistory.filter((d) => d.status === 'verified').length,
    missing: documentHistory.filter((d) => d.status === 'missing_fields').length,
    review: documentHistory.filter((d) => d.status === 'needs_review').length,
  };

  const handleSimulateUpload = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setShowUpload(false); }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Intelligent Document Processing" subtitle="AI-powered OCR extraction and document verification" icon={FileText}
        actions={
          <button onClick={() => setShowUpload(true)} className="btn-primary">
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
        <StatCard title="Verified Documents" value={stats.verified} icon={CheckCircle2} color="primary" delay={0} />
        <StatCard title="Missing Fields" value={stats.missing} icon={AlertTriangle} color="warning" delay={0.05} />
        <StatCard title="Needs Review" value={stats.review} icon={FileWarning} color="accent" delay={0.1} />
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200/70 p-1 shadow-sm">
          {[
            { key: 'all', label: 'All Documents' },
            { key: 'verified', label: 'Verified' },
            { key: 'missing_fields', label: 'Missing Fields' },
            { key: 'needs_review', label: 'Needs Review' },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`filter-pill ${filter === f.key ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white active shadow-md shadow-green-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/70 shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search documents..." className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-44" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-100/80 stat-card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-premium">
            <thead>
              <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-green-50/20">
                {['Doc ID', 'Farmer Name', 'Document Type', 'Confidence', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80">
              {filteredDocs.map((doc, i) => (
                <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gradient-to-r hover:from-green-50/30 hover:to-transparent transition-all group cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}>
                  <td className="px-5 py-4 text-[13px] font-mono font-semibold text-slate-500">{doc.id}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-slate-800">{doc.farmerName}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{doc.documentType}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 progress-bar">
                        <div className={`progress-bar-fill ${doc.confidence >= 90 ? 'green' : doc.confidence >= 70 ? 'amber' : 'red'}`}
                          style={{ width: `${doc.confidence}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${doc.confidence >= 90 ? 'text-green-600' : doc.confidence >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{doc.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={doc.status} /></td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-medium">{doc.uploadDate}</td>
                  <td className="px-5 py-4">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setSelectedDoc(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-content max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-accent-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Document Details</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{selectedDoc.id} &bull; {selectedDoc.applicationId}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Status', content: <StatusBadge status={selectedDoc.status} size="md" /> },
                    { label: 'Confidence', content: <span className={`text-sm font-extrabold ${selectedDoc.confidence >= 90 ? 'text-green-600' : selectedDoc.confidence >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{selectedDoc.confidence}%</span> },
                    { label: 'Farmer', content: <span className="text-sm font-semibold text-slate-800">{selectedDoc.farmerName}</span> },
                    { label: 'Type', content: <span className="text-sm font-medium text-slate-600">{selectedDoc.documentType}</span> },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50/80 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                      {item.content}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-500" /> AI Extracted Fields
                  </p>
                  <div className="bg-gradient-to-br from-green-50/50 to-sky-50/30 rounded-xl p-4 space-y-2.5 border border-green-100/50">
                    {Object.entries(selectedDoc.extractedFields).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded-md shadow-sm text-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedDoc.missingFields.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Missing Fields</p>
                    <div className="bg-red-50/80 rounded-xl p-4 space-y-2 border border-red-100/50">
                      {selectedDoc.missingFields.map((f, i) => (<div key={i} className="flex items-center gap-2.5 text-sm text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{f}</div>))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-3">
                  <button className="flex-1 btn-primary justify-center py-2.5">Approve</button>
                  <button className="flex-1 btn-ghost justify-center py-2.5">Request Re-upload</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => !processing && setShowUpload(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="modal-content max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Upload Document</h3>
                <button onClick={() => !processing && setShowUpload(false)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-6">
                {processing ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full border-3 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-5" />
                    <p className="text-sm font-bold text-slate-800 mb-1">Processing Document...</p>
                    <p className="text-xs text-slate-500">AI is extracting text and verifying fields</p>
                    <div className="mt-5 space-y-2.5 text-left max-w-xs mx-auto">
                      <div className="flex items-center gap-2.5 text-xs text-green-600 font-medium"><CheckCircle2 className="w-4 h-4" /> OCR text extraction complete</div>
                      <div className="flex items-center gap-2.5 text-xs text-green-600 font-medium"><CheckCircle2 className="w-4 h-4" /> Field identification done</div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-primary-500 animate-spin" /> Verifying completeness...
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-primary-300 hover:bg-gradient-to-br hover:from-green-50/30 hover:to-sky-50/20 transition-all cursor-pointer group">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-3 group-hover:from-primary-100 group-hover:to-accent-50 transition-all">
                        <FileUp className="w-7 h-7 text-slate-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Drop files here or click to browse</p>
                      <p className="text-xs text-slate-400">Supports PDF, JPG, PNG (max 10MB)</p>
                    </div>
                    <button onClick={handleSimulateUpload} className="mt-5 w-full btn-primary justify-center py-3">
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
