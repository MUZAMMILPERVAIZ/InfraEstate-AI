import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Neural Network Lines */}
      <motion.g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
        {Array(30).fill().map((_, i) => {
          const x1 = Math.random() * 1000;
          const y1 = Math.random() * 800;
          const x2 = Math.random() * 1000;
          const y2 = Math.random() * 800;

          return (
            <motion.line
              key={`line-${i}`}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 2
              }}
            />
          );
        })}
      </motion.g>

      {/* Network Nodes */}
      <motion.g>
        {Array(40).fill().map((_, i) => {
          const x = Math.random() * 1000;
          const y = Math.random() * 800;
          const size = Math.random() * 3 + 1;

          return (
            <motion.circle
              key={`node-${i}`}
              cx={x} cy={y} r={size}
              fill="rgba(124, 245, 237, 0.3)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          );
        })}
      </motion.g>

      {/* Data Streams */}
      <motion.g>
        {Array(15).fill().map((_, i) => {
          const pathPoints = [];
          const segments = Math.floor(Math.random() * 5) + 3;

          for (let j = 0; j <= segments; j++) {
            pathPoints.push({
              x: Math.random() * 1000,
              y: Math.random() * 800
            });
          }

          const pathD = `M ${pathPoints[0].x} ${pathPoints[0].y} ` +
            pathPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

          return (
            <motion.path
              key={`stream-${i}`}
              d={pathD}
              stroke="rgba(29, 78, 216, 0.2)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: 'loop',
                delay: Math.random() * 2
              }}
            />
          );
        })}
      </motion.g>

      {/* Floating Elements */}
      <motion.g>
        {Array(10).fill().map((_, i) => {
          const x = Math.random() * 1000;
          const y = Math.random() * 800;
          const size = Math.random() * 15 + 5;

          return (
            <motion.rect
              key={`rect-${i}`}
              x={x} y={y}
              width={size} height={size}
              rx="2"
              fill="rgba(245, 158, 11, 0.1)"
              initial={{ rotate: 0 }}
              animate={{
                rotate: 360,
                x: x + Math.random() * 100 - 50,
                y: y + Math.random() * 100 - 50,
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: "linear"
              }}
            />
          );
        })}

        {Array(10).fill().map((_, i) => {
          const x = Math.random() * 1000;
          const y = Math.random() * 800;
          const size = Math.random() * 15 + 5;

          return (
            <motion.circle
              key={`circle-${i}`}
              cx={x} cy={y} r={size}
              fill="rgba(124, 58, 237, 0.1)"
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.2, 1],
                x: x + Math.random() * 100 - 50,
                y: y + Math.random() * 100 - 50,
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: "linear"
              }}
            />
          );
        })}
      </motion.g>
    </svg>
  );
};

export default FloatingElements;