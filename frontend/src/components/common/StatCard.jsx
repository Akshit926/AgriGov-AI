import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: {
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-gradient-to-br from-green-100 to-emerald-50',
      iconColor: 'text-green-600',
      accent: 'border-l-green-500',
      glow: 'shadow-green-500/8',
    },
    accent: {
      gradient: 'from-sky-500 to-blue-600',
      iconBg: 'bg-gradient-to-br from-sky-100 to-blue-50',
      iconColor: 'text-sky-600',
      accent: 'border-l-sky-500',
      glow: 'shadow-sky-500/8',
    },
    danger: {
      gradient: 'from-red-500 to-rose-600',
      iconBg: 'bg-gradient-to-br from-red-100 to-rose-50',
      iconColor: 'text-red-600',
      accent: 'border-l-red-500',
      glow: 'shadow-red-500/8',
    },
    warning: {
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-gradient-to-br from-amber-100 to-orange-50',
      iconColor: 'text-amber-600',
      accent: 'border-l-amber-500',
      glow: 'shadow-amber-500/8',
    },
    purple: {
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-gradient-to-br from-violet-100 to-purple-50',
      iconColor: 'text-violet-600',
      accent: 'border-l-violet-500',
      glow: 'shadow-violet-500/8',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3 }}
      className={`bg-white rounded-2xl p-5 border border-slate-100/80 border-l-[3px] ${colors.accent} stat-card-shadow cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
          <p className="text-[28px] font-extrabold text-slate-900 leading-none tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1.5 mt-2.5 text-[11px] font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
              <span>{trendValue}</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
          className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
        </motion.div>
      </div>
    </motion.div>
  );
}
