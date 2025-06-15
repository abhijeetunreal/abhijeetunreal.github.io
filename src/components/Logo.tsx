
import React from 'react';

const Logo = () => (
    <div className="flex justify-center items-center h-full">
        <svg
            width="80"
            height="80"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary animate-pulse"
        >
            <path
                d="M30 0 L60 30 L30 60 L0 30 Z"
                stroke="currentColor"
                strokeWidth="3"
            />
            <path
                d="M30 15 L45 30 L30 45 L15 30 Z"
                fill="currentColor"
            />
        </svg>
    </div>
);

export default Logo;
