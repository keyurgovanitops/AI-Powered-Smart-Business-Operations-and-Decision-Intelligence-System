import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Lock, 
  Send, 
  Mic, 
  Wand2, 
  AlertCircle, 
  X,
  Smile
} from 'lucide-react';

export default function ToyFeaturesZone() {
  const [activeModal, setActiveModal] = useState(null);

  const toys = [
    {
      id: 'freeze',
      title: 'One-Click High Risk Account Freeze',
      hinglish: 'Dabang Freeze Button',
      desc: 'Suspicious accounts ke transactions ko 1-click me freeze karne ka experimental bot.',
      icon: Lock,
      color: 'from-purple-600/30 to-pink-600/10',
      border: 'border-purple-500/50',
      badge: 'TOY • KHILONA MODE',
      modalTitle: 'Arey Bhai Bhai! Yeh Abhi Khilona Hai 🧸',
      modalText: 'Chill boss! Yeh feature abhi experimental toy hai. Real customer ke account ko bina court ya RBI mandate ke freeze kar doge toh jail ho jayegi! Isiliye production me yeh disabled hai.'
    },
    {
      id: 'whatsapp',
      title: 'Automated WhatsApp Defaulter Robot',
      hinglish: 'Ghar Baithe Wasooli Bot',
      desc: 'Overdue loan walon ko WhatsApp par automated sweet aur strict voice notes bhejne ka prototype.',
      icon: Send,
      color: 'from-emerald-600/30 to-teal-600/10',
      border: 'border-emerald-500/50',
      badge: 'TOY • COMING SOON',
      modalTitle: 'WhatsApp Bot Abhi Under Construction Hai! 📢',
      modalText: 'Abhi WhatsApp Business API connect nahi ki gayi hai boss. Yeh feature filhal sirf design preview ke liye rakha gaya hai taaki evaluation me showcase ho sake.'
    },
    {
      id: 'voice',
      title: 'AI Phone Call With Branch Manager',
      hinglish: 'AI Voice Charcha',
      desc: 'Real-time conversational voice agent jo manager se bolkar banking report discuss kare.',
      icon: Mic,
      color: 'from-amber-600/30 to-yellow-600/10',
      border: 'border-amber-500/50',
      badge: 'TOY • EXPERIMENTAL',
      modalTitle: 'Awaaz Abhi Raste Me Hai! 🎙️',
      modalText: 'Gemini Live Audio API v2.0 ke sath integrate hone ke baad yeh live aayega. Abhi text based Charcha AI se kaam chalao!'
    },
    {
      id: 'magic_disburse',
      title: 'Instant Pre-Approved Loan Magic Wand',
      hinglish: 'Jaadu Ki Chhadi (Instant Loan)',
      desc: 'Good credit score walon ko bina document maange 10 second me loan pass karne ka toy tool.',
      icon: Wand2,
      color: 'from-cyan-600/30 to-blue-600/10',
      border: 'border-cyan-500/50',
      badge: 'TOY • NOT AVAILABLE',
      modalTitle: 'Bank Band Karwaoge Kya Boss? 😂',
      modalText: 'Bina Human-in-the-Loop approval ke automatic loan baant doge toh default rate 50% pahunch jayega! Isiliye Manager Desk me manual review compulsory rakha hai.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="glass-panel rounded-3xl p-6 border border-purple-500/30 shadow-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 animate-bounce">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Khilona Zone — Experimental Toy Features
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Ye features <b>sirf exploration aur fun ke liye</b> banaye gaye hain! Ye filhal live available nahi hain aur 
            system inko clearly <b>TOY</b> ki tarah tag karta hai taaki koi confusion na ho.
          </p>
        </div>
        <span className="text-[11px] font-black tracking-widest text-purple-300 bg-purple-500/20 border border-purple-400/40 px-3 py-1.5 rounded-full uppercase">
          4 Toys Loaded
        </span>
      </div>

      {/* Toy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toys.map((toy) => {
          const Icon = toy.icon;
          return (
            <div
              key={toy.id}
              className={`glass-card rounded-3xl p-6 border ${toy.border} bg-gradient-to-br ${toy.color} flex flex-col justify-between shadow-xl relative overflow-hidden`}
            >
              {/* Giant Toy Watermark */}
              <div className="absolute -right-4 -bottom-4 text-white/5 pointer-events-none select-none font-black text-7xl uppercase">
                TOY
              </div>

              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white shadow">
                      <Icon className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{toy.title}</h3>
                      <span className="text-xs font-semibold text-purple-300">
                        {toy.hinglish}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {toy.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                  {toy.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Status: <b>Not in Production</b>
                </span>
                <button
                  onClick={() => setActiveModal(toy)}
                  className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try Khilona Button</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fun Modal Popup when a toy is clicked */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Smile className="w-6 h-6 animate-wiggle" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">{activeModal.modalTitle}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                {activeModal.modalText}
              </p>
            </div>

            <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-xl text-[11px] text-purple-300">
              <b>Dhyan Rahe:</b> As per project requirements, all consequential actions strictly route through the <b>Manager Desk (Human-in-the-Loop)</b> tab.
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
            >
              Samajh Gaya Boss! (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
