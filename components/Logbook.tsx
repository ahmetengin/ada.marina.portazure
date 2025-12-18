
import React from 'react';
import { Book, Download, Trash2, X, Clock, Anchor, ShieldCheck, Map, Utensils, User, Ship } from 'lucide-react';
import { LogEntry } from '../types';

interface LogbookProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

const Logbook: React.FC<LogbookProps> = ({ logs, isOpen, onClose, onClear }) => {
  if (!isOpen) return null;

  const downloadLogbook = () => {
    const content = `# THE COMMODORE'S COVE - DIGITAL LOGBOOK\n\n` + 
      logs.map(log => `## [${log.timestamp}] ${log.type} - ${log.subject}\n**Author:** ${log.author}\n**Vessel:** ${log.vessel || 'N/A'}\n\n${log.text}\n`).join('\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logbook_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'NAVIGATION': return <Map className="w-4 h-4 text-blue-400" />;
      case 'BOOKING': return <Anchor className="w-4 h-4 text-brass-500" />;
      case 'CUSTOMS': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'CONCIERGE': return <Utensils className="w-4 h-4 text-orange-400" />;
      default: return <Clock className="w-4 h-4 text-ivory-100/40" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 backdrop-blur-3xl bg-black/80 animate-fade-in">
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0d2a26] border border-brass-500/30 shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col md:rounded-[3rem] overflow-hidden">
        
        <div className="p-8 md:p-12 border-b border-brass-500/10 flex justify-between items-center bg-emerald-950/50">
          <div>
            <div className="flex items-center gap-3 text-brass-500 mb-2">
              <Book className="w-6 h-6" />
              <h2 className="font-heading text-2xl md:text-3xl tracking-widest uppercase">CAPTAIN'S LOG</h2>
            </div>
            <p className="text-[10px] md:text-xs text-ivory-100/40 uppercase tracking-[0.3em] font-bold">The Commodore's Cove Digital Archive</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={downloadLogbook}
              className="p-3 md:px-6 md:py-3 bg-brass-500 text-emerald-950 rounded-sm flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase hover:bg-ivory-50 transition-all"
            >
              <Download className="w-4 h-4" /> <span className="hidden md:inline">Download .MD</span>
            </button>
            <button onClick={onClose} className="p-3 text-ivory-100/30 hover:text-white transition-colors border border-white/5">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
              <Book className="w-20 h-20 text-brass-500" />
              <p className="font-serif italic text-xl">The journal is currently empty. Ada is standing by to record your voyage.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {logs.map((log, i) => (
                <div key={i} className="group relative pl-8 border-l border-brass-500/20 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#0d2a26] border-2 border-brass-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-[10px] font-mono text-brass-500/60 font-bold">{log.timestamp}</span>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1 border border-white/5 rounded-full">
                        {getTypeIcon(log.type)}
                        <span className="text-[9px] font-bold tracking-widest text-ivory-100/80 uppercase">{log.type}</span>
                      </div>
                      <h3 className="text-ivory-50 font-heading text-lg tracking-wide uppercase">{log.subject}</h3>
                    </div>

                    <div className="flex gap-6 text-[10px] text-ivory-100/40 tracking-widest uppercase font-bold">
                       <span className="flex items-center gap-2"><User className="w-3 h-3 text-brass-500/40" /> BY: {log.author}</span>
                       {log.vessel && <span className="flex items-center gap-2"><Ship className="w-3 h-3 text-brass-500/40" /> VESSEL: {log.vessel}</span>}
                    </div>
                  </div>
                  
                  <p className="text-ivory-100/70 leading-relaxed font-serif italic text-sm md:text-base border-b border-white/5 pb-8">{log.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-brass-500/10 flex justify-between items-center bg-emerald-950/30">
          <div className="flex items-center gap-3 text-[9px] text-ivory-100/20 tracking-[0.3em] font-bold uppercase">
             <ShieldCheck className="w-4 h-4" /> SECURE ENCRYPTED STORAGE
          </div>
          {logs.length > 0 && (
            <button onClick={onClear} className="flex items-center gap-2 text-red-500/40 hover:text-red-500 transition-colors text-[10px] font-bold tracking-widest uppercase">
              <Trash2 className="w-4 h-4" /> Clear All Records
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logbook;
