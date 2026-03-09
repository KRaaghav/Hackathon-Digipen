import React from 'react'

export default function GalaxyTree({ size = 24, color = "white" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 280"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="20%" stopColor="#7c3aed" />
          <stop offset="40%" stopColor="#ec4899" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="80%" stopColor="#f1c40f" />
          <stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* floating sparkles/particles */}
      <circle cx="30" cy="80" r="1.5" fill="#a855f7" opacity="0.5" filter="url(#softGlow)" />
      <circle cx="170" cy="70" r="2" fill="#ec4899" opacity="0.6" filter="url(#softGlow)" />
      <circle cx="25" cy="150" r="1" fill="#7c3aed" opacity="0.4" filter="url(#softGlow)" />
      <circle cx="175" cy="140" r="1.2" fill="#84cc16" opacity="0.5" filter="url(#softGlow)" />
      <circle cx="40" cy="200" r="0.8" fill="#f97316" opacity="0.4" filter="url(#softGlow)" />
      <circle cx="160" cy="210" r="1" fill="#a855f7" opacity="0.5" filter="url(#softGlow)" />

      {/* lotus flower - 6 petals */}
      {/* top petal */}
      <path
        d="M 100 50 Q 85 25 70 10 Q 85 35 100 50 Q 115 35 130 10 Q 115 25 100 50 Z"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      {/* top-right petal */}
      <path
        d="M 125 65 Q 145 45 165 35 Q 145 60 125 75 Q 130 60 145 40 Q 135 55 125 65 Z"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* bottom-right petal */}
      <path
        d="M 120 95 Q 145 110 165 135 Q 140 110 120 100 Q 135 105 155 125 Q 130 100 120 95 Z"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* bottom petal */}
      <path
        d="M 100 115 Q 90 140 80 160 Q 100 135 100 115 Q 110 140 120 160 Q 100 135 100 115 Z"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* bottom-left petal */}
      <path
        d="M 80 95 Q 55 110 35 135 Q 60 110 80 100 Q 65 105 45 125 Q 70 100 80 95 Z"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* top-left petal */}
      <path
        d="M 75 65 Q 55 45 35 35 Q 55 60 75 75 Q 70 60 55 40 Q 65 55 75 65 Z"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* inner lotus details */}
      <circle cx="100" cy="75" r="8" fill="none" stroke="url(#rainbowGrad)" strokeWidth="3" opacity="0.7" />

      {/* stacked spiral stones */}
      {/* stone 1 */}
      <path
        d="M 75 130 Q 100 122 125 130 Q 112 145 100 150 Q 88 145 75 130"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.95"
      />

      {/* stone 2 */}
      <path
        d="M 70 155 Q 100 145 130 155 Q 110 168 100 172 Q 90 168 70 155"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* stone 3 */}
      <path
        d="M 65 178 Q 100 165 135 178 Q 112 192 100 196 Q 88 192 65 178"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* stone 4 */}
      <path
        d="M 55 205 Q 100 190 145 205 Q 115 218 100 223 Q 85 218 55 205"
        fill="none"
        stroke="url(#rainbowGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* base stone */}
      <path
        d="M 40 235 Q 100 215 160 235 L 160 250 Q 100 255 40 250 Z"
        fill="url(#rainbowGrad)"
        opacity="0.75"
      />
    </svg>
  )
}