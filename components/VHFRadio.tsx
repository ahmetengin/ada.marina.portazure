
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Anchor, Radio, Activity, Signal, Power } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { MarinaConfig, Language, Slip } from '../types';
import { getSystemInstruction } from '../constants';

// --- Audio Encoding/Decoding Utils ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
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
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface VHFRadioProps {
  config: MarinaConfig;
  lang: Language;
  triggerBooking?: Slip | null;
}

const VHFRadio: React.FC<VHFRadioProps> = ({ config, lang, triggerBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [powerOn, setPowerOn] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(true); // Default to listening
  const [status, setStatus] = useState<'IDLE' | 'RX' | 'TX' | 'CONNECTING'>('IDLE');
  const [transcript, setTranscript] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0); 
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Handle Automatic Connection when Opened
  useEffect(() => {
    if (isOpen && !powerOn) {
      connect();
    } else if (!isOpen && powerOn) {
      disconnect();
    }
  }, [isOpen]);

  // Handle Booking Trigger
  useEffect(() => {
    if (triggerBooking) {
      setIsOpen(true);
    }
  }, [triggerBooking]);

  const disconnect = useCallback(() => {
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(t => t.stop());
    sessionPromiseRef.current?.then(s => s.close());
    sessionPromiseRef.current = null;
    setPowerOn(false);
    setStatus('IDLE');
    setVolumeLevel(0);
  }, []);

  const connect = async () => {
    if (powerOn || sessionPromiseRef.current) return;
    setStatus('CONNECTING');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      inputAudioCtxRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = inputAudioCtxRef.current.createMediaStreamSource(stream);
      const analyser = inputAudioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const outputAnalyser = outputAudioCtxRef.current.createAnalyser();
      outputAnalyser.fftSize = 256;
      outputAnalyserRef.current = outputAnalyser;
      outputAnalyser.connect(outputAudioCtxRef.current.destination);

      const updateVolume = () => {
        if (!isOpen) return;
        let average = 0;
        const dataArray = new Uint8Array(256);
        
        if (status === 'RX' && outputAnalyserRef.current) {
          outputAnalyserRef.current.getByteFrequencyData(dataArray);
          average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        } else if (isTransmitting && analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        }
        
        setVolumeLevel(average);
        requestAnimationFrame(updateVolume);
      };
      updateVolume();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: getSystemInstruction(lang) + " You are now live. IMMEDIATELY greet the Captain with a brief, high-class nautical greeting and offer your services. Do not wait for them to speak first. Keep the line open.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setPowerOn(true);
            setStatus('IDLE');
            
            const scriptNode = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            scriptNode.onaudioprocess = (e) => {
              if (!isTransmitting) return; 
              const pcmBlob = createBlob(e.inputBuffer.getChannelData(0));
              sessionPromise.then(session => { 
                session.sendRealtimeInput({ media: pcmBlob }); 
              });
            };
            source.connect(scriptNode);
            scriptNode.connect(inputAudioCtxRef.current!.destination);
            processorRef.current = scriptNode;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('RX');
              const ctx = outputAudioCtxRef.current!;
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const sourceNode = ctx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(outputAnalyserRef.current!);
              const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
              sourceNode.start(startAt);
              nextStartTimeRef.current = startAt + audioBuffer.duration;
              sourceNode.onended = () => { 
                if (ctx.currentTime >= nextStartTimeRef.current - 0.1) setStatus('IDLE'); 
              };
            }
            if (msg.serverContent?.inputTranscription?.text) {
              setTranscript(prev => [...prev, {role: 'user' as const, text: msg.serverContent!.inputTranscription!.text!}].slice(-8));
            }
            if (msg.serverContent?.outputTranscription?.text) {
              setTranscript(prev => [...prev, {role: 'model' as const, text: msg.serverContent!.outputTranscription!.text!}].slice(-8));
            }
          },
          onclose: () => disconnect(),
          onerror: (e) => { console.error(e); disconnect(); }
        }
      });
      sessionPromiseRef.current = sessionPromise;
      await sessionPromise;
    } catch (e) {
      console.error(e);
      setStatus('IDLE');
    }
  };

  const toggleMic = () => {
    setIsTransmitting(!isTransmitting);
    if (!isTransmitting) {
      setStatus('TX');
    } else {
      setStatus('IDLE');
    }
  };

  return (
    <>
      {/* Front Page Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50 group flex items-center justify-center animate-float"
        >
          <div className="absolute inset-0 bg-brass-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="bg-emerald-950 border-2 border-brass-500 text-brass-500 p-6 rounded-full shadow-[0_0_50px_rgba(197,160,89,0.3)] transition-all hover:scale-110 active:scale-95 relative z-10">
            <Radio className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brass-500"></span>
            </span>
          </div>
        </button>
      )}

      {/* VHF Master Console UI */}
      {isOpen && (
        <div className="fixed z-[100] inset-0 md:inset-auto md:bottom-8 md:right-8 w-full h-full md:w-[460px] md:h-[720px] flex flex-col animate-fade-in">
          
          {/* Hardware Frame */}
          <div className="flex-1 bg-emerald-950 md:rounded-[5.5rem] border-[22px] border-[#0a1814] shadow-[0_80px_160px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden ring-1 ring-brass-500/60">
            
            {/* Background Transcript */}
            <div className="absolute inset-0 z-0 p-16 overflow-hidden pointer-events-none opacity-[0.1] select-none">
               <div className="flex flex-col gap-6 font-mono text-[10px] text-brass-500 tracking-[0.2em] uppercase">
                  {transcript.map((item, i) => (
                    <div key={i} className={`animate-fade-in leading-relaxed ${item.role === 'user' ? 'text-white' : 'text-brass-300 font-bold underline decoration-brass-500/20'}`}>
                      {item.role === 'user' ? '>>>' : '<<<'} {item.text}
                    </div>
                  ))}
                  <div ref={transcriptRef} />
               </div>
            </div>

            {/* Console Header - Enhanced Close Button */}
            <div className="pt-16 px-16 flex justify-between items-start z-10 relative">
               <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                     <Anchor className="w-5 h-5 text-brass-500/50" />
                     <span className="font-heading text-[12px] text-brass-500 tracking-[0.6em] uppercase font-bold">Steward-X</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                     <div className={`w-3 h-3 rounded-full ${status === 'RX' ? 'bg-orange-500 shadow-[0_0_15px_#f97316] animate-pulse' : powerOn ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-red-900'} transition-all`}></div>
                     <span className="text-[11px] font-mono text-ivory-100/40 tracking-[0.3em] uppercase">
                        {status === 'RX' ? 'RECEIVING' : status === 'CONNECTING' ? 'SEARCHING...' : 'CHANNEL ACTIVE'}
                     </span>
                  </div>
               </div>

               {/* New Highly Visible EXIT Button */}
               <div className="flex flex-col items-center gap-2">
                 <button 
                   onClick={() => setIsOpen(false)} 
                   className="group relative flex items-center justify-center p-3 rounded-xl border-2 border-brass-600/30 bg-black/60 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:border-red-500 hover:bg-red-900/40"
                   aria-label="Close Radio"
                 >
                    {/* Glowing Ring on Hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-red-500/10 blur-md transition-opacity"></div>
                    <X className="w-6 h-6 text-brass-500 group-hover:text-white transition-colors" />
                 </button>
                 <span className="text-[8px] font-mono text-brass-500/40 tracking-[0.2em] uppercase group-hover:text-red-500 transition-colors">Exit Link</span>
               </div>
            </div>

            {/* Central Control Unit */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
               
               {/* Sound Aura */}
               <div 
                 className="absolute w-64 h-64 rounded-full bg-brass-500/5 border border-brass-500/10 transition-transform duration-100 ease-out"
                 style={{ transform: `scale(${1 + (volumeLevel / 100) * 1.8})` }}
               ></div>
               <div 
                 className="absolute w-64 h-64 rounded-full bg-brass-500/10 border-2 border-brass-500/10 transition-transform duration-300 ease-out"
                 style={{ transform: `scale(${1 + (volumeLevel / 100) * 0.9})` }}
               ></div>

               {/* Master Toggle Button */}
               <button
                  onClick={toggleMic}
                  className={`relative w-64 h-64 rounded-full border-[12px] transition-all duration-500 flex flex-col items-center justify-center gap-6 shadow-[0_60px_120px_rgba(0,0,0,1)] select-none
                    ${!powerOn ? 'bg-[#081210] border-[#040807] text-[#0d1f1a]' : 
                      isTransmitting ? 'bg-gradient-to-br from-[#1e4036] to-[#0a1a15] border-brass-500 text-brass-500 shadow-[0_0_60px_rgba(197,160,89,0.3)]' : 
                      'bg-[#0a1a15] border-emerald-900 text-emerald-800/40 shadow-inner group'}
                  `}
               >
                  <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] rounded-full pointer-events-none"></div>
                  
                  <div className={`transition-all duration-700 ${isTransmitting ? 'scale-110 text-brass-400' : 'scale-90 opacity-30'}`}>
                    {isTransmitting ? <Mic className="w-16 h-16" /> : <MicOff className="w-16 h-16" />}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className={`font-heading font-bold text-[12px] tracking-[0.6em] uppercase transition-colors duration-500 ${isTransmitting ? 'text-brass-500' : 'text-emerald-900'}`}>
                      {isTransmitting ? 'ON AIR' : 'MUTED'}
                    </span>
                    <div className="flex gap-2 mt-3">
                       {[...Array(3)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${status === 'RX' ? 'bg-orange-500 animate-bounce' : isTransmitting ? 'bg-brass-500 animate-pulse' : 'bg-emerald-950'}`} style={{animationDelay: `${i * 0.15}s`}}></div>
                       ))}
                    </div>
                  </div>

                  {/* Reflection Layer */}
                  <div className="absolute inset-4 rounded-full border border-white/5 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
               </button>

               {/* Dashboard Info */}
               <div className="mt-20 flex items-center gap-12">
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-[9px] font-heading text-brass-500/30 tracking-[0.4em] uppercase">Frequency</span>
                     <div className="text-[10px] font-mono text-ivory-100/60 font-bold">156.550 MHZ</div>
                  </div>
                  <div className="h-10 w-px bg-brass-500/10"></div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-[9px] font-heading text-brass-500/30 tracking-[0.4em] uppercase">Bearing</span>
                     <div className="text-[10px] font-mono text-ivory-100/60 font-bold">{config.coordinates.lat}</div>
                  </div>
               </div>
            </div>

            {/* Hardware Branding Bottom Plate */}
            <div className="h-28 bg-gradient-to-r from-brass-600 via-brass-400 to-brass-600 flex flex-col items-center justify-center shadow-[inset_0_8px_20px_rgba(0,0,0,0.6)] relative border-t-2 border-white/30">
               {/* Industrial Screws */}
               <div className="absolute top-5 left-6 w-3 h-3 rounded-full bg-black/60 shadow-inner flex items-center justify-center">
                 <div className="w-[1px] h-2 bg-white/10 rotate-45"></div>
               </div>
               <div className="absolute top-5 right-6 w-3 h-3 rounded-full bg-black/60 shadow-inner flex items-center justify-center">
                 <div className="w-[1px] h-2 bg-white/10 -rotate-45"></div>
               </div>
               <div className="absolute bottom-5 left-6 w-3 h-3 rounded-full bg-black/60 shadow-inner flex items-center justify-center">
                 <div className="w-[1px] h-2 bg-white/10 -rotate-45"></div>
               </div>
               <div className="absolute bottom-5 right-6 w-3 h-3 rounded-full bg-black/60 shadow-inner flex items-center justify-center">
                 <div className="w-[1px] h-2 bg-white/10 rotate-45"></div>
               </div>
               
               <span className="text-[#0a1a15] font-heading font-bold text-[16px] tracking-[0.8em] uppercase drop-shadow-xl">The Commodore's Cove</span>
               <div className="flex items-center gap-6 mt-3">
                  <div className="h-[2px] w-12 bg-black/30"></div>
                  <span className="text-[#0a1a15]/60 font-mono text-[9px] tracking-[0.4em] uppercase font-bold">Marine Concierge Heritage</span>
                  <div className="h-[2px] w-12 bg-black/30"></div>
               </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </>
  );
};

export default VHFRadio;
