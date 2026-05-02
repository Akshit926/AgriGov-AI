import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, CheckCircle2, XCircle, Compass } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import { fieldVerifications } from '../data/mockData';

export default function FieldVerification() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? fieldVerifications : fieldVerifications.filter(f => f.status === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="AI Field Verification" subtitle="Remote claim validation using regional crop and land data" icon={MapPin}
        actions={<button className="btn-primary"><Compass className="w-4 h-4" /> New Verification</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-9">
        <StatCard title="Total Verifications" value={fieldVerifications.length} icon={MapPin} color="accent" />
        <StatCard title="Valid Claims" value={fieldVerifications.filter(f => f.status === 'valid').length} icon={CheckCircle2} color="primary" delay={0.05} />
        <StatCard title="Mismatches" value={fieldVerifications.filter(f => f.status === 'mismatch').length} icon={XCircle} color="danger" delay={0.1} />
      </div>

      {/* How it works */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="stat-card p-6 mb-9" style={{ background: 'linear-gradient(135deg, #f0fdf4, #f0f9ff)' }}>
        <p className="text-sm font-bold text-gray-800 mb-3">How AI Verification Works</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Location Match', 'Crop Validation', 'Area Check', 'Confidence Score'].map((s, i) => (
            <div key={i} className="bg-white/70 rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600 font-bold text-sm">{i + 1}</div>
              <p className="text-xs font-semibold text-gray-700">{s}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 w-fit">
        {['all', 'valid', 'mismatch'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`pill capitalize ${filter === f ? 'active green' : ''}`}>{f}</button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className={`stat-card p-6 cursor-pointer border-l-[3px] ${item.status === 'valid' ? 'border-l-emerald-500' : 'border-l-red-500'}`}
            onClick={() => setSelected(item)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1"><span className="text-[11px] font-mono font-bold text-gray-400">{item.id}</span><StatusBadge status={item.status} /></div>
                <h4 className="text-[15px] font-bold text-gray-800">{item.farmerName}</h4>
              </div>
              <div className={`w-13 h-13 rounded-xl flex items-center justify-center text-base font-extrabold px-3 py-2 ${
                item.status === 'valid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>{item.confidence}%</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ l: 'Crop', v: item.claimedCrop }, { l: 'Area', v: item.claimedArea }, { l: 'Location', v: item.location }, { l: 'Season', v: item.season }].map((f, j) => (
                <div key={j} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{f.l}</p>
                  <p className="text-[13px] font-semibold text-gray-700 truncate">{f.v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="modal-box max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected.status === 'valid' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <MapPin className={`w-5 h-5 ${selected.status === 'valid' ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div><h3 className="text-base font-bold text-gray-900">Verification Report</h3><p className="text-xs text-gray-400">{selected.id}</p></div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[{ l: 'Status', c: <StatusBadge status={selected.status} size="md" /> }, { l: 'Confidence', c: <span className={`text-lg font-extrabold ${selected.confidence >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>{selected.confidence}%</span> }, { l: 'Farmer', c: <span className="text-sm font-semibold text-gray-800">{selected.farmerName}</span> }, { l: 'Crop', c: <span className="text-sm text-gray-700">{selected.claimedCrop}</span> }, { l: 'Location', c: <span className="text-sm text-gray-600">{selected.location}</span> }, { l: 'Area', c: <span className="text-sm text-gray-600">{selected.claimedArea}</span> }].map((x, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{x.l}</p>{x.c}</div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Analysis</p>
                  <p className={`text-sm p-4 rounded-xl leading-relaxed border ${selected.status === 'valid' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'}`}>{selected.details}</p>
                </div>
                <div className="flex gap-3 pt-2"><button className="flex-1 btn-primary justify-center">Accept</button><button className="flex-1 btn-ghost justify-center">Request Visit</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
