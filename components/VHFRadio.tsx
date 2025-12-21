
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Radio, Terminal, Activity, MessageSquareQuote, Cpu, ShieldCheck } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Type, FunctionDeclaration, Modality } from "@google/genai";
import { MarinaConfig, Language, TranscriptItem } from '../types';
import { getSystemInstruction } from '../constants';

// Audio Utils
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
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

const tools: FunctionDeclaration[] = [
  { 
    name: 'fs_read', 
    parameters: { 
      type: Type.OBJECT, 
      description: 'Zorunlu: Dosya içeriğini okur.', 
      properties: { path: { type: Type.STRING } }, 
      required: ['path'] 
    } 
  },
  { 
    name: 'fs_write', 
    parameters: { 
      type: Type.OBJECT, 
      description: 'Rezervasyon veya log kaydı yapar.', 
      properties: { path: { type: Type.STRING }, content: { type: Type.STRING } }, 
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

const VHFRadio: React.FC<VHFRadioProps> = ({ lang, sessionId, onFileUpdate, readFile, isActive, onToggle, availableFiles }) => {
  const [powerOn, setPowerOn] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(true);
  const [status, setStatus] = useState<'IDLE' | 'RX' | 'TX' | 'SYNCING'>('IDLE');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [showArchive, setShowArchive] = useState(false);
  
  const [liveInputText, setLiveInputText] = useState('');
  const [liveOutputText, setLiveOutputText] = useState('');
  
  const inputBufferRef = useRef('');
  const outputBufferRef = useRef('');

  const sessionRef = useRef<any>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const disconnect = () => {
    if (sessionRef.current) { try { sessionRef.current.close(); } catch(e) {} }
    sessionRef.current = null;
    activeSourcesRef.current.forEach(s => s.stop());
    activeSourcesRef.current.clear();
    setPowerOn(false);
    setStatus('IDLE');
  };

  const connect = async () => {
    try {
      if (!process.env.API_KEY) return;
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!inputCtxRef.current) inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
      if (!outputCtxRef.current) outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
      
      if (inputCtxRef.current.state === 'suspended') await inputCtxRef.current.resume();
      if (outputCtxRef.current.state === 'suspended') await outputCtxRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: getSystemInstruction(lang, sessionId, availableFiles),
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          tools: [{ functionDeclarations: tools }],
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setPowerOn(true);
            setStatus('IDLE');
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Partial Transcriptions
            if (msg.serverContent?.inputTranscription) {
              inputBufferRef.current += msg.serverContent.inputTranscription.text;
              setLiveInputText(inputBufferRef.current);
            }
            if (msg.serverContent?.outputTranscription) {
              outputBufferRef.current += msg.serverContent.outputTranscription.text;
              setLiveOutputText(outputBufferRef.current);
            }

            // End of Turn
            if (msg.serverContent?.turnComplete) {
              if (inputBufferRef.current || outputBufferRef.current) {
                setTranscript(prev => [
                  ...prev,
                  ...(inputBufferRef.current ? [{ role: 'CAPTAIN', text: inputBufferRef.current, timestamp: new Date().toLocaleTimeString() }] as any : []),
                  ...(outputBufferRef.current ? [{ role: 'ADA', text: outputBufferRef.current, timestamp: new Date().toLocaleTimeString() }] as any : [])
                ]);
                inputBufferRef.current = '';
                outputBufferRef.current = '';
              }
            }

            // Tools
            if (msg.toolCall) {
              setStatus('SYNCING');
              for (const fc of msg.toolCall.functionCalls) {
                let res = "";
                if (fc.name === 'fs_read') res = readFile(fc.args.path as string) || "Hata: Dosya bulunamadı.";
                if (fc.name === 'fs_write') {
                  onFileUpdate(fc.args.path as string, fc.args.content as string);
                  res = "Başarılı: Kayıt işlendi.";
                }
                sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: res } } }));
              }
            }

            // Audio Output
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
          onerror: () => setStatus('IDLE'),
          onclose: () => disconnect()
        }
      });
      sessionRef.current = sessionPromise;

      const source = inputCtxRef.current!.createMediaStreamSource(stream);
      const script = inputCtxRef.current!.createScriptProcessor(4096, 1, 1);
      script.onaudioprocess = (e) => {
        if (isTransmitting && sessionRef.current) {
          const blob = createBlob(e.inputBuffer.getChannelData(0));
          sessionRef.current.then((s: any) => s.sendRealtimeInput({ media: blob }));
        }
      };
      source.connect(script);
      script.connect(inputCtxRef.current!.destination);
    } catch (e) { onToggle(); }
  };

  useEffect(() => {
    if (isActive && !powerOn) connect();
    if (!isActive && powerOn) disconnect();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-black/90 animate-fade-in overflow-hidden">
       <div className={`relative w-full h-full md:h-auto flex flex-col xl:flex-row gap-6 ${showArchive ? 'max-w-6xl' : 'max-w-xl'}`}>
          <div className="flex-1 bg-[#051412] md:border-2 border-brass-500/20 md:rounded-[3rem] flex flex-col overflow-hidden shadow-2xl relative">
             
             {/* Status Header */}
             <div className="p-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'RX' ? 'bg-blue-500' : status === 'SYNCING' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                   <span className="text-[8px] font-mono font-bold text-brass-500/60 tracking-widest uppercase">{status} // V13.5</span>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowArchive(!showArchive)} className={`p-3 rounded-xl transition-all ${showArchive ? 'bg-brass-500 text-emerald-950' : 'bg-white/5 text-ivory-100/20 hover:text-brass-500'}`}>
                      <Terminal className="w-5 h-5" />
                   </button>
                   <button onClick={onToggle} className="p-3 bg-white/5 rounded-xl text-ivory-100/20 hover:text-red-500"><X className="w-5 h-5" /></button>
                </div>
             </div>

             <div className="flex-1 p-10 flex flex-col items-center justify-center gap-10">
                <button 
                  onClick={() => setIsTransmitting(!isTransmitting)} 
                  className={`w-40 h-40 md:w-56 md:h-56 rounded-full border-2 flex flex-col items-center justify-center gap-4 transition-all duration-700 ${isTransmitting ? 'bg-emerald-900/40 border-brass-500 text-brass-500 brass-glow' : 'bg-black/60 border-white/10 text-ivory-100/10'}`}
                >
                   {isTransmitting ? <Mic className="w-10 h-10 md:w-14 md:h-14 animate-pulse" /> : <MicOff className="w-10 h-10 md:w-14 md:h-14" />}
                   <span className="text-[10px] font-bold tracking-[0.4em] uppercase">{isTransmitting ? 'TRANSMITTING' : 'STANDBY'}</span>
                </button>
                
                <div className="w-full max-w-lg min-h-[140px] flex flex-col items-start justify-center px-8 bg-black/40 border border-white/5 rounded-3xl py-6 overflow-hidden">
                   {liveInputText ? (
                     <div className="mb-4 animate-fade-in flex items-start gap-3 w-full">
                        <span className="text-[9px] font-bold text-brass-500 mt-1 uppercase">CAPT:</span>
                        <p className="text-brass-400 font-mono text-xs italic">"{liveInputText}"</p>
                     </div>
                   ) : !liveOutputText && (
                     <div className="w-full text-center text-[8px] text-ivory-100/10 tracking-widest uppercase animate-pulse">Awaiting Signal...</div>
                   )}
                   {liveOutputText && (
                     <div className="animate-fade-in flex items-start gap-3 w-full border-t border-white/5 pt-4">
                        <span className="text-[9px] font-bold text-emerald-500 mt-1 uppercase">ADA:</span>
                        <p className="text-emerald-400 font-mono text-xs leading-relaxed">
                          <MessageSquareQuote className="w-3 h-3 inline mr-2 opacity-50" />
                          {liveOutputText}
                          <span className="w-1.5 h-3 bg-emerald-500 inline-block ml-1 animate-pulse"></span>
                        </p>
                     </div>
                   )}
                </div>
             </div>

             <div className="p-8 bg-black/40 border-t border-white/5 flex justify-between items-center px-12">
                <div className="font-mono text-[8px] text-brass-500/30 tracking-widest uppercase">ENCRYPTED_VOYAGE_LINK // {sessionId}</div>
                <div className="flex items-center gap-2 text-emerald-500/40 text-[8px] font-bold tracking-widest uppercase"><Activity className="w-3 h-3" /> STABILITY: 100%</div>
             </div>
          </div>

          {showArchive && (
            <div className="w-full xl:w-[450px] bg-black/60 md:border-2 border-brass-500/10 md:rounded-[3rem] overflow-hidden flex flex-col animate-fade-in backdrop-blur-xl">
               <div className="p-6 border-b border-brass-500/10 bg-brass-500/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brass-500">Bridge Archive</span>
               </div>
               <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 font-mono text-[10px]">
                  {transcript.map((msg, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-2 ${msg.role === 'ADA' ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-brass-500/5 border-brass-500/40'}`}>
                       <div className="flex justify-between mb-2 opacity-40 text-[8px] font-bold uppercase">
                          <span className={msg.role === 'ADA' ? 'text-emerald-400' : 'text-brass-400'}>{msg.role}</span>
                          <span>{msg.timestamp}</span>
                       </div>
                       <div className="text-ivory-100/70 italic leading-relaxed">"{msg.text}"</div>
                    </div>
                  ))}
                  {transcript.length === 0 && <div className="h-full flex items-center justify-center opacity-10 text-[10px] uppercase tracking-widest py-20">Buffer Empty</div>}
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

export default VHFRadio;
