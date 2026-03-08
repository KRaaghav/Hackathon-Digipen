import React from 'react'

export default function GalaxyTree({ size = 24, color = "white" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6ec7" />
          <stop offset="20%" stopColor="#8e44ad" />
          <stop offset="40%" stopColor="#3498db" />
          <stop offset="60%" stopColor="#2ecc71" />
          <stop offset="80%" stopColor="#f1c40f" />
          <stop offset="100%" stopColor="#e74c3c" />
        </linearGradient>
      </defs>

      {/* stacked stones */}
      <ellipse cx="50" cy="82" rx="40" ry="8" fill="url(#rainbow)" />
      <ellipse cx="50" cy="74" rx="34" ry="6" fill="url(#rainbow)" />
      <ellipse cx="50" cy="67" rx="28" ry="5" fill="url(#rainbow)" />

      {/* lotus petals */}
      <path
        d="M50 46
           C40 36 35 26 50 16
           C65 26 60 36 50 46Z"
        fill="url(#rainbow)"
      />
      <path
        d="M50 46
           C45 36 40 26 50 16"
        stroke="url(#rainbow)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M50 46
           C55 36 60 26 50 16"
        stroke="url(#rainbow)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M47 44 L42 36 L50 30 L58 36 L53 44"
        fill="url(#rainbow)"
      />
    </svg>
  )
}