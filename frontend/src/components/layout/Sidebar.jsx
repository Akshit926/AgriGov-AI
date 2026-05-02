import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, ShieldAlert, MapPin,
  MessageSquareWarning, TrendingUp, Settings, HelpCircle,
  Leaf, ChevronLeft, ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/fraud', label: 'Fraud Detection', icon: ShieldAlert, badge: 28 },
  { path: '/field', label: 'Field Verification', icon: MapPin },
  { path: '/grievances', label: 'Grievances', icon: MessageSquareWarning, badge: 5 },
  { path: '/schemes', label: 'Scheme Prediction', icon: TrendingUp },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 bottom-0 sidebar-dark z-40 flex flex-col overflow-hidden"
    >
      {/* ── Logo ─────────────────────────── */}
      <div className="h-[72px] flex items-center px-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <Leaf className="w-[18px] h-[18px] text-white" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h1 className="text-[15px] font-extrabold text-white whitespace-nowrap tracking-tight leading-tight">
                AgriGov <span className="text-emerald-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Smart Admin Platform</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Navigation ───────────────────── */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 mb-4">Menu</p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-3.5 py-3 text-[13px] font-medium relative
              ${isActive ? 'active' : ''}
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-emerald-400"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                {!collapsed && (
                  <span className="whitespace-nowrap flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center bg-red-500/90 text-white">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom ────────────────────────── */}
      <div className="py-4 px-3 border-t border-white/[0.06] space-y-1">
        {[
          { path: '/settings', label: 'Settings', icon: Settings },
          { path: '/help', label: 'Help & Support', icon: HelpCircle },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-medium
              ${isActive ? 'active' : ''}
              ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-[16px] h-[16px] flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-all"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
