import React from 'react';
import { motion } from 'framer-motion';

const AIMarketAnalysis = () => {
  const barData = [25, 65, 45, 80, 60, 40, 70, 55];
  const lineData = generateSmoothPath(barData.map((d, i) => [i * 20 + 20, 100 - d]));

  function generateSmoothPath(points) {
    if (points.length < 2) return '';

    let path = `M ${points[0][0]} ${points[0][1]}`;

    for (let i = 0; i < points.length - 1; i++) {
      const x1 = points[i][0];
      const y1 = points[i][1];
      const x2 = points[i+1][0];
      const y2 = points[i+1][1];

      const cpx1 = x1 + (x2 - x1) / 2;
      const cpy1 = y1;
      const cpx2 = x1 + (x2 - x1) / 2;
      const cpy2 = y2;

      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
    }

    return path;
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Grid */}
      <motion.g
        stroke="#e5e7eb" strokeWidth="0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        {Array(9).fill().map((_, i) => (
          <line key={`grid-h-${i}`} x1="10" y1={20 + i * 20} x2="190" y2={20 + i * 20} />
        ))}
        {Array(9).fill().map((_, i) => (
          <line key={`grid-v-${i}`} x1={20 + i * 20} y1="10" x2={20 + i * 20} y2="190" />
        ))}
      </motion.g>

      {/* Axes */}
      <motion.g
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.line x1="20" y1="150" x2="190" y2="150" stroke="#1d4ed8" strokeWidth="2" />
        <motion.line x1="20" y1="30" x2="20" y2="150" stroke="#1d4ed8" strokeWidth="2" />
      </motion.g>

      {/* Chart Bars */}
      <motion.g>
        {barData.map((value, index) => (
          <motion.rect
            key={`bar-${index}`}
            x={index * 20 + 25}
            y={150 - value}
            width="10"
            height={value}
            fill="rgba(29, 78, 216, 0.2)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          />
        ))}
      </motion.g>

      {/* Line Chart */}
      <motion.path
        d={lineData}
        stroke="#1d4ed8"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />

      {/* Data Points */}
      <motion.g>
        {barData.map((value, index) => (
          <motion.circle
            key={`point-${index}`}
            cx={index * 20 + 20}
            cy={150 - value}
            r="4"
            fill="#1d4ed8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 + 0.1 * index }}
          />
        ))}
      </motion.g>

      {/* AI Analysis Elements */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        {/* Trend Line */}
        <line x1="20" y1="130" x2="180" y2="70" stroke="#7c3aed" strokeWidth="1" strokeDasharray="5,5" />

        {/* Highlights */}
        <circle cx="80" cy="70" r="8" stroke="#7c3aed" strokeWidth="2" fill="none" />
        <circle cx="140" cy="50" r="8" stroke="#7c3aed" strokeWidth="2" fill="none" />

        {/* AI Annotations */}
        <motion.text x="90" y="70" fill="#7c3aed" fontSize="8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>Market Peak</motion.text>
        <motion.text x="150" y="50" fill="#7c3aed" fontSize="8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7 }}>Growth Trend</motion.text>
      </motion.g>

      {/* AI Prediction */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <motion.path
          d="M 180 80 Q 195 70, 210 90"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="3,3"
          fill="none"
        />
        <motion.text x="180" y="60" fill="#f59e0b" fontSize="8">Prediction</motion.text>
      </motion.g>
    </svg>
  );
};

export default AIMarketAnalysis;