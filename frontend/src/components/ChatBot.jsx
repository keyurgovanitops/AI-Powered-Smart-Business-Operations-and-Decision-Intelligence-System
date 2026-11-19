import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../api/client';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! Main Apex Bank ka AI Business Assistant hoon. Database me se loan, deposits, defaults ya suspicious transactions ke baare me jo puchna hai pucho!',
      time: 'Just now',
      sources: ['Apex Central Banking Database']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickChips = [
    "Bank me total kitna customer deposit hai?",
    "Loan default rate kitna percent chal raha hai?",
    "Suspicious transactions konse channel pe jyada hain?",
    "High risk cases kitne log hue hain?"
  ];

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || loading) return;
    
    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(textToSend);
      const aiMsg = {
        sender: 'ai',
        text: res.data.answer,
        time: res.data.generated_at || 'Just now',
        sources: res.data.sources || ['Central DB']
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Maaf karna, server se baat nahi ho paayi. Backend running hai na check karo.',
          time: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat-container" className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col h-[600px] transition-all duration-300">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Charcha AI — Direct Grounded Q&A
            </h3>
            <p className="text-xs text-slate-400">
              Powered by Gemini 3.5 Flash + Exact Dataset Metrics
            </p>
          </div>
        </div>
        <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Ready For Sawaal
        </span>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800/60">
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
          Quick Suggestions:
        </span>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700/60 whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-600 text-white shadow'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/30 border border-blue-500/40 text-blue-100'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <div className="flex items-center justify-between gap-4 mt-2 pt-1.5 border-t border-white/5 text-[10px] text-slate-400">
                <span>{msg.time}</span>
                {msg.sources && (
                  <span className="text-cyan-400 font-medium">Source: {msg.sources[0]}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 max-w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI soch raha hai aur database verify kar raha hai...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Kuch bhi pucho: e.g. 'Home loan kitna banta gaya hai?'..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
