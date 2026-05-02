import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { schemePredictions, regionalTrends, seasonalTrends } from '../data/mockData';

const icons = { increasing: ArrowUpRight, decreasing: ArrowDownRight, stable: Minus };
const colors = { increasing: 'text-emerald-600', decreasing: 'text-red-500', stable: 'text-blue-500' };

export default function SchemePrediction() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Scheme Demand Prediction" subtitle="AI-powered forecasting for government scheme planning" icon={TrendingUp} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-9">
        {schemePredictions.map((s, i) => {
          const TrendIcon = icons[s.trend] || Minus;
          const tColor = colors[s.trend] || 'text-blue-500';
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className="stat-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-[14px] font-bold text-gray-800">{s.schemeName}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.region} &bull; {s.season}</p>
                </div>
                <StatusBadge status={s.trend} />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Demand Score</span>
                  <span className="text-sm font-extrabold text-gray-800">{s.demandScore}/100</span>
                </div>
                <div className="progress-track">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.demandScore}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`progress-fill ${s.demandScore >= 80 ? 'green' : s.demandScore >= 60 ? 'amber' : 'blue'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs mb-4">
                <span className={`flex items-center gap-1 font-bold ${tColor}`}><TrendIcon className="w-3.5 h-3.5" />{s.predictedDemand}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400">Confidence: <b className="text-gray-600">{s.confidence}%</b></span>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[12px] text-gray-600 leading-relaxed">{s.recommendation}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="stat-card p-7">
          <h3 className="text-sm font-bold text-gray-800 mb-1">Regional Distribution</h3>
          <p className="text-[11px] text-gray-400 mb-5">Applications by region</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionalTrends} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={130} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="pmkisan" name="PM-KISAN" fill="#059669" radius={[0, 6, 6, 0]} barSize={9} />
              <Bar dataKey="pmfby" name="PMFBY" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={9} />
              <Bar dataKey="kcc" name="KCC" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={9} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="stat-card p-7">
          <h3 className="text-sm font-bold text-gray-800 mb-1">Seasonal Trends</h3>
          <p className="text-[11px] text-gray-400 mb-5">Monthly volume</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={seasonalTrends}>
              <defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#059669" stopOpacity={0.2} /><stop offset="100%" stopColor="#059669" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="applications" stroke="#059669" fill="url(#gs)" strokeWidth={2.5}
                dot={{ r: 3, fill: '#059669', strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
