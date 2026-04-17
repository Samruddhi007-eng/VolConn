import React from 'react';
import { ChevronRight } from 'lucide-react';

const StatsCard = ({ icon, count, label, color, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-[2rem] shadow-sm border-b-4 ${color} flex items-center justify-between group hover:shadow-xl transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div>
        <div className="text-3xl font-black text-volconn-navy">{count}</div>
        <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{label}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        {onClick && (
          <ChevronRight size={16} className="text-slate-300 group-hover:text-volconn-accent group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </div>
  );
};

export default StatsCard;
