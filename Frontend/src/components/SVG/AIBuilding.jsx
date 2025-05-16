import React from 'react';
import { motion } from 'framer-motion';

const AIBuilding = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Elements */}
      <motion.rect
        x="0" y="100" width="800" height="500"
        fill="url(#buildingGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* City Skyline */}
      <motion.path
        d="M0,500 L50,500 L50,400 L100,400 L100,350 L150,350 L150,420 L200,420 L200,300 L250,300 L250,450 L300,450 L300,350 L350,350 L350,400 L400,400 L400,250 L450,250 L450,400 L500,400 L500,320 L550,320 L550,400 L600,400 L600,370 L650,370 L650,450 L700,450 L700,400 L750,400 L750,450 L800,450 L800,500 L0,500 Z"
        fill="#111827"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Main Building */}
      <motion.g
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <rect x="250" y="200" width="300" height="300" fill="#1a365d" />
        <rect x="270" y="220" width="260" height="280" fill="#1e40af" />

        {/* Windows */}
        {Array(10).fill().map((_, rowIndex) =>
          Array(6).fill().map((_, colIndex) => (
            <motion.rect
              key={`window-${rowIndex}-${colIndex}`}
              x={290 + colIndex * 40}
              y={240 + rowIndex * 25}
              width="20"
              height="15"
              fill="#60a5fa"
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.random() > 0.3 ? 0.8 : 0.3 }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 3
              }}
            />
          ))
        )}
      </motion.g>

      {/* AI Elements */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        {/* Neural Network Lines */}
        {Array(15).fill().map((_, i) => (
          <motion.line
            key={`neural-line-${i}`}
            x1={200 + Math.random() * 400}
            y1={150 + Math.random() * 300}
            x2={200 + Math.random() * 400}
            y2={150 + Math.random() * 300}
            stroke="#7c3aed"
            strokeWidth="1"
            strokeOpacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Data Points */}
        {Array(20).fill().map((_, i) => (
          <motion.circle
            key={`data-point-${i}`}
            cx={200 + Math.random() * 400}
            cy={150 + Math.random() * 300}
            r={Math.random() * 3 + 2}
            fill="#f59e0b"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.1
            }}
          />
        ))}
      </motion.g>

      {/* Blueprint Overlay */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <rect x="230" y="180" width="340" height="340" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" fill="none" />
        <line x1="230" y1="240" x2="570" y2="240" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="230" y1="300" x2="570" y2="300" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="230" y1="360" x2="570" y2="360" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="230" y1="420" x2="570" y2="420" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="290" y1="180" x2="290" y2="520" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="350" y1="180" x2="350" y2="520" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="410" y1="180" x2="410" y2="520" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="470" y1="180" x2="470" y2="520" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="530" y1="180" x2="530" y2="520" stroke="#60a5fa" strokeWidth="1" strokeDasharray="5,5" />
      </motion.g>

      {/* Gradients */}
      <defs>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AIBuilding;