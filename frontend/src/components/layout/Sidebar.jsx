import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  MapPin,
  MessageSquareWarning,
  TrendingUp,
  Settings,
  HelpCircle,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/documents', label: 'Document Processing', icon: FileText, badge: null },
  { path: '/fraud', label: 'Fraud Detection', icon: ShieldAlert, badge: '28' },
  { path: '/field', label: 'Field Verification', icon: MapPin, badge: null },
  { path: '/grievances', label: 'Grievances', icon: MessageSquareWarning, badge: '5' },
  { path: '/schemes', label: 'Scheme Prediction', icon: TrendingUp, badge: null },
];

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help & Support', icon: HelpCircle },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 bottom-0 glass-sidebar z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-[68px] flex items-center px-5 border-b border-slate-100/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20"
          >
            <Leaf className="w-5 h-5 text-white" />
          </motion.div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-lg font-extrabold text-slate-900 whitespace-nowrap tracking-tight">
                Agri<span className="text-gradient">Gov</span> AI
              </h1>
              <p className="text-[10px] font-medium text-slate-400 -mt-0.5 tracking-wide">Smart Administration</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 mb-4">
            <Sparkles className="w-3 h-3 text-primary-500" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              AI Modules
            </p>
          </div>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium relative group
              ${isActive
                ? 'bg-gradient-to-r from-primary-50/80 to-accent-50/40 text-primary-700 font-semibold shadow-sm shadow-green-500/5'
                : 'text-slate-500 hover:text-slate-800'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full gradient-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100/80 text-primary-600'
                    : 'bg-slate-100/60 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
                }`}>
                  <item.icon className="w-[18px] h-[18px]" />
                </div>
                {!collapsed && (
                  <span className="whitespace-nowrap flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    item.path === '/fraud'
                      ? 'bg-red-500 text-white badge-glow-red'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="py-3 px-3 border-t border-slate-100/60 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium
              ${isActive
                ? 'bg-primary-50/60 text-primary-700 font-semibold'
                : 'text-slate-400 hover:text-slate-600'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-[16px] h-[16px]" />
            </div>
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
            {collapsed ? (
              <ChevronRight className="w-[16px] h-[16px]" />
            ) : (
              <ChevronLeft className="w-[16px] h-[16px]" />
            )}
          </div>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
