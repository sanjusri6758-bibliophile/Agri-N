import React, { useState, useEffect, useRef } from 'react';
import {
  BotMessageSquare,
  Send,
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  Compass,
  Droplets,
  CloudLightning,
  Sprout,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIAssistantModule: React.FC = () => {
  const { user, language, showToast } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Namaste! I am **AgriN AI**, your localized agricultural intelligence advisor.\n\nI am synchronized with **Krishna Delta Eco-Farm** telemetry:\n• **Active Crop:** Basmati Paddy (Panicle Initiation)\n• **Soil Moisture:** 48% (Optimal)\n• **Current Alert:** ⚡ Thunderstorm & Squall Warning (85% Rain Risk)\n\nHow can I help you today? You can ask me about irrigation timing, bio-fertilizers, pest management, or government schemes in English, Telugu, Hindi, Tamil, or Kannada.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await api.askAI({
        message: text,
        userId: user?.id || 'user-farmer-01',
        language,
        farmContext: {
          farmName: 'Krishna Delta Eco-Farm',
          crop: 'Basmati Paddy (PB 1509)',
          stage: 'Panicle Initiation',
          soilMoisture: 48,
          weatherCondition: 'Thunderstorm Approaching (85% rain risk)'
        }
      });

      if (res.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: res.reply,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (e: any) {
      showToast('AI response error: ' + e.message, 'alert');
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Web Speech API is not supported in this browser. Please type your query.', 'alert');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap: Record<string, string> = {
        en: 'en-IN',
        te: 'te-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        kn: 'kn-IN'
      };
      recognition.lang = langMap[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak your agricultural query now', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const suggestedQuestions = [
    'Should I irrigate my paddy field today?',
    'Is it safe to spray bio-pesticides with current weather?',
    'How can I increase my Soil Organic Carbon (SOC)?',
    'What are the mandatory requirements for PM-KISAN 17th installment?'
  ];

  return (
    <div className="space-y-6 animate-in fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-5 text-white shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
            <BotMessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">AgriN AI Assistant</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Gemini 3.8 Flash
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Farm Grounded
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Autonomous agronomy advisor contextualized with IMD weather, Sentinel-2/ISRO NDVI, and soil chemistry
            </p>
          </div>
        </div>

        {/* Live Farm Snapshot Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
          <span className="flex items-center gap-1 text-emerald-300 font-semibold">
            <Droplets className="w-3.5 h-3.5" /> 48% Moisture
          </span>
          <span className="text-stone-400">•</span>
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <CloudLightning className="w-3.5 h-3.5" /> Storm 85%
          </span>
        </div>
      </div>

      {/* CHAT MESSAGES DISPLAY */}
      <div className="flex-1 bg-white rounded-3xl border border-stone-200 shadow-xs p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                m.role === 'user'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-stone-50 border border-stone-200 text-stone-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] opacity-70 mb-1">
                <span className="font-bold uppercase tracking-wider">
                  {m.role === 'user' ? 'You' : 'AgriN AI Advisor'}
                </span>
                <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="whitespace-pre-wrap font-sans">
                {m.content}
              </div>

              {m.role === 'assistant' && (
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="text-[10px]">Grounded on Krishna Delta Telemetry</span>
                  <button
                    onClick={() => handleCopy(m.content, idx)}
                    className="hover:text-stone-700 flex items-center gap-1"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>AgriN AI is synthesizing satellite, soil & weather context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTED PROMPTS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 text-xs whitespace-nowrap transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-stone-300 shadow-md shrink-0 focus-within:ring-2 focus-within:ring-emerald-600"
      >
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`p-2.5 rounded-xl transition-colors ${
            isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
          title="Voice query (Telugu / Hindi / Tamil / Kannada / English)"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Ask AgriN AI in English, Telugu, Hindi, Tamil, or Kannada..."
          className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-stone-900 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
