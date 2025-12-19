
import React, { useState, useMemo } from 'react';
// Added Activity and Cpu to the imports from lucide-react
import { Book, Download, Trash2, X, Clock, Anchor, ShieldCheck, Map, Utensils, User, Ship, FileText, Folder, ChevronRight, Search, FileCode, Calendar, Activity, Cpu } from 'lucide-react';
import { LogEntry } from '../types';

interface LogbookProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

const Logbook: React.FC<LogbookProps> = ({ logs, isOpen, onClose, onClear }) => {
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group logs by YYYY-MM
  const monthlyLogs = useMemo(() => {
    const groups: Record<string, LogEntry[]> = {};
    
    logs.forEach(log => {
      // Assuming timestamp is like "14:30:00" or similar, we need year-month.
      // Since our mock logs don't have full date, we'll use current Year-Month for display.
      // In a real app, LogEntry would have a proper Date.
      const now = new Date();
      const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(log);
    });

    return groups;
  }, [logs]);

  const monthKeys = Object.keys(monthlyLogs).sort().reverse();
  
  // Set initial selection
  useMemo(() => {
    if (!selectedMonthKey && monthKeys.length > 0) {
      setSelectedMonthKey(monthKeys[0]);
    }
  }, [monthKeys]);

  if (!isOpen) return null;

  const currentMonthLogs = selectedMonthKey ? monthlyLogs[selectedMonthKey] : [];
  const filteredLogs = currentMonthLogs.filter(log => 
    log.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadAllAsMarkdown = () => {
    let fullContent = `# THE COMMODORE'S COVE - COMPLETE DIGITAL ARCHIVE\n\n`;
    
    monthKeys.forEach(key => {
      fullContent += `\n# ARCHIVE: /docs/logs/${key}.md\n\n`;
      monthlyLogs[key].forEach(log => {
        fullContent += `## [${log.timestamp}] ${log.type} - ${log.subject}\n**Author:** ${log.author}\n**Vessel:** ${log.vessel || 'N/A'}\n\n${log.text}\n\n---\n`;
      });
    });
    
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `full_docs_logs_archive.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'NAVIGATION': return <Map className="w-3 h-3 text-blue-400" />;
      case 'BOOKING': return <Anchor className="w-3 h-3 text-brass-500" />;
      case 'CUSTOMS': return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
      case 'CONCIERGE': return <Utensils className="w-3 h-3 text-orange-400" />;
      default: return <FileText className="w-3 h-3 text-ivory-100/40" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-8 backdrop-blur-3xl bg-black/90 animate-fade-in font-mono">
      <div className="relative w-full max-w-[1400px] h-full md:h-[85vh] bg-[#020807] border border-brass-500/20 shadow-[0_80px_150px_rgba(0,0,0,1)] flex flex-col md:rounded-3xl overflow-hidden ring-1 ring-white/5">
        
        {/* IDE Header */}
        <div className="bg-emerald-950/40 border-b border-brass-500/10 px-8 py-4 flex justify-between items-center">
           <div className="flex items-center gap-6">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
              </div>
              <div className="flex items-center gap-3 text-brass-500">
                 <Folder className="w-4 h-4" />
                 <span className="text-[10px] tracking-[0.3em] font-bold uppercase opacity-60">/ docs / logs / monthly_archive</span>
              </div>
           </div>
           <button onClick={onClose} className="text-brass-500/40 hover:text-white transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Monthly File Sidebar */}
          <div className="w-80 border-r border-brass-500/10 flex flex-col bg-black/20">
             <div className="p-6 border-b border-brass-500/5">
                <div className="text-[8px] tracking-[0.3em] text-brass-500/40 mb-4 uppercase font-bold">Files in /docs/logs/</div>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brass-500/30" />
                   <input 
                      type="text" 
                      placeholder="SEARCH CONTENT..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-emerald-950/20 border border-brass-500/10 py-2.5 pl-10 pr-4 text-[9px] font-bold text-ivory-100 placeholder:text-brass-500/20 outline-none focus:border-brass-500/30 transition-all uppercase tracking-widest"
                   />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {monthKeys.map((key) => (
                   <button 
                      key={key}
                      onClick={() => setSelectedMonthKey(key)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all text-left group ${selectedMonthKey === key ? 'bg-brass-500/10 border border-brass-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                   >
                      <FileCode className={`w-4 h-4 transition-colors ${selectedMonthKey === key ? 'text-brass-500' : 'text-brass-500/30'}`} />
                      <div className="flex-1 overflow-hidden">
                         <div className={`text-[10px] font-bold tracking-widest uppercase ${selectedMonthKey === key ? 'text-ivory-100' : 'text-ivory-100/40'}`}>
                            {key}.md
                         </div>
                         <div className="text-[8px] text-ivory-100/20 mt-1 uppercase">{monthlyLogs[key].length} entries</div>
                      </div>
                      <ChevronRight className={`w-3 h-3 transition-all ${selectedMonthKey === key ? 'opacity-100 translate-x-0 text-brass-500' : 'opacity-0 -translate-x-2'}`} />
                   </button>
                ))}
                {monthKeys.length === 0 && (
                  <div className="p-8 text-center text-[9px] text-ivory-100/20 tracking-widest uppercase italic">
                     No archive files found
                  </div>
                )}
             </div>

             <div className="p-6 border-t border-brass-500/10 flex flex-col gap-3">
                <button 
                   onClick={downloadAllAsMarkdown}
                   className="w-full py-3 bg-brass-500 text-emerald-950 text-[9px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-ivory-50 transition-all"
                >
                   <Download className="w-3.5 h-3.5" /> DOWNLOAD ARCHIVE (.ZIP)
                </button>
                {logs.length > 0 && (
                   <button onClick={onClear} className="w-full py-3 border border-red-500/20 text-red-500/40 hover:bg-red-500/10 transition-all text-[9px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                      <Trash2 className="w-3.5 h-3.5" /> DELETE ALL LOGS
                   </button>
                )}
             </div>
          </div>

          {/* Monthly Document Viewer */}
          <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] flex flex-col">
             {selectedMonthKey ? (
                <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto animate-fade-in custom-scrollbar">
                   <div className="flex items-center gap-4 mb-8 border-b border-brass-500/10 pb-8">
                      <div className="p-4 bg-brass-500/10 border border-brass-500/20 rounded-2xl">
                         <Calendar className="w-8 h-8 text-brass-500" />
                      </div>
                      <div>
                         <h1 className="text-3xl font-heading text-ivory-50 tracking-wide uppercase">MONTHLY LOGBOOK: {selectedMonthKey}</h1>
                         <div className="flex items-center gap-6 mt-3 text-[10px] text-ivory-100/40 tracking-[0.3em] font-bold uppercase">
                            <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-brass-500" /> PATH: /docs/logs/{selectedMonthKey}.md</span>
                            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-brass-500" /> STATUS: OPEN_FOR_RECORDS</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 space-y-8 pb-20">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, i) => (
                           <div key={i} className="bg-emerald-950/20 border border-brass-500/10 p-8 rounded-2xl group hover:border-brass-500/30 transition-all relative">
                              <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                 {getTypeIcon(log.type)}
                              </div>
                              <div className="flex items-center gap-4 mb-6">
                                 <div className="w-2 h-2 rounded-full bg-brass-500 shadow-[0_0_10px_#c5a059]"></div>
                                 <div className="text-[10px] font-bold tracking-[0.2em] text-brass-500 uppercase">{log.type} / {log.timestamp}</div>
                              </div>
                              <h2 className="text-xl font-heading text-ivory-100 mb-4 uppercase tracking-wider">{log.subject}</h2>
                              <div className="text-ivory-100/60 leading-[1.8] italic font-serif text-lg whitespace-pre-wrap pl-6 border-l-2 border-brass-500/20">
                                 {log.text}
                              </div>
                              <div className="mt-6 flex items-center gap-4 text-[8px] text-ivory-100/20 font-bold uppercase tracking-widest">
                                 <span>AUTH: {log.author}</span>
                                 {log.vessel && <span>• VESSEL: {log.vessel}</span>}
                              </div>
                           </div>
                        ))
                      ) : (
                        <div className="py-20 text-center opacity-20 italic tracking-widest uppercase text-xs">
                          No matching entries found in this month's döküman
                        </div>
                      )}
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20 scale-125">
                   <Folder className="w-32 h-32 text-brass-500 mb-8 animate-pulse" />
                   <h2 className="font-heading text-2xl text-brass-500 tracking-[0.5em] uppercase">VIRTUAL FILE SYSTEM</h2>
                   <p className="mt-4 text-xs tracking-widest uppercase">SELECT A MONTHLY ARCHIVE TO VIEW NEURAL DATA</p>
                </div>
             )}
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="bg-emerald-950/40 border-t border-brass-500/10 px-8 py-3 flex justify-between items-center text-[8px] font-bold tracking-[0.3em] text-brass-500/40 uppercase">
           <div className="flex gap-8">
              <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> FS_SYNC: {monthKeys.length} FILES</span>
              <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> ARCHIVE_ENGINE: ACTIVE</span>
           </div>
           <div>NEURAL_LINK_DOC_PROTOCOL: V3.0</div>
        </div>
      </div>
    </div>
  );
};

export default Logbook;
