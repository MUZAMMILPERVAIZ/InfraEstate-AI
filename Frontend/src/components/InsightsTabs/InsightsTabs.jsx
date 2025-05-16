import React from 'react';
import { motion } from 'framer-motion';
import './InsightsTabs.css';

const InsightsTabs = ({ items, activeIndex, onChange }) => {
  return (
    <div className="insights-tabs-container">
      {items.map((item, index) => (
        <motion.button
          key={index}
          className={`insight-tab ${activeIndex === index ? 'active' : ''}`}
          onClick={() => onChange(index)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            '--tab-color': item.color,
            '--tab-active': activeIndex === index ? 1 : 0
          }}
        >
          <span></span>
        </motion.button>
      ))}
    </div>
  );
};

export default InsightsTabs;