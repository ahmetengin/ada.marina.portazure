
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Radio, CheckCircle, Cpu } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Type, FunctionDeclaration, Modality } from "@google/genai";
import { MarinaConfig, Language, LogEntry } from '../types';
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

// --- Tools for File System Access ---
const fsReadScript: FunctionDeclaration = {
  name: 'fs_read',
  parameters: {
    type: Type.OBJECT,
    description: '/docs/ altındaki bir dökümanı okur.',
    properties: { path: { type: Type.STRING, description: 'Dosya yolu (örn: /docs/manuals/goecek-rehberi.md)' } },
    required: ['path'],
  },
};

const fsWriteScript: FunctionDeclaration = {
  name: 'fs_write',
  parameters: {
    type: Type.OBJECT,
    description: '/docs/logs/ altına yeni bir kayıt yazar veya dökümanı günceller.',
    properties: { 
      path: { type: Type.STRING, description: 'Dosya yolu' },
      content: { type: Type.STRING, description: 'Yazılacak markdown içeriği' }
    },
    required: ['path', 'content'],
  },
};

interface VHFRadioProps {
  config: MarinaConfig;
  lang: Language;
  vesselPos: { lat: number, lng: number };
  onFileUpdate: (path: string, content: string) => void;
  readFile: (path: string) => string | null;
}

const VHFRadio: React.FC<VHFRadioProps> = ({ config, lang, vesselPos, onFileUpdate, readFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [powerOn, setPowerOn] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(true); 
  const [status, setStatus] = useState<'IDLE' | 'RX' | 'CONNECTING' | 'THINKING'>('IDLE');
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

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const source = inputAudioCtxRef.current.createMediaStreamSource(stream);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: getSystemInstruction(lang),
          tools: [{ functionDeclarations: [fsReadScript, fsWriteScript] }],
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
              setStatus('THINKING');
              for (const fc of msg.toolCall.functionCalls) {
                let result = "";
                if (fc.name === 'fs_read') {
                  const content = readFile(fc.args.path as string);
                  result = content || "Error: File not found in neural drive.";
                } else if (fc.name === 'fs_write') {
                  onFileUpdate(fc.args.path as string, fc.args.content as string);
                  setLogNotification(`FS_SYNC: ${fc.args.path}`);
                  setTimeout(() => setLogNotification(null), 3000);
                  result = "Success: Data synchronized to /docs drive.";
                }
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
              sourceNode.connect(ctx.destination);
              const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
              sourceNode.start(startAt);
              nextStartTimeRef.current = startAt + audioBuffer.duration;
              sourceNode.onended = () => { if (ctx.currentTime >= nextStartTimeRef.current - 0.1) setStatus('IDLE'); };
            }
          },
          onclose: () => disconnect(),
          onerror: () => disconnect()
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (e) { setIsOpen(false); }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-10 right-10 z-50 group flex items-center justify-center animate-float">
          <div className="bg-emerald-950 border-2 border-brass-400 text-brass-400 p-8 rounded-full shadow-2xl relative z-10">
            <Radio className="w-10 h-10" />
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed z-[100] inset-0 md:inset-auto md:bottom-12 md:right-12 w-full h-full md:w-[460px] md:h-[720px] flex flex-col animate-fade-in">
          <div className="flex-1 bg-gradient-to-br from-[#0a2a26] to-[#040a09] md:rounded-[4rem] p-0.5 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-brass-500/30">
            {logNotification && (
              <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <div className="bg-brass-500 text-emerald-950 px-6 py-2 rounded-full text-[9px] font-bold tracking-widest shadow-2xl flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> {logNotification}
                </div>
              </div>
            )}
            <div className="pt-16 px-16 flex justify-between items-start z-10 relative">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                     <Radio className="w-5 h-5 text-brass-400" />
                     <span className="font-heading text-[12px] text-brass-400 tracking-[0.4em] uppercase font-bold">ADA VHF CH 11</span>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="group p-3.5 rounded-2xl border-2 border-brass-500/30 bg-black/50 hover:border-red-500/50 transition-all">
                  <X className="w-6 h-6 text-brass-400" />
               </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
               <button onClick={() => setIsTransmitting(!isTransmitting)} className={`relative w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center gap-8 shadow-2xl transition-all ${isTransmitting ? 'bg-emerald-900/40 border-brass-400 text-brass-400' : 'bg-black/80 border-brass-900/20 text-ivory-100/5'}`}>
                  {isTransmitting ? <Mic className="w-16 h-16" /> : <MicOff className="w-16 h-16" />}
               </button>
            </div>
            <div className="pb-12 px-16 z-10 relative text-center">
               <div className="flex items-center justify-center gap-3 text-[8px] font-mono tracking-[0.3em] text-ivory-100/40 uppercase">
                  <Cpu className="w-3 h-3" /> {status} // DRIVE_MOUNTED: /DOCS
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VHFRadio;
