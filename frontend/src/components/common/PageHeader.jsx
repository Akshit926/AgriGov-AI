import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-9"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        )}
        <div>
          <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-[13px] text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.div>
  );
}
