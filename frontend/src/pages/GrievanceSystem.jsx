import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareWarning, Eye, X, Inbox, Clock, CheckCircle2, Brain } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import { grievances, grievanceStats } from '../data/mockData';

const cats = {
  subsidy:     { bg: 'bg-green-50 text-green-700 border-green-200', label: '💰 Subsidy' },
  insurance:   { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: '🛡 Insurance' },
  crop_damage: { bg: 'bg-red-50 text-red-700 border-red-200', label: '🌾 Crop Damage' },
  water_issue: { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', label: '💧 Water Issue' },
  technical:   { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: '🔧 Technical' },
};

export default function GrievanceSystem() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? grievances : grievances.filter(g => g.status === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Smart Grievance Classification" subtitle="AI-powered complaint categorization and priority prediction" icon={MessageSquareWarning} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-9">
        <StatCard title="Total Grievances" value={grievanceStats.total.toLocaleString()} icon={MessageSquareWarning} color="accent" />
        <StatCard title="Open" value={grievanceStats.open} icon={Inbox} color="warning" delay={0.05} />
        <StatCard title="In Progress" value={grievanceStats.inProgress} icon={Clock} color="purple" delay={0.1} />
        <StatCard title="Resolved" value={grievanceStats.resolved} icon={CheckCircle2} color="primary" delay={0.15} />
      </div>

      {/* NLP Banner */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-6 mb-9 text-white overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #6d28d9)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-base font-bold">NLP Classification Engine</p>
              <p className="text-purple-200 text-sm mt-0.5">{grievanceStats.aiClassificationAccuracy}% accuracy &bull; Avg resolution: {grievanceStats.avgResolutionTime}</p>
            </div>
          </div>
          <p className="text-3xl font-extrabold hidden sm:block">{grievanceStats.aiClassificationAccuracy}%</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 w-fit">
        {[{ k: 'all', l: 'All' }, { k: 'open', l: 'Open' }, { k: 'in_progress', l: 'In Progress' }, { k: 'resolved', l: 'Resolved' }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} className={`pill ${filter === f.k ? 'active purple' : ''}`}>{f.l}</button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-5">
        {filtered.map((g, i) => {
          const cat = cats[g.category] || cats.technical;
          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="stat-card p-6 cursor-pointer group" onClick={() => setSelected(g)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[11px] font-mono font-bold text-gray-400">{g.id}</span>
                    <StatusBadge status={g.priority} />
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${cat.bg}`}>{cat.label}</span>
                    <StatusBadge status={g.status} />
                  </div>
                  <p className="text-[14px] font-bold text-gray-800 mb-1">{g.farmerName} — {g.district}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{g.complaintText}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-gray-400">{g.submittedAt}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">AI: {g.aiConfidence}%</span>
                  </div>
                </div>
                <button className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"><Eye className="w-4 h-4" /></button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="modal-box max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center"><MessageSquareWarning className="w-5 h-5 text-violet-600" /></div>
                  <div><h3 className="text-base font-bold text-gray-900">Grievance Details</h3><p className="text-xs text-gray-400">{selected.id}</p></div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[{ l: 'Farmer', c: <span className="text-sm font-semibold text-gray-800">{selected.farmerName}</span> }, { l: 'District', c: <span className="text-sm font-semibold text-gray-800">{selected.district}</span> }, { l: 'Category', c: <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${cats[selected.category]?.bg}`}>{cats[selected.category]?.label}</span> }, { l: 'Priority', c: <StatusBadge status={selected.priority} size="md" /> }].map((x, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{x.l}</p>{x.c}</div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Complaint</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed border border-gray-100">{selected.complaintText}</p>
                </div>
                <div className="flex gap-3 pt-2"><button className="flex-1 btn-primary justify-center">Escalate</button><button className="flex-1 btn-ghost justify-center">Mark Resolved</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
