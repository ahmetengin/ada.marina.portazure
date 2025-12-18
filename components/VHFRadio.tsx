
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Anchor, Radio, Activity, Signal, Power, Map, Calculator, Utensils, BookOpen, CheckCircle, BrainCircuit, Zap } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Type, FunctionDeclaration, Modality } from "@google/genai";
import { MarinaConfig, Language, Slip, LogEntry } from '../types';
import { getSystemInstruction } from '../constants';

// --- Audio Utils ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) { int16[i] = data[i] * 32768; }
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

// --- Scripts ---
const searchMarinaDocsScript: FunctionDeclaration = {
  name: 'search_marina_docs',
  parameters: {
    type: Type.OBJECT,
    description: 'Marina rehberi veya seyahat detaylarını arar.',
    properties: { query: { type: Type.STRING } },
    required: ['query'],
  },
};

const recordLogEntryScript: FunctionDeclaration = {
  name: 'record_log_entry',
  parameters: {
    type: Type.OBJECT,
    description: 'Kritik olayları gemi hafızasına kaydeder.',
    properties: {
      entryType: { type: Type.STRING, description: 'NAVIGATION, BOOKING, CUSTOMS, CONCIERGE' },
      author: { type: Type.STRING, description: 'Kaydı bildiren kaptanın adı.' },
      vessel: { type: Type.STRING, description: 'Tekne adı.' },
      subject: { type: Type.STRING, description: 'Kısa başlık/konu.' },
      content: { type: Type.STRING, description: 'Detaylı rapor metni.' },
    },
    required: ['entryType', 'author', 'subject', 'content'],
  },
};

const getPastLogsScript: FunctionDeclaration = {
  name: 'get_past_logs',
  parameters: {
    type: Type.OBJECT,
    description: 'Ada nın geçmişteki tüm görüşme ve olay kayıtlarını (hafızasını) okumasını sağlar.',
    properties: { vesselFilter: { type: Type.STRING } },
  },
};

interface VHFRadioProps {
  config: MarinaConfig;
  lang: Language;
  triggerBooking?: Slip | null;
  bookingState?: 'IDLE' | 'PRE_BOOKED' | 'PAYING' | 'CONFIRMED';
  pnr?: string;
  onLogEntry?: (entry: LogEntry) => void;
  getPastLogs?: () => LogEntry[];
}

