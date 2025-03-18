import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bracketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A00E0"/>
          <stop offset="100%" stopColor="#8E2DE2"/>
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6D28D9"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>

      {/* Main logo group */}
      <g transform="translate(86, 156)">
        {/* Left bracket */}
        <path 
          d="M0 100 L100 0 L150 0 L50 100 L150 200 L100 200 Z" 
          fill="url(#bracketGradient)"
        />
        {/* Center slash */}
        <path 
          d="M250 0 L150 200 L100 200 L200 0 Z" 
          fill="url(#bracketGradient)"
        />
        {/* Right bracket */}
        <path 
          d="M340 100 L240 0 L190 0 L290 100 L190 200 L240 200 Z" 
          fill="url(#bracketGradient)"
        />
      </g>

      {/* Decorative elements */}
      <g transform="translate(256, 256)" stroke="url(#accentGradient)" strokeOpacity="0.15">
        <circle r="180" fill="none" strokeWidth="1.5"/>
        <circle r="200" fill="none" strokeWidth="1"/>
        <circle r="220" fill="none" strokeWidth="0.5"/>
      </g>
    </svg>
  );
};

export default Logo; 