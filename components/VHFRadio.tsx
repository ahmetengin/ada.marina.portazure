
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
  const [isTransmitting, setIsTransmitting] = useState(true); 
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

  useEffect(() => {
    transcriptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    if (isOpen && !powerOn) {
      connect();
    } else if (!isOpen && powerOn) {
      disconnect();
    }
  }, [isOpen]);

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
          systemInstruction: getSystemInstruction(lang) + " You are Ada. Immediately greet the Captain briefly.",
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
              setTranscript(prev => [...prev, {role: 'user' as const, text: msg.serverContent!.inputTranscription!.text!}].slice(-10));
            }
            if (msg.serverContent?.outputTranscription?.text) {
              setTranscript(prev => [...prev, {role: 'model' as const, text: msg.serverContent!.outputTranscription!.text!}].slice(-10));
            }
          },
          onclose: () => disconnect(),
          onerror: (e) => disconnect()
        }
      });
      sessionPromiseRef.current = sessionPromise;
      await sessionPromise;
    } catch (e) {
      setStatus('IDLE');
    }
  };

  const toggleMic = () => {
    setIsTransmitting(!isTransmitting);
    if (!isTransmitting) setStatus('TX');
    else setStatus('IDLE');
  };

  return (
    <>
      {/* Front Page Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 z-50 group flex items-center justify-center animate-float"
        >
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

      {/* VHF Master Console UI */}
      {isOpen && (
        <div className="fixed z-[100] inset-0 md:inset-auto md:bottom-12 md:right-12 w-full h-full md:w-[460px] md:h-[720px] flex flex-col animate-fade-in">
          
          {/* Main Panel with Radiant Navy Background */}
          <div className="flex-1 bg-gradient-to-br from-[#0f2a26] to-[#050c0a] md:rounded-[4rem] p-0.5 shadow-[0_50px_120px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden ring-1 ring-brass-500/20">
            
            {/* Elegant Polished Brass Dual-Line Border */}
            <div className="absolute inset-[10px] md:rounded-[3.5rem] border-2 border-brass-500/40 pointer-events-none z-50"></div>
            <div className="absolute inset-[18px] md:rounded-[3.2rem] border border-brass-500/10 pointer-events-none z-50"></div>

            {/* Background Transcript with increased visibility */}
            <div className="absolute inset-0 z-0 p-16 overflow-hidden pointer-events-none opacity-[0.12] select-none">
               <div className="flex flex-col gap-5 font-mono text-[10px] text-ivory-100 tracking-[0.2em] uppercase">
                  {transcript.map((item, i) => (
                    <div key={i} className="animate-fade-in leading-relaxed">
                      {item.role === 'user' ? 'STATION CALL > ' : 'ADA STEWARD < '} {item.text}
                    </div>
                  ))}
                  <div ref={transcriptRef} />
               </div>
            </div>

            {/* Console Header */}
            <div className="pt-16 px-16 flex justify-between items-start z-10 relative">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                     <Anchor className="w-5 h-5 text-brass-400" />
                     <span className="font-heading text-[12px] text-brass-400 tracking-[0.8em] uppercase font-bold">ADA STEWARD</span>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                     <div className={`w-3 h-3 rounded-full ${status === 'RX' ? 'bg-orange-500 shadow-[0_0_20px_#f97316] animate-pulse' : powerOn ? 'bg-emerald-400 shadow-[0_0_20px_#34d399]' : 'bg-red-900'} transition-all`}></div>
                     <span className="text-[10px] font-mono text-ivory-100/50 tracking-[0.4em] uppercase font-semibold">
                        {status === 'RX' ? 'RX: RECEIVING' : status === 'CONNECTING' ? 'SEARCHING...' : 'LIVE VHF CH 11'}
                     </span>
                  </div>
               </div>

               {/* Exit Button - Radiant Brass */}
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="group relative flex flex-col items-center gap-3 transition-all hover:scale-110"
               >
                  <div className="flex items-center justify-center p-3.5 rounded-2xl border-2 border-brass-500/30 bg-black/50 shadow-2xl group-hover:border-red-500/80 group-hover:bg-red-950/40 transition-all duration-300">
                    <X className="w-6 h-6 text-brass-400 group-hover:text-white" />
                  </div>
                  <span className="text-[8px] font-mono text-brass-400/40 tracking-[0.4em] uppercase group-hover:text-red-500 transition-colors font-bold">Exit Link</span>
               </button>
            </div>

            {/* Central Controls */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
               
               {/* Sound Ripple Aura */}
               <div 
                 className="absolute w-64 h-64 rounded-full border-2 border-brass-500/20 bg-brass-500/5 transition-transform duration-200"
                 style={{ transform: `scale(${1 + (volumeLevel / 100) * 1.8})` }}
               ></div>

               {/* PTT (Push To Talk) Large Button */}
               <button
                  onClick={toggleMic}
                  className={`relative w-64 h-64 rounded-full border-4 transition-all duration-700 flex flex-col items-center justify-center gap-8 shadow-[0_60px_100px_rgba(0,0,0,0.7)]
                    ${!powerOn ? 'bg-[#040a08] border-white/5 text-white/5' : 
                      isTransmitting ? 'bg-emerald-900/40 border-brass-400 text-brass-400 shadow-[0_0_80px_rgba(197,160,89,0.25)]' : 
                      'bg-black/60 border-brass-900/40 text-ivory-100/10 shadow-inner group'}
                  `}
               >
                  <div className={`transition-all duration-700 ${isTransmitting ? 'scale-125 opacity-100 text-brass-400' : 'scale-90 opacity-20'}`}>
                    {isTransmitting ? <Mic className="w-16 h-16" /> : <MicOff className="w-16 h-16" />}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className={`font-heading font-bold text-[12px] tracking-[0.8em] uppercase transition-colors duration-700 ${isTransmitting ? 'text-brass-400' : 'text-ivory-100/10'}`}>
                      {isTransmitting ? 'ON AIR' : 'MUTED'}
                    </span>
                    <div className="flex gap-3 mt-6">
                       {[...Array(3)].map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${status === 'RX' ? 'bg-orange-500 animate-bounce' : isTransmitting ? 'bg-brass-400 animate-pulse shadow-[0_0_10px_#c5a059]' : 'bg-white/5'}`} style={{animationDelay: `${i * 0.15}s`}}></div>
                       ))}
                    </div>
                  </div>

                  {/* Glass Reflection */}
                  <div className="absolute inset-4 rounded-full border-t border-white/20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
               </button>

               <div className="mt-20 flex items-center gap-12">
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-[10px] font-heading text-brass-500/40 tracking-[0.4em] uppercase">Bearing</span>
                     <div className="text-[12px] font-mono text-ivory-100/70 font-bold">{config.coordinates.lat}</div>
                  </div>
                  <div className="h-10 w-px bg-brass-500/20"></div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-[10px] font-heading text-brass-500/40 tracking-[0.4em] uppercase">Status</span>
                     <div className="text-[12px] font-mono text-ivory-100/70 font-bold">LEGACY ENCRYPTED</div>
                  </div>
               </div>
            </div>

            {/* Minimalist Footer Branding */}
            <div className="h-24 flex flex-col items-center justify-center relative mb-8">
               <div className="w-56 h-px bg-gradient-to-r from-transparent via-brass-500/60 to-transparent mb-6"></div>
               <span className="text-ivory-50/80 font-heading text-[14px] tracking-[1em] uppercase font-bold drop-shadow-md">The Commodore's Cove</span>
               <span className="text-brass-400/30 font-mono text-[9px] tracking-[0.5em] uppercase mt-3 font-bold">Heritage Marine AI Console</span>
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
