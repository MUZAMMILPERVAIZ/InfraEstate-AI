import React from 'react';
import { motion } from 'framer-motion';

const AIForecasting = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <motion.circle
        cx="100" cy="100" r="70"
        stroke="#f59e0b" strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Percentage & Progress */}
      <motion.circle
        cx="100" cy="100" r="60"
        stroke="#f59e0b" strokeWidth="8"
        strokeDasharray="377 377"
        strokeDashoffset="94"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <motion.text
        x="100" y="100"
        fontFamily="Arial"
        fontSize="24"
        fontWeight="bold"
        fill="#f59e0b"
        textAnchor="middle"
        dominantBaseline="middle"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        98.5%
      </motion.text>

      <motion.text
        x="100" y="120"
        fontFamily="Arial"
        fontSize="10"
        fill="#f59e0b"
        textAnchor="middle"
        dominantBaseline="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        ACCURACY
      </motion.text>

      {/* Data Points & Connecting Lines */}
      <motion.g>
        {Array(8).fill().map((_, i) => {
          const angle = (i * Math.PI / 4);
          const radius = 85;
          const x = 100 + radius * Math.cos(angle);
          const y = 100 + radius * Math.sin(angle);

          return (
            <React.Fragment key={`data-point-${i}`}>
              <motion.line
                x1="100" y1="100"
                x2={x} y2={y}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
              />
              <motion.circle
                cx={x} cy={y} r="4"
                fill="#f59e0b"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
              />
            </React.Fragment>
          );
        })}
      </motion.g>

      {/* Calculation Lines */}
      <motion.g stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3">
        {Array(6).fill().map((_, i) => {
          const offset = i * 10 + 20;
          return (
            <motion.line
              key={`calc-line-${i}`}
              x1={100 - offset} y1={100 - offset}
              x2={100 + offset} y2={100 - offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.3, delay: 2 + i * 0.1 }}
            />
          );
        })}
      </motion.g>

      {/* Currency Symbols */}
      <motion.g>
        {Array(12).fill().map((_, i) => {
          const angle = (i * Math.PI / 6);
          const radius = Math.random() * 30 + 30;
          const x = 100 + radius * Math.cos(angle);
          const y = 100 + radius * Math.sin(angle);

          return (
            <motion.text
              key={`currency-${i}`}
              x={x} y={y}
              fontSize="10"
              fill="#f59e0b"
              opacity="0.5"
              textAnchor="middle"
              dominantBaseline="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.random() * 0.5 + 0.2 }}
              transition={{
                duration: Math.random() * 2 + 1,
                delay: 2.5 + Math.random(),
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              {["₨", "$", "€", "£", "¥"][Math.floor(Math.random() * 5)]}
            </motion.text>
          );
        })}
      </motion.g>
    </svg>
  );
};

export default AIForecasting;