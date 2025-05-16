import React from 'react';
import { motion } from 'framer-motion';

const AIFloorplan = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="30" y="30" width="140" height="140"
        stroke="#7c3aed" strokeWidth="3" strokeDasharray="200 200"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', repeatDelay: 2 }}
      />

      {/* Interior Walls */}
      <motion.path
        d="M30,100 L170,100 M100,30 L100,100 M100,170 L100,100 M100,100 L130,100 L130,130"
        stroke="#7c3aed" strokeWidth="2"
        strokeDasharray="200 200"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatType: 'loop', repeatDelay: 2 }}
      />

      {/* Furniture */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        {/* Bed */}
        <rect x="40" y="40" width="50" height="40" rx="2" fill="rgba(124, 58, 237, 0.2)" />

        {/* Couch */}
        <rect x="40" y="120" width="40" height="20" rx="2" fill="rgba(124, 58, 237, 0.2)" />

        {/* Dining Table */}
        <rect x="120" y="40" width="30" height="30" rx="15" fill="rgba(124, 58, 237, 0.2)" />

        {/* Kitchen Counter */}
        <rect x="135" y="110" width="25" height="10" rx="1" fill="rgba(124, 58, 237, 0.2)" />
      </motion.g>

      {/* Dimension Lines */}
      <motion.g
        stroke="#7c3aed" strokeWidth="1" strokeDasharray="2 2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <line x1="20" y1="30" x2="20" y2="170" />
        <line x1="30" y1="20" x2="170" y2="20" />
        <line x1="20" y1="30" x2="30" y2="30" />
        <line x1="20" y1="170" x2="30" y2="170" />
        <line x1="30" y1="20" x2="30" y2="30" />
        <line x1="170" y1="20" x2="170" y2="30" />
        <text x="10" y="100" fill="#7c3aed" fontSize="8" textAnchor="middle">5m</text>
        <text x="100" y="15" fill="#7c3aed" fontSize="8" textAnchor="middle">5m</text>
      </motion.g>

      {/* AI Processing Effect */}
      <motion.g>
        {Array(4).fill().map((_, i) => (
          <motion.circle
            key={`scan-${i}`}
            cx="100" cy="100" r="70"
            stroke="#7c3aed" strokeWidth="1"
            fill="none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.5, 0], scale: 1.5 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.75,
              repeatDelay: 0
            }}
          />
        ))}
      </motion.g>
    </svg>
  );
};

export default AIFloorplan;