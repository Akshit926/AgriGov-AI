import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, CheckCircle2, XCircle, Compass, Wheat, Maximize2, MapPinned } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import { fieldVerifications } from '../data/mockData';

export default function FieldVerification() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? fieldVerifications : fieldVerifications.filter((f) => f.status === filter);
  const validCount = fieldVerifications.filter((f) => f.status === 'valid').length;
  const mismatchCount = fieldVerifications.filter((f) => f.status === 'mismatch').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="AI Field Verification" subtitle="Remote claim validation using regional crop and land data" icon={MapPin}
        actions={<button className="btn-primary"><Compass className="w-4 h-4" /> New Verification</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
        <StatCard title="Total Verifications" value={fieldVerifications.length} icon={MapPin} color="accent" delay={0} />
        <StatCard title="Valid Claims" value={validCount} icon={CheckCircle2} color="primary" delay={0.05} />
        <StatCard title="Mismatches Found" value={mismatchCount} icon={XCircle} color="danger" delay={0.1} />
      </div>

      {/* How it works banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-sky-50 to-green-50 rounded-2xl p-5 mb-7 border border-sky-100/50">
        <p className="text-sm font-bold text-slate-800 mb-2">How AI Field Verification Works</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { icon: MapPinned, label: 'Location Match', desc: 'Verify district data' },
            { icon: Wheat, label: 'Crop Validation', desc: 'Region crop patterns' },
            { icon: Maximize2, label: 'Area Check', desc: 'Land record cross-ref' },
            { icon: CheckCircle2, label: 'Final Score', desc: 'AI confidence rating' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white/60 rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-100 to-green-50 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{step.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200/70 p-1 shadow-sm">
          {['all', 'valid', 'mismatch'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`filter-pill capitalize ${filter === f ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white active shadow-md shadow-green-500/20' : 'text-slate-500 hover:bg-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item, idx) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            whileHover={{ y: -3 }}
            className={`bg-white rounded-2xl p-5 border stat-card-shadow cursor-pointer group ${
              item.status === 'mismatch' ? 'border-l-[3px] border-l-red-500 border-slate-100/80' : 'border-l-[3px] border-l-green-500 border-slate-100/80'
            }`}
            onClick={() => setSelected(item)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-mono font-bold text-slate-400">{item.id}</span>
                  <StatusBadge status={item.status} />
                </div>
                <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{item.farmerName}</h4>
              </div>
              <motion.div whileHover={{ scale: 1.1 }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-extrabold ${
                  item.status === 'valid' ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 shadow-sm shadow-green-500/10' :
                  'bg-gradient-to-br from-red-50 to-rose-50 text-red-600 shadow-sm shadow-red-500/10'
                }`}>
                {item.confidence}%
              </motion.div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Crop', value: item.claimedCrop, icon: '🌾' },
                { label: 'Area', value: item.claimedArea, icon: '📐' },
                { label: 'Location', value: item.location, icon: '📍' },
                { label: 'Season', value: item.season, icon: '🗓' },
              ].map((field, i) => (
                <div key={i} className="bg-slate-50/70 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{field.label}</p>
                  <p className="text-[13px] font-semibold text-slate-700 truncate">{field.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-content max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selected.status === 'valid' ? 'bg-gradient-to-br from-green-100 to-emerald-50' : 'bg-gradient-to-br from-red-100 to-rose-50'
                  }`}>
                    <MapPin className={`w-5 h-5 ${selected.status === 'valid' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Verification Report</h3>
                    <p className="text-xs text-slate-400 font-medium">{selected.id} &bull; {selected.applicationId}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Status', content: <StatusBadge status={selected.status} size="md" /> },
                    { label: 'Confidence', content: <span className={`text-lg font-extrabold ${selected.confidence >= 70 ? 'text-green-600' : 'text-red-600'}`}>{selected.confidence}%</span> },
                    { label: 'Farmer', content: <span className="text-sm font-semibold text-slate-800">{selected.farmerName}</span> },
                    { label: 'Crop', content: <span className="text-sm font-semibold text-slate-800">{selected.claimedCrop}</span> },
                    { label: 'Location', content: <span className="text-sm font-medium text-slate-600">{selected.location}</span> },
                    { label: 'Area', content: <span className="text-sm font-medium text-slate-600">{selected.claimedArea}</span> },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50/80 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                      {item.content}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Analysis</p>
                  <p className={`text-sm p-4 rounded-xl leading-relaxed border ${
                    selected.status === 'valid' ? 'bg-green-50/80 text-green-800 border-green-100/50' : 'bg-red-50/80 text-red-800 border-red-100/50'
                  }`}>{selected.details}</p>
                </div>
                <div className="flex gap-3 pt-3">
                  <button className="flex-1 btn-primary justify-center py-2.5">Accept</button>
                  <button className="flex-1 btn-ghost justify-center py-2.5">Request Physical Visit</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
