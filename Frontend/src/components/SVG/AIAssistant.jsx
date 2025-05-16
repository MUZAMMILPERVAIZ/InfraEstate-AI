import React from 'react';
import { motion } from 'framer-motion';

const AIAssistant = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* AI Brain */}
      <motion.circle
        cx="100" cy="85" r="30"
        fill="#10b981"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      />

      {/* Circuit Lines */}
      <motion.g
        stroke="#10b981"
        strokeWidth="2"
        fill="none"
      >
        {Array(6).fill().map((_, i) => {
          const angle = (i * Math.PI / 3);
          const startX = 100 + 30 * Math.cos(angle);
          const startY = 85 + 30 * Math.sin(angle);
          const endX = 100 + 50 * Math.cos(angle);
          const endY = 85 + 50 * Math.sin(angle);

          return (
            <motion.line
              key={`circuit-${i}`}
              x1={startX} y1={startY}
              x2={endX} y2={endY}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
            />
          );
        })}
      </motion.g>

      {/* Connection Nodes */}
      <motion.g>
        {Array(6).fill().map((_, i) => {
          const angle = (i * Math.PI / 3);
          const x = 100 + 50 * Math.cos(angle);
          const y = 85 + 50 * Math.sin(angle);

          return (
            <motion.circle
              key={`node-${i}`}
              cx={x} cy={y} r="3"
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
            />
          );
        })}
      </motion.g>

      {/* Chat Bubbles */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        {/* AI Response Bubble */}
        <motion.path
          d="M70,130 L70,160 C70,165.523 74.4772,170 80,170 L120,170 C125.523,170 130,165.523 130,160 L130,130 C130,124.477 125.523,120 120,120 L80,120 C74.4772,120 70,124.477 70,130 Z"
          fill="#10b981"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        />
        <motion.path
          d="M70,130 L60,140 L65,130"
          fill="#10b981"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.8 }}
        />

        {/* Chat Lines */}
        <motion.g stroke="white" strokeWidth="2" strokeLinecap="round">
          <motion.line
            x1="80" y1="135" x2="120" y2="135"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 2 }}
          />
          <motion.line
            x1="80" y1="145" x2="110" y2="145"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 2.1 }}
          />
          <motion.line
            x1="80" y1="155" x2="100" y2="155"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 2.2 }}
          />
        </motion.g>
      </motion.g>

      {/* Brain Pulses */}
      <motion.g>
        {Array(3).fill().map((_, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx="100" cy="85" r="30"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              repeatDelay: 0.2
            }}
          />
        ))}
      </motion.g>

      {/* Digital Data Points */}
      <motion.g>
        {Array(20).fill().map((_, i) => {
          const x = Math.random() * 200;
          const y = Math.random() * 60 + 30;

          return (
            <motion.circle
              key={`data-bit-${i}`}
              cx={x} cy={y} r="1.5"
              fill="#10b981"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: y - 10
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          );
        })}
      </motion.g>
    </svg>
  );
};

export default AIAssistant;