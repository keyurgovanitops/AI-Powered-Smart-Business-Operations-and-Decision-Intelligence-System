import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, Loader2, Database, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function ChatView() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Good day. I am EVA, your executive banking intelligence assistant. You can query any core portfolio metric, credit default trends, liquidity reserves, or AML surveillance flags directly from the verified database.',
      time: 'Ready',
      sources: ['Core Banking Database (May-Oct 2026)']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const executivePrompts = [
    "What is the aggregate customer deposit balance and active account ratio?",
    "Summarize portfolio default rate and at-risk overdue loan capital.",
    "Which digital payment channels demonstrate the highest AML anomaly frequency?",
    "What credit score adjustments are recommended by the Strategy Agent?"
  ];

  const handleSend = async (queryText = input) => {
    if (!queryText.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/analytics/chat', { question: queryText });
      const aiMsg = {
        sender: 'ai',
        text: res.data.answer,
        time: res.data.generated_at || 'Just now',
        sources: res.data.sources || ['Core Banking Database (SQL Ledgers)']
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to communicate with intelligence service. Please ensure the backend server is reachable.',
          time: 'Error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-base p-6 flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Executive Decision Intelligence Assistant
          </h2>
          <p className="text-xs text-slate-500">
            Powered by Gemini 3.5 Flash grounded strictly on verified SQL banking tables
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Hallucination Constraint</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Quick Inquiries:
        </span>
        {executivePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[78%] rounded-xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <div
                className={`flex items-center justify-between gap-4 mt-2.5 pt-2 border-t text-[10px] ${
                  msg.sender === 'user' ? 'border-blue-500 text-blue-200' : 'border-slate-200 text-slate-500'
                }`}
              >
                <span>{msg.time}</span>
                {msg.sources && (
                  <span className="font-semibold flex items-center gap-1">
                    <Database className="w-3 h-3" /> {msg.sources[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100 max-w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing relational ledgers and formulating grounded intelligence...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask any question regarding deposits, delinquency, loans, or transactions..."
          className="flex-1 text-xs border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-all shadow-xs disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
