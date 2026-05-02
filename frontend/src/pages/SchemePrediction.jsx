import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from 'recharts';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { schemePredictions, regionalTrends, seasonalTrends } from '../data/mockData';

const trendIcon = { increasing: ArrowUpRight, decreasing: ArrowDownRight, stable: Minus };
const trendColor = { increasing: 'text-green-600', decreasing: 'text-red-500', stable: 'text-blue-500' };

export default function SchemePrediction() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Scheme Demand Prediction" subtitle="AI-powered forecasting for government scheme planning" icon={TrendingUp} />

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-7">
        {schemePredictions.map((scheme, idx) => {
          const TrendIcon = trendIcon[scheme.trend] || Minus;
          const color = trendColor[scheme.trend] || 'text-blue-500';
          return (
            <motion.div key={scheme.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl p-5 border border-slate-100/80 stat-card-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800">{scheme.schemeName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{scheme.region} &bull; {scheme.season}</p>
                </div>
                <StatusBadge status={scheme.trend} />
              </div>

              {/* Demand Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Predicted Demand</span>
                  <span className="text-sm font-extrabold text-slate-800">{scheme.demandScore}/100</span>
                </div>
                <div className="progress-bar">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${scheme.demandScore}%` }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                    className={`progress-bar-fill ${scheme.demandScore >= 80 ? 'green' : scheme.demandScore >= 60 ? 'amber' : 'blue'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs mb-4">
                <div className={`flex items-center gap-1 font-bold ${color}`}>
                  <TrendIcon className="w-3.5 h-3.5" />
                  {scheme.predictedDemand}
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-medium">Confidence: <span className="font-bold text-slate-600">{scheme.confidence}%</span></span>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-green-50/30 rounded-xl p-3 border border-slate-100/50">
                <p className="text-[12px] text-slate-600 leading-relaxed">{scheme.recommendation}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100/80 stat-card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Regional Distribution</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Applications by region and scheme</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionalTrends} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
              <Bar dataKey="pmkisan" name="PM-KISAN" fill="#16a34a" radius={[0, 6, 6, 0]} barSize={10} />
              <Bar dataKey="pmfby" name="PMFBY" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={10} />
              <Bar dataKey="kcc" name="KCC" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 border border-slate-100/80 stat-card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
              <LineChartIcon className="w-4.5 h-4.5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Seasonal Trends</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Monthly application volume</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={seasonalTrends}>
              <defs>
                <linearGradient id="gradSeasonal2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="applications" stroke="#16a34a" fill="url(#gradSeasonal2)" strokeWidth={2.5}
                dot={{ r: 3, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
