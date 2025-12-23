
import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, HardDrive, Cpu, FileCode } from 'lucide-react';

interface FileSystemSidebarProps {
  files: Record<string, string>;
  onFileSelect: (path: string) => void;
  activePath: string;
}

const FileSystemSidebar: React.FC<FileSystemSidebarProps> = ({ files, onFileSelect, activePath }) => {
  const [expanded, setExpanded] = useState<string[]>(['docs', 'logs', 'manuals']);

  const toggle = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const fileTree = Object.keys(files).reduce((acc: any, path) => {
    const parts = path.split('/').filter(p => p);
    let current = acc;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current[part] = { isFile: true, path };
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    });
    return acc;
  }, {});

  const renderTree = (node: any, name: string) => {
    if (node.isFile) {
      return (
        <button 
          key={node.path}
          onClick={() => onFileSelect(node.path)}
          className={`w-full flex items-center gap-2 p-1.5 rounded transition-colors text-left ${activePath === node.path ? 'bg-azure-500/10 text-azure-400' : 'text-ivory-100/30 hover:bg-white/5'}`}
        >
          <FileCode className="w-3 h-3" /> {name}
        </button>
      );
    }

    const isExpanded = expanded.includes(name);
    return (
      <div key={name} className="mb-1">
        <button onClick={() => toggle(name)} className="flex items-center gap-2 text-azure-400/40 hover:text-azure-400 py-1 w-full text-left">
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <Folder className="w-3 h-3" /> <span className="uppercase tracking-widest">{name}</span>
        </button>
        {isExpanded && (
          <div className="ml-4 mt-1 border-l border-azure-400/10 pl-2">
            {Object.keys(node).map(key => renderTree(node[key], key))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 bg-navy-950/80 backdrop-blur-3xl border-r border-azure-500/10 flex flex-col h-full font-mono text-[10px] select-none ring-1 ring-white/5">
      <div className="p-6 border-b border-azure-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-azure-400 font-bold tracking-widest">
          <HardDrive className="w-4 h-4" /> NEURAL_DRIVE_A:
        </div>
        {/* Status indicator is now Azure Glow */}
        <div className="w-1.5 h-1.5 rounded-full bg-azure-400 animate-pulse shadow-[0_0_8px_#38bdf8]"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {Object.keys(fileTree).map(key => renderTree(fileTree[key], key))}
      </div>

      <div className="p-6 border-t border-azure-500/10 bg-navy-900/40">
        <div className="flex items-center gap-3 text-[8px] text-azure-400/40 tracking-[0.2em] font-bold">
          <Cpu className="w-3 h-3" /> AGENT_SYNC_ACTIVE
        </div>
      </div>
    </div>
  );
};

export default FileSystemSidebar;
