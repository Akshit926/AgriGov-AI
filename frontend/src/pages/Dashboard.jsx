import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, ShieldAlert, AlertTriangle,
  Clock, CheckCircle2, TrendingUp, Zap, ArrowUpRight,
  Activity, Sparkles, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import PageHeader from '../components/common/PageHeader';
import {
  dashboardStats, applicationTrends, recentAlerts,
  recentActivity, schemeDistribution,
} from '../data/mockData';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100">
        <p className="text-sm font-bold text-slate-800 mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs text-slate-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}: <span className="font-semibold text-slate-800">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      {/* Welcome Banner */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl p-6 mb-7 gradient-border"
      >
        <div className="relative z-10 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-8 right-32 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-green-200" />
                <span className="text-xs font-semibold text-green-200 uppercase tracking-wider">AI-Powered Dashboard</span>
              </div>
              <h2 className="text-2xl font-extrabold mb-1 tracking-tight">Good Evening, Admin Officer</h2>
              <p className="text-green-100 text-sm font-medium">
                {dashboardStats.resolvedToday} cases resolved today. {dashboardStats.fraudAlerts} fraud alerts need attention.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right mr-3">
                <p className="text-xs text-green-200 font-medium">Processing Speed</p>
                <p className="text-2xl font-extrabold">{dashboardStats.avgProcessingTime}</p>
              </div>
              <button className="btn-primary bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 shadow-none">
                <Zap className="w-4 h-4" />
                Run AI Scan
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatCard
          title="Total Applications"
          value={dashboardStats.totalApplications.toLocaleString()}
          subtitle="All time processed"
          icon={FileText}
          trend="up" trendValue="12.5%"
          color="primary" delay={0}
        />
        <StatCard
          title="Fraud Alerts"
          value={dashboardStats.fraudAlerts}
          subtitle="Requires immediate action"
          icon={ShieldAlert}
          trend="down" trendValue="8.2%"
          color="danger" delay={0.05}
        />
        <StatCard
          title="Missing Documents"
          value={dashboardStats.missingDocuments}
          subtitle="Pending farmer uploads"
          icon={AlertTriangle}
          trend="up" trendValue="3.1%"
          color="warning" delay={0.1}
        />
        <StatCard
          title="AI Accuracy"
          value={`${dashboardStats.aiAccuracy}%`}
          subtitle="Classification accuracy"
          icon={TrendingUp}
          trend="up" trendValue="1.2%"
          color="accent" delay={0.15}
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
        {[
          { icon: Clock, label: 'Avg. Processing Time', value: dashboardStats.avgProcessingTime, gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-100 to-purple-50' },
          { icon: CheckCircle2, label: 'Resolved Today', value: dashboardStats.resolvedToday, gradient: 'from-green-500 to-emerald-600', bg: 'from-green-100 to-emerald-50' },
          { icon: Activity, label: 'High Priority Cases', value: dashboardStats.highPriorityCases, gradient: 'from-orange-500 to-red-500', bg: 'from-orange-100 to-red-50' },
        ].map((item, i) => (
          <motion.div key={i} variants={fadeUp}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-slate-100/80 stat-card-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center`}>
              <item.icon className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
        {/* Application Trends */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100/80 stat-card-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center">
                <BarChart3 className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Application Trends</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Monthly applications overview</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Approved</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Total</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={applicationTrends}>
              <defs>
                <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="applications" name="Total" stroke="#0ea5e9" fill="url(#gradTotal)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="approved" name="Approved" stroke="#16a34a" fill="url(#gradApproved)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Scheme Distribution */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 border border-slate-100/80 stat-card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Scheme Distribution</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Applications by scheme</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={schemeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {schemeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-3">
            {schemeDistribution.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600 font-medium">{s.name}</span>
                </div>
                <span className="font-bold text-slate-800">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Alerts */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100/80 stat-card-shadow overflow-hidden">
          <div className="p-5 border-b border-slate-100/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-100 to-rose-50 flex items-center justify-center">
                <ShieldAlert className="w-4.5 h-4.5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">AI Alerts</h3>
                <p className="text-[11px] text-slate-400 font-medium">Real-time intelligent notifications</p>
              </div>
            </div>
            <button className="text-[11px] text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-primary-50 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50/80">
            {recentAlerts.slice(0, 5).map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-5 py-3.5 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={alert.severity} />
                      <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded">{alert.module}</span>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">{alert.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5 font-medium">{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-100/80 stat-card-shadow overflow-hidden">
          <div className="p-5 border-b border-slate-100/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                <p className="text-[11px] text-slate-400 font-medium">System and officer actions</p>
              </div>
            </div>
            <button className="text-[11px] text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-primary-50 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50/80">
            {recentActivity.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-5 py-3.5 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">{act.action}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge status={act.status} />
                      <span className="text-[10px] text-slate-400 font-medium">{act.user}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5 font-medium">{act.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
