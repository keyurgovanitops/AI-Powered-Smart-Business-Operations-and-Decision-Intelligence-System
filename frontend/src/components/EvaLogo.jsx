import React from 'react';

export default function EvaLogo({ className = "w-8 h-8", variant = "colored" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="evaGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="evaGradAccent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="evaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hex-Shield Vault Foundation */}
      <polygon 
        points="50,6 90,26 90,74 50,94 10,74 10,26" 
        fill="url(#evaGradPrimary)" 
        stroke="#60A5FA" 
        strokeWidth="2.5"
      />

      {/* Inner Geometric 'E' & 'V' & 'A' Interlock */}
      {/* Upper E arm */}
      <path 
        d="M26 30 H74 V38 H36 V46 H66 V54 H36 V62 H74 V70 H26 Z" 
        fill="white" 
        opacity="0.95"
      />

      {/* Dynamic Chevron V & A apex (Emerald / Cyan FinTech Accents) */}
      <path 
        d="M38 52 L50 74 L62 52 L70 56 L50 90 L30 56 Z" 
        fill="url(#evaGradAccent)" 
        filter="url(#evaGlow)"
      />

      {/* Neural Core Node */}
      <circle cx="50" cy="50" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
}
