import React, { useState } from 'react';
import { ChevronRight, MapPin, Award, X } from 'lucide-react';

const OpportunityCard = ({ opportunity, onApply, showApply = true }) => {
  const [expanded, setExpanded] = useState(false);
  const opp = opportunity;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-volconn-gold transition-all group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-black text-volconn-accent uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
            {opp.ngoName}
          </span>
          <h4 className="text-xl md:text-2xl font-black text-volconn-navy mt-2 group-hover:text-volconn-accent transition-colors truncate">
            {opp.title}
          </h4>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className={`bg-volconn-gold/10 text-volconn-gold p-3 rounded-2xl transition-all flex-shrink-0 ml-4 ${
            expanded 
              ? 'bg-red-50 text-red-400 rotate-45' 
              : 'group-hover:bg-volconn-gold group-hover:text-white'
          }`}
        >
          {expanded ? <X size={20}/> : <ChevronRight size={20}/>}
        </button>
      </div>
      
      {/* Expandable Details */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gradient-to-br from-volconn-blue/30 to-blue-50 rounded-2xl p-5 space-y-3 border border-blue-100">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</span>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">{opp.description}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <p className={`text-sm font-bold mt-1 ${opp.status === 'open' ? 'text-green-600' : 'text-slate-400'}`}>
                {opp.status === 'open' ? '● Open' : '● Filled'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted</span>
              <p className="text-sm font-bold text-slate-600 mt-1">
                {new Date(opp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Skills</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {opp.requiredSkills.map(skill => (
                <span key={skill} className="bg-white text-volconn-accent px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!expanded && (
        <p className="text-slate-500 mb-6 leading-relaxed line-clamp-2">{opp.description}</p>
      )}
      
      <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4 md:pt-6 border-t border-slate-50">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
          <MapPin size={18} className="text-volconn-gold" /> Remote
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
          <Award size={18} className="text-volconn-gold" /> High Impact
        </div>

        {showApply && (
          <button 
            onClick={() => onApply && onApply(opp._id)}
            disabled={opp.status === 'filled'}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md ${
              opp.status === 'open' 
              ? 'bg-volconn-navy text-white hover:bg-volconn-accent' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {opp.status === 'open' ? 'Apply Now' : 'Position Filled'}
          </button>
        )}

        <div className="ml-auto flex flex-wrap gap-2">
          {opp.requiredSkills.map(skill => (
            <span key={skill} className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-md uppercase tracking-tighter">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
