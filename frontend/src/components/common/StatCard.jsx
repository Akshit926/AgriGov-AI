import { motion } from 'framer-motion';

const palettes = {
  green:  { icon: 'bg-emerald-100 text-emerald-600', border: 'border-l-emerald-500' },
  red:    { icon: 'bg-red-100 text-red-600',         border: 'border-l-red-500' },
  amber:  { icon: 'bg-amber-100 text-amber-600',     border: 'border-l-amber-500' },
  blue:   { icon: 'bg-sky-100 text-sky-600',          border: 'border-l-sky-500' },
  purple: { icon: 'bg-violet-100 text-violet-600',    border: 'border-l-violet-500' },
};
const colorMap = { primary: 'green', danger: 'red', warning: 'amber', accent: 'blue', purple: 'purple' };

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary', delay = 0 }) {
  const p = palettes[colorMap[color] || 'green'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className={`stat-card p-7 border-l-[3px] ${p.border} cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-[30px] font-extrabold text-gray-900 leading-none mt-3 tracking-tight">{value}</p>
          {subtitle && <p className="text-[11px] text-gray-400 mt-2.5">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1.5 mt-3.5 text-[11px] font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${trend === 'up' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
              {trendValue} <span className="text-gray-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${p.icon} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
      </div>
    </motion.div>
  );
}
