import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  RotateCcw,
  Zap,
  Volume2
} from 'lucide-react';

export default function TourGuide({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'step-banner',
      tab: 'dashboard',
      targetId: 'header-pin',
      mood: 'welcome',
      face: '🤩',
      title: 'Arre Namaste Boss! Main Hoon Bunty 🤖',
      hinglish: 'Bank Ka Smart Dost & Guide',
      speech: 'Aap naye aaye ho na? Main aapko poore website ka 2-minute live tour dunga taaki aapko pata ho ki kaunsi cheez kahan hai aur use kaise use karna hai! Sabse pehle upar dekho — yeh amber banner clearly bata raha hai ki yeh academic prototype hai, real RBI production nahi.',
      actionHint: 'Agle feature pe chalne ke liye "Aage Chalo 👉" dabao.'
    },
    {
      id: 'step-deposits',
      tab: 'dashboard',
      targetId: 'kpi-deposits',
      mood: 'money',
      face: '🤑',
      title: 'Feature 1: "Apne Bank Ka Paisa" (Total Deposits)',
      hinglish: 'Customer Ka Jama Paisa',
      speech: 'Yeh pehla card dekho! Yahan bank me total jama balance dikh raha hai — Rs. 200.74 Crore across 1,600 active khate. Iska matlab bank ke paas solid cash liquidity hai!',
      actionHint: 'Yeh real May-Oct 2026 banking transactions se calculate hua hai.'
    },
    {
      id: 'step-loans',
      tab: 'dashboard',
      targetId: 'kpi-loans',
      mood: 'loans',
      face: '📈',
      title: 'Feature 2: "Banta Hua Karza" (Loan Portfolio)',
      hinglish: 'Market Me Gaya Paisa',
      speech: 'Yeh doosra card: Rs. 142.15 Crore karza market me baanta gaya hai. Isme Home loans, Personal loans, Car loans aur Business loans sab shamil hain.',
      actionHint: 'Approved loan files ka real-time aggregate count yahan live rehta hai.'
    },
    {
      id: 'step-defaults',
      tab: 'dashboard',
      targetId: 'kpi-defaults',
      mood: 'shocked',
      face: '😱',
      title: 'Feature 3: "Loan Ka Lafda" (21.12% Default Alert)',
      hinglish: 'Khatre Ki Ghanti! 🚨',
      speech: 'Arre baap re baap! Yeh laal card dhyan se dekho — 21.12% Default Rate! Matlab lagbhag Rs. 42 Crore at-risk capital hai jahan customers 30 din se zyada late hain. Iska turant ilaaj chahiye varna bank doob jayega!',
      actionHint: 'Strategy Agent is lafda ko solve karne ke liye policy change suggest karega.'
    },
    {
      id: 'step-flagged',
      tab: 'dashboard',
      targetId: 'kpi-flagged',
      mood: 'sherlock',
      face: '🕵️',
      title: 'Feature 4: "Kuch To Gadbad Hai" (Fraud Alerts)',
      hinglish: '122 Suspicious Activity Alerts',
      speech: 'Yeh chautha card dekho: 122 Flagged Transactions! UPI aur NetBanking me kuch log high-value transfers karke shana banne ki koshish kar rahe hain. Hamara AML rule engine inko pakadta hai.',
      actionHint: 'Channel breakdown me dekho ki konse app pe sabse zyada fraud ho raha hai.'
    },
    {
      id: 'step-charts',
      tab: 'dashboard',
      targetId: 'charts-gallery',
      mood: 'analytics',
      face: '📊',
      title: 'Feature 5: "Graph Gallery" (Bina Sar Ghoome Dekho)',
      hinglish: 'Clean Visual Charts (No Overload)',
      speech: 'Thoda neeche scroll karo — yahan Graph Gallery hai! Yahan ek saath 50 charts fenk ke sar dard nahi diya jata. Upar bane pills par click karke ek-ek graph dekho: Monthly Paisa Flow, Karz Portfolio, aur Channel Lafde.',
      actionHint: 'Tabs toggle karke dekho, Recharts se smooth curves render hote hain.'
    },
    {
      id: 'step-agents',
      tab: 'agents',
      targetId: 'agent-trigger-btn',
      mood: 'boardroom',
      face: '🤖',
      title: 'Feature 6: "AI Baithak" (6 Autonomous Agents)',
      hinglish: 'CrewAI Multi-Agent Boardroom',
      speech: 'Ab hum aa gaye sabse bade hero pe! Yahan 6 specialized AI agents hain: Data Analyst, Marketing, Finance, Operations, Strategy, aur Verification Agent. "Saare Agents Ko Trigger Karo" button dabate hi Gemini 3.5 Flash live inki meeting shuru kar deta hai!',
      actionHint: 'Verification Agent calculations audit karta hai taaki jhoothe stats na aayein.'
    },
    {
      id: 'step-approval',
      tab: 'approval',
      targetId: 'approval-container',
      mood: 'judge',
      face: '⚖️',
      title: 'Feature 7: "Manager Desk" (Human-in-the-Loop)',
      hinglish: 'Aapka Final Faisla!',
      speech: 'Yeh project ka sabse zaroori compliance requirement hai! AI kitna bhi shana ho, consequential decisions bina aapki permission ke pass nahi ho sakte. Strategy Agent ki recommendation par aapko yahan "Pakka Karo" (Approve) ya "Nahi Jam Raha" (Reject) click karna padta hai.',
      actionHint: 'Manager Sahab ka note database audit table me timestamp ke sath store hota hai.'
    },
    {
      id: 'step-chat',
      tab: 'chat',
      targetId: 'chat-container',
      mood: 'chat',
      face: '💬',
      title: 'Feature 8: "Charcha AI" (Kuch Bhi Seedha Pucho)',
      hinglish: 'Direct Conversational Chatbot',
      speech: 'Agar aapko kisi bhi number, balance, ya branch ke baare me doubt ho, toh yahan seedha Hinglish me sawal pucho. Gemini 3.5 Flash backend real database check karke turant sachha jawab dega!',
      actionHint: 'Quick suggestions click karo jaise "Default rate kitna percent hai?".'
    },
    {
      id: 'step-reports',
      tab: 'reports',
      targetId: 'reports-container',
      mood: 'pdf',
      face: '📄',
      title: 'Feature 9: "Pakka Report" (1-Click PDF Download)',
      hinglish: 'ReportLab Executive PDF Export',
      speech: 'Meeting aur calculations ke baad, 1-click me formal audit PDF report download karlo! Isme tables, KPI comparison, aur verified seal included hoti hai jo evaluator ko direct dikha sakte ho.',
      actionHint: '"Download PDF Report" button dabaoge toh browser me direct file save hogi.'
    },
    {
      id: 'step-toys',
      tab: 'toys',
      targetId: 'toys-container',
      mood: 'party',
      face: '🥳',
      title: 'Feature 10: "Khilona Zone" (Experimental Toys 🧸)',
      hinglish: 'Fun & Playful Concepts',
      speech: 'Aapne bola tha na ki kuch features toys hone chahiye? Yahan humne Freeze Bot, WhatsApp Wasooli Bot jaise 4 fun toys rakhe hain! Inke upar clearly "TOY • KHILONA MODE" ka badge laga hai taaki evaluator ko samajh aaye ki yeh production ke liye nahi hain!',
      actionHint: 'Chalo boss! Tour poora hua. Ab app ghumo aur full marks lao!'
    }
  ];

  const current = steps[currentStep];

  // Auto switch tab and scroll target element into clear view WITHOUT blurring the background!
  useEffect(() => {
    if (isOpen && current) {
      setActiveTab(current.tab);

      // Delay slightly for tab render, then smoothly scroll and highlight element
      const timer = setTimeout(() => {
        const el = document.getElementById(current.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add glowing highlight effect class to the actual element
          el.classList.add('tour-spotlight-active');
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        // remove highlight from all elements
        document.querySelectorAll('.tour-spotlight-active').forEach(node => {
          node.classList.remove('tour-spotlight-active');
        });
      };
    }
  }, [currentStep, isOpen, current]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      triggerConfetti();
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#f59e0b']
    });
  };

  return (
    <>
      <style>{`
        /* Glowing Spotlight Ring on the actual live element without blurring background! */
        .tour-spotlight-active {
          outline: 3px solid #38bdf8 !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.6) !important;
          border-color: #38bdf8 !important;
          transition: all 0.3s ease-in-out !important;
        }
      `}</style>

      {/* Persistent Floating Bunty Mascot (Click anytime to launch tour) */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsOpen(true);
            }}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white pl-2 pr-5 py-2.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-cyan-400/50 group"
          >
            {/* Cute 3D Animated Bot Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-xl shadow-inner group-hover:rotate-12 transition-transform">
              🤖
            </div>
            <div className="text-left">
              <span className="text-xs font-black block tracking-wide text-white leading-tight flex items-center gap-1">
                Bunty AI Guide <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
              </span>
              <span className="text-[10px] text-cyan-200 block font-medium">
                Website Tour Dobara Dekho
              </span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Non-intrusive Floating Tour Guide Dock (NO FULLSCREEN BLUR!) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-lg w-[calc(100vw-32px)] sm:w-[480px]"
          >
            <div className="glass-panel bg-slate-950/95 border-2 border-cyan-400/80 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden space-y-3.5">
              
              {/* Header: Progress, Badge, Close */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    Live Website Tour
                  </span>
                  <span className="text-[11px] font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full">
                    {currentStep + 1} / {steps.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      triggerConfetti();
                      setIsOpen(false);
                    }}
                    className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Skip Tour
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
                    title="Close Tour"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bunty Graphic Mascot + Speech Dialogue */}
              <div className="flex items-start gap-4">
                {/* Bunty 3D Animated Avatar */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="shrink-0 flex flex-col items-center"
                >
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/30">
                    {/* Glowing Top Antenna */}
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></span>
                      <span className="w-0.5 h-1.5 bg-cyan-400"></span>
                    </div>

                    {/* Cyber Visor Screen */}
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center p-1 border border-cyan-400/40 relative overflow-hidden">
                      {/* Expressive Emoji Mood Display */}
                      <span className="text-2xl filter drop-shadow">
                        {current.face}
                      </span>
                    </div>

                    {/* Waving Bot Arm */}
                    <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow animate-bounce">
                      👋
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-cyan-300 mt-1.5 uppercase tracking-wider">
                    Bunty AI
                  </span>
                </motion.div>

                {/* Relatable Hinglish Speech Bubble */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-white leading-tight">
                      {current.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950/60 border border-yellow-500/30 px-2 py-0.5 rounded inline-block">
                    {current.hinglish}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-inner mt-1">
                    "{current.speech}"
                  </p>
                  <p className="text-[11px] text-cyan-300/90 font-medium flex items-center gap-1 pt-0.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span>{current.actionHint}</span>
                  </p>
                </div>
              </div>

              {/* Navigation Controls & Progress Dots */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                {/* Step Dots */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] py-1">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentStep === idx
                          ? 'w-4 bg-cyan-400'
                          : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Back / Next Buttons */}
                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrev}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Peeche
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className="px-4 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <span>Samajh Gaya Boss!</span>
                        <Check className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Aage Chalo 👉</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
