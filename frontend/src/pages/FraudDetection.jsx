import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Eye, X, Search, AlertTriangle, Shield, TrendingDown, Scan } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import { fraudAlerts, fraudStats } from '../data/mockData';

export default function FraudDetection() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? fraudAlerts : fraudAlerts.filter((f) => f.riskLevel === filter);

  const chartData = [
    { type: 'Duplicate', count: 12, color: '#ef4444' },
    { type: 'Land Overlap', count: 6, color: '#f97316' },
    { type: 'Suspicious', count: 8, color: '#eab308' },
    { type: 'Repeated', count: 5, color: '#f59e0b' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Fraud & Duplicate Detection" subtitle="AI anomaly detection for suspicious applications" icon={ShieldAlert}
        actions={<button className="btn-danger"><Shield className="w-4 h-4" /> Run Full Scan</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatCard title="Total Scanned" value={fraudStats.totalScanned.toLocaleString()} icon={Scan} color="accent" delay={0} />
        <StatCard title="Fraud Detected" value={fraudStats.fraudDetected} icon={ShieldAlert} color="danger" delay={0.05} />
        <StatCard title="High Risk" value={fraudStats.highRisk} icon={AlertTriangle} color="warning" delay={0.1} />
        <StatCard title="Amount Saved" value={fraudStats.savedAmount} icon={TrendingDown} color="primary" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100/80 stat-card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-100 to-rose-50 flex items-center justify-center">
              <ShieldAlert className="w-4.5 h-4.5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Fraud Types Distribution</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Breakdown by category</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', fontSize: '12px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detection Rate */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-6 border border-slate-100/80 stat-card-shadow flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none" stroke="url(#detectionGrad)" strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 327' }}
                animate={{ strokeDasharray: `${fraudStats.detectionRate * 3.27} 327` }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="detectionGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900">{fraudStats.detectionRate}%</span>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-800">Detection Rate</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Isolation Forest ML model</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200/70 p-1 shadow-sm">
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`filter-pill capitalize ${filter === f ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white active shadow-md shadow-red-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Fraud Alert Cards */}
      <div className="space-y-4">
        {filtered.map((alert, i) => (
          <motion.div key={alert.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className={`bg-white rounded-2xl p-5 border stat-card-shadow cursor-pointer group ${
              alert.riskLevel === 'critical' ? 'border-l-[3px] border-l-red-500 border-slate-100/80' :
              alert.riskLevel === 'high' ? 'border-l-[3px] border-l-orange-500 border-slate-100/80' :
              'border-slate-100/80'
            }`}
            onClick={() => setSelected(alert)}>
            <div className="flex items-start justify-between gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className="text-[13px] font-mono font-bold text-slate-600">{alert.id}</span>
                  <StatusBadge status={alert.riskLevel} />
                  <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md font-medium">{alert.fraudType}</span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">{alert.details.slice(0, 140)}...</p>
                <div className="flex items-center gap-4 mt-2.5">
                  <span className="text-xs text-slate-500 font-medium">App: <span className="font-bold text-slate-700">{alert.applicationId}</span></span>
                  <span className="text-[11px] text-slate-400">{alert.detectedAt}</span>
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold ${
                    alert.fraudScore >= 0.8 ? 'bg-gradient-to-br from-red-50 to-rose-50 text-red-600 shadow-sm shadow-red-500/10' :
                    alert.fraudScore >= 0.6 ? 'bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600' :
                    'bg-gradient-to-br from-green-50 to-emerald-50 text-green-600'
                  }`}>
                  {Math.round(alert.fraudScore * 100)}
                </motion.div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-semibold uppercase tracking-wider">Risk</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-content max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-rose-50 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Fraud Report</h3>
                    <p className="text-xs text-slate-400 font-medium">{selected.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/80 rounded-xl p-3"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Level</p><StatusBadge status={selected.riskLevel} size="md" /></div>
                  <div className="bg-slate-50/80 rounded-xl p-3"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p><span className="text-lg font-extrabold text-red-600">{Math.round(selected.fraudScore * 100)}/100</span></div>
                </div>
                <div className="bg-red-50/60 rounded-xl p-4 border border-red-100/50">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">Fraud Details</p>
                  <p className="text-sm text-red-800 leading-relaxed">{selected.details}</p>
                </div>
                <div><p className="text-xs font-bold text-slate-500 mb-2">Related Applications</p>
                  <div className="flex gap-2 flex-wrap">{selected.relatedApps.map((app) => (<span key={app} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-semibold text-slate-700">{app}</span>))}</div>
                </div>
                <div className="flex gap-3 pt-3">
                  <button className="flex-1 btn-danger justify-center py-2.5">Block Applications</button>
                  <button className="flex-1 btn-ghost justify-center py-2.5">Manual Review</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
