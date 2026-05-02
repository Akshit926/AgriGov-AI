import { motion } from 'framer-motion';
import {
  FileText, ShieldAlert, AlertTriangle, TrendingUp,
  Clock, CheckCircle2, Activity, Zap, ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import {
  dashboardStats, applicationTrends, recentAlerts,
  recentActivity, schemeDistribution,
} from '../data/mockData';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100 text-xs">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map((e, i) => (
        <p key={i} className="text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          {e.name}: <b className="text-gray-800">{e.value.toLocaleString()}</b>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div>
      {/* ── Hero Banner ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden mb-9"
      >
        <div className="relative p-8 text-white" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)' }}>
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)', transform: 'translate(30%, -40%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)', transform: 'translate(-20%, 30%)' }} />

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">AI-Powered Dashboard</p>
              <h2 className="text-2xl font-extrabold tracking-tight">Good Evening, Admin Officer</h2>
              <p className="text-emerald-200/80 text-sm mt-2">
                {dashboardStats.resolvedToday} cases resolved today &bull; {dashboardStats.fraudAlerts} fraud alerts pending
              </p>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right hidden lg:block">
                <p className="text-emerald-300/80 text-[11px] font-semibold uppercase tracking-wider">Avg. Speed</p>
                <p className="text-2xl font-extrabold">{dashboardStats.avgProcessingTime}</p>
              </div>
              <button className="btn-primary bg-white/15 hover:bg-white/25 shadow-none border border-white/20 backdrop-blur-sm text-sm">
                <Zap className="w-4 h-4" /> Run AI Scan
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-9">
        <StatCard title="Total Applications" value={dashboardStats.totalApplications.toLocaleString()} subtitle="All time processed" icon={FileText} trend="up" trendValue="12.5%" color="primary" delay={0} />
        <StatCard title="Fraud Alerts" value={dashboardStats.fraudAlerts} subtitle="Requires attention" icon={ShieldAlert} trend="down" trendValue="8.2%" color="danger" delay={0.05} />
        <StatCard title="Missing Documents" value={dashboardStats.missingDocuments} subtitle="Pending uploads" icon={AlertTriangle} trend="up" trendValue="3.1%" color="warning" delay={0.1} />
        <StatCard title="AI Accuracy" value={`${dashboardStats.aiAccuracy}%`} subtitle="Classification accuracy" icon={TrendingUp} trend="up" trendValue="1.2%" color="accent" delay={0.15} />
      </div>

      {/* ── Secondary stats ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-9">
        {[
          { icon: Clock, label: 'Avg. Processing', value: dashboardStats.avgProcessingTime, color: 'bg-violet-100 text-violet-600' },
          { icon: CheckCircle2, label: 'Resolved Today', value: dashboardStats.resolvedToday, color: 'bg-emerald-100 text-emerald-600' },
          { icon: Activity, label: 'High Priority', value: dashboardStats.highPriorityCases, color: 'bg-amber-100 text-amber-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
            className="stat-card p-6 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-extrabold text-gray-900 mt-1">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-9">
        {/* Application Trends */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 stat-card p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Application Trends</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Monthly overview</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Approved</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Total</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={applicationTrends}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#059669" stopOpacity={0.15} /><stop offset="100%" stopColor="#059669" stopOpacity={0} /></linearGradient>
                <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.1} /><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="applications" name="Total" stroke="#0ea5e9" fill="url(#gT)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="approved" name="Approved" stroke="#059669" fill="url(#gA)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="stat-card p-7">
          <h3 className="text-sm font-bold text-gray-800 mb-1">Scheme Distribution</h3>
          <p className="text-[11px] text-gray-400 mb-4">By application count</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={schemeDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {schemeDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }} formatter={(v) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-3">
            {schemeDistribution.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded" style={{ background: s.color }} /><span className="text-gray-600">{s.name}</span></span>
                <span className="font-bold text-gray-800">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Alerts & Activity ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="stat-card overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-red-600" /></div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">AI Alerts</h3>
                <p className="text-[11px] text-gray-400">Real-time notifications</p>
              </div>
            </div>
            <button className="text-[11px] text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAlerts.slice(0, 4).map((a, i) => (
              <div key={a.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={a.severity} />
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">{a.module}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 leading-snug">{a.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="stat-card overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center"><Activity className="w-4 h-4 text-emerald-600" /></div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Recent Activity</h3>
                <p className="text-[11px] text-gray-400">System actions</p>
              </div>
            </div>
            <button className="text-[11px] text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((act, i) => (
              <div key={i} className="px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-600 leading-snug">{act.action}</p>
                    <div className="flex items-center gap-2 mt-1"><StatusBadge status={act.status} /><span className="text-[10px] text-gray-400">{act.user}</span></div>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