const VHFRadio: React.FC<VHFRadioProps> = ({ config, lang, triggerBooking, bookingState, pnr, onLogEntry, getPastLogs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [powerOn, setPowerOn] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(true); 
  const [status, setStatus] = useState<'IDLE' | 'RX' | 'TX' | 'CONNECTING'>('IDLE');
  const [volumeLevel, setVolumeLevel] = useState(0); 
  const [memoryActive, setMemoryActive] = useState(false);
  const [logNotification, setLogNotification] = useState<string | null>(null);
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (isOpen && !powerOn) connect();
    else if (!isOpen && powerOn) disconnect();
  }, [isOpen]);

  const disconnect = useCallback(() => {
    if (processorRef.current) processorRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    sessionPromiseRef.current?.then(s => s.close());
    sessionPromiseRef.current = null;
    setPowerOn(false);
    setStatus('IDLE');
  }, []);

  const connect = async () => {
    if (powerOn || sessionPromiseRef.current) return;
    setStatus('CONNECTING');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!inputAudioCtxRef.current) inputAudioCtxRef.current = new AudioContext({ sampleRate: 16000 });
      if (!outputAudioCtxRef.current) outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      await inputAudioCtxRef.current.resume();
      await outputAudioCtxRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const source = inputAudioCtxRef.current.createMediaStreamSource(stream);
      const analyser = inputAudioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const outputAnalyser = outputAudioCtxRef.current.createAnalyser();
      outputAnalyser.fftSize = 256;
      outputAnalyser.connect(outputAudioCtxRef.current.destination);

      const updateVolume = () => {
        if (!isOpen) return;
        let average = 0;
        const dataArray = new Uint8Array(256);
        if (status === 'RX') { outputAnalyser.getByteFrequencyData(dataArray); average = dataArray.reduce((a, b) => a + b) / dataArray.length; }
        else if (isTransmitting) { analyser.getByteFrequencyData(dataArray); average = dataArray.reduce((a, b) => a + b) / dataArray.length; }
        setVolumeLevel(average);
        requestAnimationFrame(updateVolume);
      };
      updateVolume();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: getSystemInstruction(lang),
          tools: [{ functionDeclarations: [searchMarinaDocsScript, recordLogEntryScript, getPastLogsScript] }],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setPowerOn(true);
            setStatus('IDLE');
            const scriptNode = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            scriptNode.onaudioprocess = (e) => {
              const pcmBlob = createBlob(e.inputBuffer.getChannelData(0));
              sessionPromise.then(session => { if (isTransmitting) session.sendRealtimeInput({ media: pcmBlob }); });
            };
            source.connect(scriptNode);
            scriptNode.connect(inputAudioCtxRef.current!.destination);
            processorRef.current = scriptNode;
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                let result = "";
                if (fc.name === 'record_log_entry') {
                  const entry: LogEntry = {
                    timestamp: new Date().toLocaleTimeString(),
                    type: fc.args.entryType as any,
                    author: fc.args.author as string,
                    vessel: fc.args.vessel as string,
                    subject: fc.args.subject as string,
                    text: fc.args.content as string
                  };
                  if (onLogEntry) onLogEntry(entry);
                  setLogNotification(`LOGGED: ${fc.args.subject}`);
                  setTimeout(() => setLogNotification(null), 5000);
                  result = "Seyir defteri güncellendi. Roger.";
                } else if (fc.name === 'get_past_logs') {
                  setMemoryActive(true);
                  const logs = getPastLogs ? getPastLogs() : [];
                  result = logs.length > 0 ? `Hafıza verileri (JSON): ${JSON.stringify(logs)}` : "Hiç geçmiş kayıt yok.";
                  setTimeout(() => setMemoryActive(false), 3000);
                } else { result = "İşlem tamamlandı. Roger."; }
                sessionPromise.then(session => { session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: result } } }); });
              }
            }
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('RX');
              const ctx = outputAudioCtxRef.current!;
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const sourceNode = ctx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(outputAnalyser);
              const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
              sourceNode.start(startAt);
              nextStartTimeRef.current = startAt + audioBuffer.duration;
              sourceNode.onended = () => { if (ctx.currentTime >= nextStartTimeRef.current - 0.1) setStatus('IDLE'); };
            }
          },
          onclose: () => disconnect(),
          onerror: (e) => { disconnect(); }
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (e) { setIsOpen(false); }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-10 right-10 z-50 group flex items-center justify-center animate-float">
          <div className="absolute inset-0 bg-brass-500 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
          <div className="bg-emerald-900 border-2 border-brass-400 text-brass-400 p-8 rounded-full shadow-[0_15px_60px_rgba(197,160,89,0.4)] transition-all hover:scale-110 active:scale-95 relative z-10">
            <Radio className="w-10 h-10" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-brass-500 shadow-lg"></span>
            </span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed z-[100] inset-0 md:inset-auto md:bottom-12 md:right-12 w-full h-full md:w-[460px] md:h-[720px] flex flex-col animate-fade-in">
          <div className="flex-1 bg-gradient-to-br from-[#0f2a26] to-[#050c0a] md:rounded-[4rem] p-0.5 shadow-[0_50px_120px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden ring-1 ring-brass-500/20">
            
            {logNotification && (
              <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <div className="bg-brass-500 text-emerald-950 px-6 py-2 rounded-full text-[9px] font-bold tracking-widest shadow-2xl flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> {logNotification}
                </div>
              </div>
            )}

            <div className="absolute inset-[10px] md:rounded-[3.5rem] border-2 border-brass-500/40 pointer-events-none z-50"></div>
            
            <div className="pt-16 px-16 flex justify-between items-start z-10 relative">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                     <Anchor className="w-5 h-5 text-brass-400" />
                     <span className="font-heading text-[12px] text-brass-400 tracking-[0.4em] uppercase font-bold">ADA STEWARD</span>
                  </div>
                  <div className="flex items-center gap-4 mt-8 h-6">
                     <div className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${status === 'RX' ? 'bg-orange-500 shadow-[0_0_20px_#f97316] animate-pulse' : status === 'CONNECTING' ? 'bg-amber-400 animate-pulse' : powerOn ? 'bg-emerald-400 shadow-[0_0_20px_#34d399]' : 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]'}`}></div>
                     <span className="text-[10px] font-mono text-ivory-100/90 tracking-[0.3em] uppercase font-bold">
                        {status === 'RX' ? 'RX: RECEIVING' : status === 'CONNECTING' ? 'ESTABLISHING...' : 'VHF CH 11'}
                     </span>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="group p-3.5 rounded-2xl border-2 border-brass-500/30 bg-black/50 hover:border-red-500/50 transition-all">
                  <X className="w-6 h-6 text-brass-400" />
               </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
               {/* Memory Indicator */}
               {memoryActive && (
                  <div className="absolute -top-12 animate-pulse flex flex-col items-center gap-2">
                     <BrainCircuit className="w-8 h-8 text-emerald-400" />
                     <span className="text-[8px] font-mono text-emerald-400 tracking-[0.5em] uppercase font-bold">Accessing Memory...</span>
                  </div>
               )}
               
               <div className="absolute w-64 h-64 rounded-full border-2 border-brass-500/20 bg-brass-500/5 transition-transform duration-200" style={{ transform: `scale(${1 + (volumeLevel / 100) * 1.3})` }}></div>
               <button onClick={() => setIsTransmitting(!isTransmitting)} className={`relative w-64 h-64 rounded-full border-4 transition-all duration-700 flex flex-col items-center justify-center gap-8 shadow-[0_60px_100px_rgba(0,0,0,0.7)] ${!powerOn ? 'bg-[#040a08] border-white/5 text-white/5' : isTransmitting ? 'bg-emerald-900/40 border-brass-400 text-brass-400' : 'bg-black/60 border-brass-900/40 text-ivory-100/10 shadow-inner group'}`}>
                  <div className={`transition-all duration-700 ${isTransmitting ? 'scale-125 opacity-100 text-brass-500' : 'scale-90 opacity-20'}`}>
                    {isTransmitting ? <Mic className="w-16 h-16" /> : <MicOff className="w-16 h-16" />}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`font-heading font-bold text-[12px] tracking-[0.4em] uppercase transition-colors duration-700 ${isTransmitting ? 'text-brass-500' : 'text-ivory-100/10'}`}>
                      {isTransmitting ? 'ON AIR' : 'RADIO SILENCE'}
                    </span>
                    <div className="flex gap-4 mt-6">
                       <Zap className={`w-3.5 h-3.5 ${isTransmitting ? 'text-brass-500 animate-pulse' : 'text-white/5'}`} />
                       <Activity className={`w-3.5 h-3.5 ${status === 'RX' ? 'text-orange-500 animate-pulse' : 'text-white/5'}`} />
                    </div>
                  </div>
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VHFRadio;
