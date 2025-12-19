
import React, { useState } from 'react';
import { X, FileText, Search, Activity, Cpu, HardDrive } from 'lucide-react';

interface LogbookProps {
  files: Record<string, string>;
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
  onFileSelect: (path: string) => void;
}

const Logbook: React.FC<LogbookProps> = ({ files, isOpen, onClose, activePath }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-8 backdrop-blur-3xl bg-black/90 animate-fade-in font-mono">
      <div className="relative w-full max-w-[1500px] h-full md:h-[90vh] bg-[#020807] border border-brass-500/20 shadow-2xl flex flex-col md:rounded-3xl overflow-hidden ring-1 ring-white/5">
        
        <div className="bg-emerald-950/40 border-b border-brass-500/10 px-8 py-4 flex justify-between items-center">
           <div className="flex items-center gap-8">
              <div className="flex gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
              </div>
              <div className="text-brass-500/60 text-[10px] font-bold tracking-[0.2em]">FILE_VIEWER: {activePath}</div>
           </div>
           <button onClick={onClose} className="text-brass-500/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-black/20 flex flex-col">
             <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar relative">
                {activePath && files[activePath] ? (
                  <div className="animate-fade-in max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-12 border-b border-brass-500/10 pb-12">
                      <div className="p-4 bg-brass-500/10 border border-brass-500/20 rounded-2xl text-brass-500"><FileText className="w-8 h-8" /></div>
                      <div>
                        <h1 className="text-3xl font-heading text-ivory-50 tracking-wide uppercase">{activePath.split('/').pop()}</h1>
                        <div className="text-[10px] text-ivory-100/40 tracking-[0.3em] font-bold uppercase mt-2">VIRTUAL_ACCESS: {activePath}</div>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none text-ivory-100/80 leading-relaxed font-serif text-lg whitespace-pre-wrap">
                      {files[activePath]}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10">
                    <HardDrive className="w-24 h-24 mb-6" />
                    <p className="text-xs tracking-[0.5em] uppercase font-bold">Mounting Document...</p>
                  </div>
                )}
             </div>
             <div className="bg-emerald-950/40 border-t border-brass-500/10 px-8 py-3 flex justify-between items-center text-[8px] font-bold tracking-[0.3em] text-brass-500/40 uppercase">
                <div className="flex gap-8">
                   <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-emerald-500" /> FS_CONNECTED</span>
                   <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> NEURAL_READ_V4</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logbook;
