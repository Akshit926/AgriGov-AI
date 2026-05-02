import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, AlertTriangle, Shield, TrendingDown, Scan } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import { fraudAlerts, fraudStats } from '../data/mockData';

export default function FraudDetection() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? fraudAlerts : fraudAlerts.filter(f => f.riskLevel === filter);

  const chartData = [
    { type: 'Duplicate', count: 12, color: '#ef4444' },
    { type: 'Land Overlap', count: 6, color: '#fdba74' },
    { type: 'Suspicious', count: 8, color: '#fcd34d' },
    { type: 'Repeated', count: 5, color: '#fde68a' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Fraud & Duplicate Detection" subtitle="AI anomaly detection for suspicious applications" icon={ShieldAlert}
        actions={<button className="btn-danger"><Shield className="w-4 h-4" /> Run Full Scan</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-9">
        <StatCard title="Total Scanned" value={fraudStats.totalScanned.toLocaleString()} icon={Scan} color="accent" />
        <StatCard title="Fraud Detected" value={fraudStats.fraudDetected} icon={ShieldAlert} color="danger" delay={0.05} />
        <StatCard title="High Risk" value={fraudStats.highRisk} icon={AlertTriangle} color="warning" delay={0.1} />
        <StatCard title="Amount Saved" value={fraudStats.savedAmount} icon={TrendingDown} color="primary" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-9">
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 stat-card p-7">
          <h3 className="text-sm font-bold text-gray-800 mb-1">Fraud Types</h3>
          <p className="text-[11px] text-gray-400 mb-5">Distribution by category</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={44}>{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detection Rate */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="stat-card p-7 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke="url(#dg)" strokeWidth="8" strokeLinecap="round"
                initial={{ strokeDasharray: '0 327' }} animate={{ strokeDasharray: `${fraudStats.detectionRate * 3.27} 327` }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }} />
              <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#0ea5e9" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-extrabold text-gray-900">{fraudStats.detectionRate}%</span></div>
          </div>
          <p className="text-sm font-bold text-gray-800">Detection Rate</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Isolation Forest ML</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 w-fit">
        {['all', 'critical', 'high', 'medium', 'low'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`pill capitalize ${filter === f ? 'active red' : ''}`}>{f}</button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-5">
        {filtered.map((alert, i) => (
          <motion.div key={alert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            className={`stat-card overflow-hidden cursor-pointer group border-l-[3px] ${
              alert.riskLevel === 'critical' ? 'border-l-red-500' : alert.riskLevel === 'high' ? 'border-l-orange-400' : alert.riskLevel === 'medium' ? 'border-l-amber-400' : 'border-l-gray-200'
            }`}
            onClick={() => setSelected(alert)}>
            <div className="flex items-stretch">
              <div className={`w-12 flex items-center justify-center flex-shrink-0 ${
                alert.riskLevel === 'critical' ? 'bg-red-50' : alert.riskLevel === 'high' ? 'bg-orange-50' : 'bg-gray-50'
              }`}>
                <ShieldAlert className={`w-4 h-4 ${alert.riskLevel === 'critical' ? 'text-red-400' : alert.riskLevel === 'high' ? 'text-orange-400' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 px-6 py-5">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[12px] font-mono font-bold text-gray-500">{alert.id}</span>
                  <StatusBadge status={alert.riskLevel} />
                  <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">{alert.fraudType}</span>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">{alert.details.slice(0, 150)}...</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500">App: <b className="text-gray-700">{alert.applicationId}</b></span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-[11px] text-gray-400">{alert.detectedAt}</span>
                </div>
              </div>
              <div className="w-20 flex flex-col items-center justify-center flex-shrink-0 border-l border-gray-100 py-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold ${
                  alert.fraudScore >= 0.8 ? 'bg-red-100 text-red-600' : alert.fraudScore >= 0.6 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>{Math.round(alert.fraudScore * 100)}</div>
                <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-wider">Risk</p>
              </div>
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
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><ShieldAlert className="w-5 h-5 text-red-600" /></div>
                  <div><h3 className="text-base font-bold text-gray-900">Fraud Report</h3><p className="text-xs text-gray-400">{selected.id}</p></div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Risk Level</p><StatusBadge status={selected.riskLevel} size="md" /></div>
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Score</p><span className="text-lg font-extrabold text-red-600">{Math.round(selected.fraudScore * 100)}/100</span></div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">Fraud Details</p>
                  <p className="text-sm text-red-800 leading-relaxed">{selected.details}</p>
                </div>
                <div><p className="text-xs font-bold text-gray-500 mb-2">Related Applications</p>
                  <div className="flex gap-2 flex-wrap">{selected.relatedApps.map(a => <span key={a} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono font-semibold text-gray-700">{a}</span>)}</div>
                </div>
                <div className="flex gap-3 pt-2"><button className="flex-1 btn-danger justify-center">Block Applications</button><button className="flex-1 btn-ghost justify-center">Manual Review</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
