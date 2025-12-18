import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Send, Radio, X, Volume2, VolumeX, Activity, Settings2, PhoneOff, PlayCircle, Signal } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { MarinaConfig, Language, Slip, Message } from '../types';
import { getSystemInstruction } from '../constants';

// --- SDK Required Audio Utils ---
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
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'idle' | 'rx' | 'tx' | 'connecting'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [input, setInput] = useState('');
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentTranscriptionRef = useRef({ user: '', model: '' });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    const initialMsg = lang === 'tr' 
      ? `Port Azure Kontrol. Kanal ${config.vhfChannel}. Dinlemedeyiz.`
      : `Port Azure Control. Channel ${config.vhfChannel}. Monitoring.`;
    setMessages([{ id: 'init', role: 'model', content: initialMsg, timestamp: new Date() }]);
  }, [lang]);

  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => s.close());
      sessionPromiseRef.current = null;
    }
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setConnected(false);
    setStatus('idle');
  }, []);

  const connect = async () => {
    if (connected || sessionPromiseRef.current) return;
    setStatus('connecting');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!inputAudioCtxRef.current) inputAudioCtxRef.current = new AudioContext({ sampleRate: 16000 });
      if (!outputAudioCtxRef.current) outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      
      await inputAudioCtxRef.current.resume();
      await outputAudioCtxRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: getSystemInstruction(lang),
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setConnected(true);
            setStatus('idle');
            
            const source = inputAudioCtxRef.current!.createMediaStreamSource(stream);
            const scriptNode = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptNode.onaudioprocess = (e) => {
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
            if (base64Audio && !isMuted) {
              setStatus('rx');
              const ctx = outputAudioCtxRef.current!;
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
              source.start(startAt);
              nextStartTimeRef.current = startAt + audioBuffer.duration;
              source.onended = () => {
                if (ctx.currentTime >= nextStartTimeRef.current - 0.1) setStatus('idle');
              };
            }

            if (msg.serverContent?.inputTranscription?.text) {
              currentTranscriptionRef.current.user += msg.serverContent.inputTranscription.text;
              updateMessage('user', currentTranscriptionRef.current.user);
            }
            if (msg.serverContent?.outputTranscription?.text) {
              currentTranscriptionRef.current.model += msg.serverContent.outputTranscription.text;
              updateMessage('model', currentTranscriptionRef.current.model);
            }
            if (msg.serverContent?.turnComplete) {
              currentTranscriptionRef.current = { user: '', model: '' };
              setStatus('idle');
            }
            if (msg.serverContent?.interrupted) {
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => disconnect(),
          onerror: (e) => { console.error(e); disconnect(); }
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  const updateMessage = (role: 'user' | 'model', content: string) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === role && (Date.now() - last.timestamp.getTime() < 8000)) {
        const updated = [...prev];
        updated[updated.length - 1] = { ...last, content, timestamp: new Date() };
        return updated;
      }
      return [...prev, { id: Math.random().toString(), role, content, timestamp: new Date() }];
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!connected) await connect();
    const txt = input;
    setInput('');
    setStatus('tx');
    updateMessage('user', txt);
    sessionPromiseRef.current?.then(s => s.send({ parts: [{ text: txt }] }));
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 group flex items-center justify-center scale-110 md:scale-100"
        >
          <div className="absolute inset-0 bg-gold-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
          <div className="bg-gradient-to-br from-navy-800 to-black border border-gold-500/50 text-white p-5 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2 relative z-10">
            <Radio className="w-6 h-6 text-gold-500" />
            <div className="hidden md:block text-left leading-none">
              <div className="text-[10px] text-gold-500/60 font-bold tracking-widest uppercase">VHF AI</div>
              <div className="text-sm font-serif">CH {config.vhfChannel.split(' ')[0]}</div>
            </div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed z-50 inset-0 md:inset-auto md:bottom-8 md:right-8 md:w-[450px] md:h-[650px] flex flex-col animate-float">
          <div className="flex-1 bg-gradient-to-b from-navy-800 to-navy-950 md:rounded-2xl border-[8px] border-navy-700 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="p-4 bg-navy-900/50 border-b border-white/5 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-navy-800 border border-white/10 shadow-inner relative flex items-center justify-center">
                  <div className="w-0.5 h-1.5 bg-gold-500 rounded-full"></div>
                </div>
                <h3 className="text-white font-serif tracking-[0.2em] text-lg uppercase">AZURE <span className="text-gold-500">CONCIERGE</span></h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="m-4 flex-1 bg-[#0a0f08] border-4 border-navy-800 rounded-sm shadow-inner relative overflow-hidden flex flex-col">
              <div className="p-3 border-b border-[#2d3a24] flex justify-between items-center font-mono text-[9px] text-[#8ea679] tracking-widest uppercase">
                <div className="flex items-center gap-2">
                  <Signal className={`w-3 h-3 ${connected ? 'text-amber-500' : 'text-slate-800'}`} />
                  <span>{connected ? 'Signal High' : 'Ready'}</span>
                </div>
                <div className="flex items-center gap-1">
                   <div className={`w-2 h-2 rounded-full ${status === 'rx' ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
                   <span>{status}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
                {messages.map((msg, i) => (
                  <div key={msg.id || i} className={`font-mono text-[11px] leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'self-end text-right' : 'self-start text-left'}`}>
                    <div className={`p-2 rounded-sm ${msg.role === 'user' ? 'bg-[#2d3a24] text-[#d4e6c4] border-r-2 border-amber-500' : 'text-[#8ea679]'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {(status === 'rx' || status === 'tx') && (
                <div className="h-4 bg-black/40 flex items-center justify-center gap-0.5 px-2">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className={`w-1 transition-all duration-100 ${status === 'rx' ? 'bg-[#d4e6c4]' : 'bg-amber-500'}`} 
                      style={{ height: `${10 + Math.random() * 90}%` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 pt-0 pb-8 grid grid-cols-4 gap-4">
              <button 
                onClick={connected ? disconnect : connect}
                className={`col-span-1 h-14 rounded-lg flex flex-col items-center justify-center border-2 transition-all shadow-lg active:scale-95 ${connected ? 'bg-red-950/20 border-red-500/40 text-red-500' : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-500'}`}
              >
                {connected ? <PhoneOff className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                <span className="text-[7px] font-bold mt-1 uppercase">{connected ? 'End' : 'Pwr'}</span>
              </button>

              <div className="col-span-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Radio message..."
                    className="flex-1 bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-[#d4e6c4] font-mono text-xs focus:outline-none focus:border-gold-500/40"
                  />
                  <button onClick={handleSend} className="bg-gold-500 text-navy-950 px-4 rounded-lg hover:bg-white transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VHFRadio;