import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100/80 to-accent-50/60 flex items-center justify-center border border-primary-200/30 shadow-sm"
          >
            <Icon className="w-6 h-6 text-primary-600" />
          </motion.div>
        )}
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </motion.div>
  );
}
