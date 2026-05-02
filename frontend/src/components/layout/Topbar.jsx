import { Bell, Search, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-[72px] topbar-glass flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-200 ${
          searchFocused
            ? 'border-emerald-300 bg-white shadow-sm ring-2 ring-emerald-50'
            : 'border-gray-200 bg-gray-50/80'
        }`}>
          <Search className={`w-4 h-4 ${searchFocused ? 'text-emerald-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search applications, farmers..."
            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* AI Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[12px] font-semibold text-emerald-700">AI Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-[18px] h-[18px] text-gray-500" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">3</span>
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-gray-200 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold text-gray-800 leading-tight">Admin Officer</p>
            <p className="text-[11px] text-gray-400 leading-tight">Pune District</p>
          </div>
        </div>
      </div>
    </header>
  );
}
