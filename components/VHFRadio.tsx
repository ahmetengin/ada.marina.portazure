
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Radio, Activity, MessageSquareQuote, Zap, ShieldCheck, Database, Search, FileText, Loader2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Type, FunctionDeclaration, Modality } from "@google/genai";
import { MarinaConfig, Language } from '../types';
import { getSystemInstruction } from '../constants';

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
  return { 
    data: encode(new Uint8Array(int16.buffer)), 
    mimeType: 'audio/pcm;rate=16000' 
  };
}

const tools: FunctionDeclaration[] = [
  { 
    name: 'fs_read', 
    description: 'Ground the model response by reading a specific file from the RAG store.',
    parameters: { 
      type: Type.OBJECT, 
      properties: { path: { type: Type.STRING, description: 'The absolute path to the file.' } }, 
      required: ['path'] 
    } 
  },
  { 
    name: 'fs_write', 
    description: 'Write or update a file on the virtual file system.',
    parameters: { 
      type: Type.OBJECT, 
      properties: { 
        path: { type: Type.STRING, description: 'The absolute path to the file.' },
        content: { type: Type.STRING, description: 'The full content to write.' }
      }, 
      required: ['path', 'content'] 
    } 
  }
];

interface VHFRadioProps {
  config: MarinaConfig;
  lang: Language;
  sessionId: string;
  onFileUpdate: (path: string, content: string) => void;
  readFile: (path: string) => string | null;
  isActive: boolean;
  onToggle: () => void;
  availableFiles: string[];
}

