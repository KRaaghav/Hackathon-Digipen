import React from 'react'

export default function GalaxyTree({ size = 24, color = "white" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Roots */}
      <path d="M 100 180 Q 80 200 60 210" stroke={color} strokeWidth="2.5" opacity="0.8" />
      <path d="M 100 180 Q 120 200 140 210" stroke={color} strokeWidth="2.5" opacity="0.8" />
      <path d="M 100 180 Q 90 210 85 225" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <path d="M 100 180 Q 110 210 115 225" stroke={color} strokeWidth="1.5" opacity="0.6" />

      {/* Main trunk */}
      <path d="M 100 180 Q 98 150 100 120" stroke={color} strokeWidth="3.5" opacity="0.9" />

      {/* Primary branches */}
      <path d="M 100 140 Q 75 130 55 120" stroke={color} strokeWidth="2.5" opacity="0.85" />
      <path d="M 100 140 Q 125 130 145 120" stroke={color} strokeWidth="2.5" opacity="0.85" />

      {/* Secondary branches left */}
      <path d="M 75 130 Q 60 120 45 110" stroke={color} strokeWidth="1.8" opacity="0.7" />
      <path d="M 75 130 Q 70 115 65 100" stroke={color} strokeWidth="1.8" opacity="0.7" />
      <path d="M 60 120 Q 45 115 35 110" stroke={color} strokeWidth="1.5" opacity="0.6" />

      {/* Secondary branches right */}
      <path d="M 125 130 Q 140 120 155 110" stroke={color} strokeWidth="1.8" opacity="0.7" />
      <path d="M 125 130 Q 130 115 135 100" stroke={color} strokeWidth="1.8" opacity="0.7" />
      <path d="M 140 120 Q 155 115 165 110" stroke={color} strokeWidth="1.5" opacity="0.6" />

      {/* Upper branches */}
      <path d="M 100 120 Q 85 100 70 85" stroke={color} strokeWidth="2" opacity="0.8" />
      <path d="M 100 120 Q 115 100 130 85" stroke={color} strokeWidth="2" opacity="0.8" />

      {/* Top branches left */}
      <path d="M 70 85 Q 55 75 45 60" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <path d="M 70 85 Q 65 70 60 55" stroke={color} strokeWidth="1.2" opacity="0.6" />

      {/* Top branches right */}
      <path d="M 130 85 Q 145 75 155 60" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <path d="M 130 85 Q 135 70 140 55" stroke={color} strokeWidth="1.2" opacity="0.6" />

      {/* Fine twigs left side */}
      <path d="M 55 75 Q 45 65 38 55" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M 60 55 Q 50 45 42 35" stroke={color} strokeWidth="0.8" opacity="0.5" />

      {/* Fine twigs right side */}
      <path d="M 145 75 Q 155 65 162 55" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M 140 55 Q 150 45 158 35" stroke={color} strokeWidth="0.8" opacity="0.5" />

      {/* Glowing orbs at branch tips */}
      <circle cx="45" cy="60" r="2.5" fill={color} opacity="0.9" />
      <circle cx="38" cy="55" r="2" fill={color} opacity="0.7" />
      <circle cx="42" cy="35" r="2" fill={color} opacity="0.6" />
      <circle cx="155" cy="60" r="2.5" fill={color} opacity="0.9" />
      <circle cx="162" cy="55" r="2" fill={color} opacity="0.7" />
      <circle cx="158" cy="35" r="2" fill={color} opacity="0.6" />
      <circle cx="55" cy="110" r="1.8" fill={color} opacity="0.8" />
      <circle cx="145" cy="110" r="1.8" fill={color} opacity="0.8" />

      {/* Cosmic stars around the tree */}
      <circle cx="20" cy="80" r="1.2" fill={color} opacity="0.9" />
      <circle cx="30" cy="120" r="0.8" fill={color} opacity="0.7" />
      <circle cx="180" cy="90" r="1.2" fill={color} opacity="0.9" />
      <circle cx="170" cy="130" r="0.8" fill={color} opacity="0.7" />
      <circle cx="25" cy="40" r="0.6" fill={color} opacity="0.6" />
      <circle cx="175" cy="50" r="0.6" fill={color} opacity="0.6" />

      {/* Stray cosmic sparkles */}
      <circle cx="50" cy="30" r="0.5" fill={color} opacity="0.7" />
      <circle cx="150" cy="25" r="0.4" fill={color} opacity="0.6" />
      <circle cx="35" cy="160" r="0.4" fill={color} opacity="0.5" />
      <circle cx="165" cy="170" r="0.5" fill={color} opacity="0.6" />
      <circle cx="100" cy="30" r="0.6" fill={color} opacity="0.5" />
      <circle cx="80" cy="50" r="0.4" fill={color} opacity="0.4" />
      <circle cx="120" cy="45" r="0.4" fill={color} opacity="0.4" />

      {/* Additional ambient glow points */}
      <circle cx="70" cy="140" r="3" fill={color} opacity="0.15" />
      <circle cx="130" cy="140" r="3" fill={color} opacity="0.15" />
      <circle cx="100" cy="60" r="4" fill={color} opacity="0.1" />
    </svg>
  )
}