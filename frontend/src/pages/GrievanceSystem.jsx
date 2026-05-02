import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareWarning, Eye, X, Inbox, Clock, CheckCircle2, Brain } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import { grievances, grievanceStats } from '../data/mockData';

const categoryConfig = {
  subsidy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Subsidy', emoji: '💰' },
  insurance: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Insurance', emoji: '🛡' },
  crop_damage: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Crop Damage', emoji: '🌾' },
  water_issue: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Water Issue', emoji: '💧' },
  technical: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Technical', emoji: '🔧' },
};

export default function GrievanceSystem() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? grievances : grievances.filter((g) => g.status === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Smart Grievance Classification" subtitle="AI-powered complaint categorization and priority prediction" icon={MessageSquareWarning} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatCard title="Total Grievances" value={grievanceStats.total.toLocaleString()} icon={MessageSquareWarning} color="accent" delay={0} />
        <StatCard title="Open" value={grievanceStats.open} icon={Inbox} color="warning" delay={0.05} />
        <StatCard title="In Progress" value={grievanceStats.inProgress} icon={Clock} color="purple" delay={0.1} />
        <StatCard title="Resolved" value={grievanceStats.resolved} icon={CheckCircle2} color="primary" delay={0.15} />
      </div>

      {/* AI Accuracy Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl p-5 mb-7 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-xl" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-bold">NLP Classification Engine</p>
              <p className="text-purple-200 text-sm font-medium mt-0.5">
                Auto-categorizes complaints with {grievanceStats.aiClassificationAccuracy}% accuracy &bull; Avg resolution: {grievanceStats.avgResolutionTime}
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-4xl font-extrabold">{grievanceStats.aiClassificationAccuracy}%</p>
            <p className="text-xs text-purple-200 font-medium mt-0.5">Accuracy Score</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200/70 p-1 shadow-sm">
          {[
            { key: 'all', label: 'All' },
            { key: 'open', label: 'Open' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'resolved', label: 'Resolved' },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`filter-pill ${filter === f.key ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white active shadow-md shadow-purple-500/20' : 'text-slate-500 hover:bg-slate-50'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grievance Cards */}
      <div className="space-y-4">
        {filtered.map((grv, idx) => {
          const cat = categoryConfig[grv.category] || categoryConfig.technical;
          return (
            <motion.div key={grv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-5 border border-slate-100/80 stat-card-shadow cursor-pointer group"
              onClick={() => setSelected(grv)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[12px] font-mono font-bold text-slate-400">{grv.id}</span>
                    <StatusBadge status={grv.priority} />
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${cat.bg} ${cat.text} border ${cat.border}`}>
                      {cat.emoji} {cat.label}
                    </span>
                    <StatusBadge status={grv.status} />
                  </div>
                  <p className="text-[14px] font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">{grv.farmerName} &mdash; {grv.district}</p>
                  <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">{grv.complaintText}</p>
                  <div className="flex items-center gap-4 mt-2.5">
                    <span className="text-[11px] text-slate-400 font-medium">{grv.submittedAt}</span>
                    <span className="text-[11px] text-primary-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      AI: {grv.aiConfidence}%
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center">
                    <MessageSquareWarning className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Grievance Details</h3>
                    <p className="text-xs text-slate-400 font-medium">{selected.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Farmer', content: <span className="text-sm font-semibold text-slate-800">{selected.farmerName}</span> },
                    { label: 'District', content: <span className="text-sm font-semibold text-slate-800">{selected.district}</span> },
                    { label: 'Category', content: <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${categoryConfig[selected.category]?.bg} ${categoryConfig[selected.category]?.text}`}>{categoryConfig[selected.category]?.emoji} {categoryConfig[selected.category]?.label}</span> },
                    { label: 'Priority', content: <StatusBadge status={selected.priority} size="md" /> },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50/80 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                      {item.content}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Complaint</p>
                  <p className="text-sm text-slate-700 bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl leading-relaxed border border-slate-100">{selected.complaintText}</p>
                </div>
                <div className="flex gap-3 pt-3">
                  <button className="flex-1 btn-primary justify-center py-2.5">Escalate</button>
                  <button className="flex-1 btn-ghost justify-center py-2.5">Mark Resolved</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