const VHFRadio: React.FC<VHFRadioProps> = ({ config, lang, sessionId, onFileUpdate, readFile, isActive, onToggle, availableFiles }) => {
  const [isTransmitting, setIsTransmitting] = useState(true);
  const isTransmittingRef = useRef(isTransmitting);
  const [status, setStatus] = useState<'IDLE' | 'RX' | 'TX' | 'GROUNDING'>('IDLE');
  const [activeGroundingFile, setActiveGroundingFile] = useState<string | null>(null);
  const [liveInputText, setLiveInputText] = useState('');
  const [liveOutputText, setLiveOutputText] = useState('');
  const [citations, setCitations] = useState<string[]>([]);
  
  const sessionRef = useRef<any>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => { isTransmittingRef.current = isTransmitting; }, [isTransmitting]);

  const stopAllAudio = () => {
    activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const disconnect = () => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => { try { session.close(); } catch(e) {} });
    }
    sessionRef.current = null;
    stopAllAudio();
    setStatus('IDLE');
    setLiveInputText('');
    setLiveOutputText('');
    setActiveGroundingFile(null);
    setCitations([]);
  };

  const connect = async () => {
    try {
      if (!process.env.API_KEY) return;
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!inputCtxRef.current) inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
      if (!outputCtxRef.current) outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
      
      await inputCtxRef.current.resume();
      await outputCtxRef.current.resume();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: getSystemInstruction(lang, sessionId, availableFiles) + "\nALWAYS use 'fs_read' for specific details like pricing, menus, or procedures. Grounding is mandatory for factual accuracy.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          tools: [{ functionDeclarations: tools }],
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => setStatus('IDLE'),
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) setLiveInputText(msg.serverContent.inputTranscription.text);
            if (msg.serverContent?.outputTranscription) setLiveOutputText(prev => prev + msg.serverContent!.outputTranscription!.text);
            
            if (msg.serverContent?.interrupted) {
              stopAllAudio();
              setStatus('IDLE');
              setActiveGroundingFile(null);
            }

            if (msg.serverContent?.turnComplete) { 
              setLiveInputText(''); 
              setLiveOutputText(''); 
              setActiveGroundingFile(null);
            }

            if (msg.toolCall) {
              setStatus('GROUNDING');
              for (const fc of msg.toolCall.functionCalls) {
                let res = "File not found";
                if (fc.name === 'fs_read') {
                  const path = fc.args.path as string;
                  setActiveGroundingFile(path);
                  res = readFile(path) || "File not found";
                  if (res !== "File not found") {
                    setCitations(prev => Array.from(new Set([...prev, path])));
                  }
                }
                
                if (fc.name === 'fs_write') onFileUpdate(fc.args.path as string, fc.args.content as string);
                
                sessionPromise.then(s => s.sendToolResponse({ 
                  functionResponses: { id: fc.id, name: fc.name, response: { result: res } } 
                }));
              }
            }

            const base64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64) {
              setStatus('RX');
              const buf = await decodeAudioData(decode(base64), outputCtxRef.current!, 24000, 1);
              const node = outputCtxRef.current!.createBufferSource();
              node.buffer = buf;
              node.connect(outputCtxRef.current!.destination);
              
              nextStartTimeRef.current = Math.max(outputCtxRef.current!.currentTime, nextStartTimeRef.current);
              node.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buf.duration;
              
              activeSourcesRef.current.add(node);
              node.onended = () => { 
                activeSourcesRef.current.delete(node); 
                if (activeSourcesRef.current.size === 0) setStatus('IDLE'); 
              };
            }
          },
          onerror: (e) => { console.error('Live API Error:', e); setStatus('IDLE'); },
          onclose: () => disconnect()
        }
      });
      sessionRef.current = sessionPromise;

      const source = inputCtxRef.current!.createMediaStreamSource(stream);
      const script = inputCtxRef.current!.createScriptProcessor(4096, 1, 1);
      script.onaudioprocess = (e) => {
        if (isTransmittingRef.current && sessionRef.current) {
          const blob = createBlob(e.inputBuffer.getChannelData(0));
          sessionRef.current.then((s: any) => s.sendRealtimeInput({ media: blob }));
        }
      };
      source.connect(script);
      script.connect(inputCtxRef.current!.destination);
    } catch (e) { 
      console.error('Connection Failed:', e);
      onToggle(); 
    }
  };

  useEffect(() => { isActive ? connect() : disconnect(); }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-navy-950/80 animate-fade-in overflow-hidden">
       <div className="relative w-full max-w-2xl flex flex-col gap-6">
          <div className="bg-navy-900 border-2 border-azure-500/30 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/10">
             
             {/* Header */}
             <div className="p-8 flex justify-between items-center bg-navy-950/50 border-b border-azure-500/10">
                <div className="flex items-center gap-4">
                   <div className={`w-3 h-3 rounded-full ${status === 'RX' ? 'bg-cyan-400 animate-ping shadow-[0_0_15px_#22d3ee]' : status === 'GROUNDING' ? 'bg-sunlight-500 animate-pulse' : 'bg-azure-500'}`}></div>
                   <span className="text-[10px] font-mono font-black text-azure-400 tracking-widest uppercase">ADA LIVE RAG // VHF CH 11</span>
                </div>
                <button onClick={onToggle} className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
             </div>

             {/* RAG Grounding Indicator */}
             <div className={`px-12 py-3 bg-azure-950/40 border-b border-azure-500/10 flex items-center justify-between transition-all duration-500 ${status === 'GROUNDING' ? 'opacity-100 h-14' : 'opacity-0 h-0 overflow-hidden'}`}>
                <div className="flex items-center gap-3">
                   <Database className="w-4 h-4 text-sunlight-400 animate-float" />
                   <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">GROUNDING:</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono text-sunlight-500 font-bold uppercase truncate max-w-[200px]">{activeGroundingFile?.split('/').pop()}</span>
                   <Loader2 className="w-3 h-3 text-sunlight-400 animate-spin" />
                </div>
             </div>

             <div className="p-12 flex flex-col items-center gap-10">
                <button 
                  onClick={() => setIsTransmitting(!isTransmitting)} 
                  className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center gap-4 transition-all duration-500 relative group active:scale-95 ${isTransmitting ? 'bg-azure-600 border-azure-400 text-white shadow-[0_20px_50px_rgba(14,165,233,0.3)]' : 'bg-navy-950 border-azure-500/20 text-azure-400/30 hover:border-azure-400'}`}
                >
                   {isTransmitting ? <Mic className="w-12 h-12 animate-pulse" /> : <MicOff className="w-12 h-12" />}
                   <span className="text-[10px] font-black tracking-[0.2em] uppercase">{isTransmitting ? 'ADAYA SESLENİN' : 'SESİNİZ KAPALI'}</span>
                   <div className="absolute inset-0 rounded-full border-4 border-azure-400 opacity-0 group-hover:opacity-100 transition-opacity scale-105 pointer-events-none"></div>
                </button>
                
                <div className="w-full min-h-[180px] flex flex-col gap-6 px-10 py-10 bg-navy-950 border-2 border-azure-500/10 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-azure-500/20"></div>
                   {liveInputText ? (
                     <div className="animate-fade-in flex items-start gap-4">
                        <span className="text-[9px] font-black text-azure-400/50 uppercase mt-1">KAPTAN:</span>
                        <p className="text-white font-sans text-sm italic font-medium leading-relaxed">"{liveInputText}"</p>
                     </div>
                   ) : !liveOutputText && (
                     <div className="w-full text-center text-[10px] text-azure-400/20 tracking-[0.4em] uppercase animate-pulse font-bold mt-10">Sinyal bekleniyor...</div>
                   )}
                   {liveOutputText && (
                     <div className="animate-fade-in flex flex-col gap-4 border-t border-white/5 pt-6">
                        <div className="flex items-start gap-4">
                          <span className="text-[9px] font-black text-cyan-400 uppercase mt-1">ADA:</span>
                          <div className="text-white font-sans text-sm leading-relaxed font-bold">
                            <MessageSquareQuote className="w-4 h-4 inline mr-2 text-azure-400 opacity-40" />
                            {liveOutputText}
                            <span className="w-1.5 h-4 bg-azure-500 inline-block ml-1 animate-pulse"></span>
                          </div>
                        </div>

                        {/* Citation Chips */}
                        {citations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                             {citations.map((path, idx) => (
                               <div key={idx} className="flex items-center gap-2 bg-azure-900/40 border border-azure-500/20 px-3 py-1 rounded-full text-[8px] font-bold text-azure-400 uppercase tracking-widest animate-fade-in">
                                  <FileText className="w-2.5 h-2.5" /> {path.split('/').pop()}
                               </div>
                             ))}
                          </div>
                        )}
                     </div>
                   )}
                </div>
             </div>

             <div className="p-8 bg-azure-900 border-t border-white/10 flex justify-between items-center px-12 text-white">
                <div className="flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black opacity-60 uppercase">RAG Engine</span>
                      <span className="text-xs font-mono font-bold tracking-widest uppercase">SYNCED_V18</span>
                   </div>
                   <div className="w-px h-8 bg-white/10"></div>
                   <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-sunlight-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold tracking-widest uppercase">REALTIME</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <Activity className="w-4 h-4 text-cyan-400" />
                   <div className="flex gap-0.5 items-end h-5">
                      <div className="w-1 h-2 bg-white/20"></div>
                      <div className="w-1 h-3 bg-white/40"></div>
                      <div className="w-1 h-5 bg-white/60"></div>
                      <div className="w-1 h-6 bg-white"></div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default VHFRadio;
