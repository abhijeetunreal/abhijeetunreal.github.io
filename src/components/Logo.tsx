
import React from 'react';

const Logo = () => (
    <div className="flex justify-center items-center h-full">
        <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
                <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                 <linearGradient id="g3" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--muted))" />
                </linearGradient>
                <filter id="distortion">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="0">
                         <animate attributeName="baseFrequency" dur="10s" values="0.02;0.05;0.02" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="25" />
                </filter>
            </defs>
            <style>
                {`
                    @keyframes draw {
                        0% {
                            stroke-dashoffset: 300;
                            opacity: 1;
                        }
                        50% {
                            stroke-dashoffset: 0;
                            opacity: 1;
                        }
                        80% {
                            stroke-dashoffset: 0;
                            opacity: 1;
                        }
                        100% {
                            stroke-dashoffset: 0;
                            opacity: 0;
                        }
                    }
                    .circle {
                        stroke-dasharray: 300;
                        stroke-dashoffset: 300;
                        animation: draw 12s linear infinite;
                    }
                    .c1 { animation-delay: 0s; }
                    .c2 { animation-delay: -4s; }
                    .c3 { animation-delay: -8s; }
                `}
            </style>
            <g filter="url(#distortion)">
                <circle className="circle c1" cx="50" cy="50" r="45" stroke="url(#g1)" strokeWidth="2" />
                <circle className="circle c2" cx="50" cy="50" r="35" stroke="url(#g2)" strokeWidth="2" />
                <circle className="circle c3" cx="50" cy="50" r="25" stroke="url(#g3)" strokeWidth="2" />
            </g>
        </svg>
    </div>
);

export default Logo;
