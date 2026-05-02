import { Bell, Search, User, Sparkles, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="h-[68px] glass-topbar flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <motion.div
          animate={{ width: searchFocused ? '100%' : '85%' }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
            searchFocused
              ? 'border-primary-300 bg-white shadow-md shadow-green-500/5 ring-2 ring-primary-100'
              : 'border-slate-200/70 bg-white/60'
          }`}
        >
          <Search className={`w-4 h-4 transition-colors ${searchFocused ? 'text-primary-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search applications, farmers, cases..."
            className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!searchFocused && (
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
              Ctrl+K
            </kbd>
          )}
        </motion.div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* AI Status Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100/50"
        >
          <div className="relative">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary-500"
            />
          </div>
          <span className="text-xs font-semibold text-primary-700">AI Active</span>
          <div className="flex gap-0.5">
            <span className="w-1 h-3 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-3 rounded-full bg-primary-300 animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-3 rounded-full bg-primary-200 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors group"
          >
            <Bell className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center shadow-sm shadow-red-500/30"
            >
              3
            </motion.span>
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                  <span className="text-[11px] text-primary-600 font-medium cursor-pointer hover:text-primary-700">Mark all read</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[
                    { title: 'Duplicate Aadhaar detected', desc: 'APP-8842 flagged as critical', time: '5m ago', dot: 'bg-red-500' },
                    { title: 'Document batch processed', desc: '23 files verified by AI', time: '12m ago', dot: 'bg-green-500' },
                    { title: 'Urgent grievance received', desc: 'Nashik district crop damage', time: '18m ago', dot: 'bg-amber-500' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                      <div className="flex gap-3">
                        <span className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200/60 mx-1" />

        {/* User */}
        <button className="flex items-center gap-3 pl-1 pr-2 py-1.5 rounded-xl hover:bg-slate-50/80 transition-colors group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-green-500/20">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Admin Officer</p>
            <p className="text-[11px] text-slate-500 leading-tight">Pune District</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
