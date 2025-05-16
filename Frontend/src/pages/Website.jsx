import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Components
import Residencies from "../components/Residencies/Residencies";
import Value from "../components/Value/Value";
import Contact from "../components/Contact/Contact";
import GetStarted from "../components/GetStarted/GetStarted";

// Custom SVG Components
import AIBuilding from "../components/SVG/AIBuilding";
import AIFloorplan from "../components/SVG/AIFloorplan";
import AIMarketAnalysis from "../components/SVG/AIMarketAnalysis";
import AIForecasting from "../components/SVG/AIForecasting";
import AIAssistant from "../components/SVG/AIAssistant";
import FloatingElements from "../components/SVG/FloatingElements";

// Styles
import './Website.css';
import ImprovedHeader from "./improvedHero";

const Website = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="App">
      <Helmet>
        <title>InfraEstate AI - Pakistan's First AI-Powered Real Estate Platform</title>
        <meta name="description" content="Revolutionize your real estate experience with AI-powered design, market analysis, and price forecasting tools." />
      </Helmet>

      {/* Hero Section */}
      <ImprovedHeader/>

      {/*<div className="hero-wrapper">*/}
      {/*  <div className="white-gradient hero-gradient-1" />*/}
      {/*  <div className="purple-gradient hero-gradient-2" />*/}

      {/*  <section className="hero-section">*/}
      {/*    /!* AI Neural Paths Background *!/*/}
      {/*    <div className="neural-background">*/}
      {/*      <FloatingElements />*/}
      {/*    </div>*/}

      {/*    <div className="hero-container innerWidth">*/}
      {/*      /!* Left Side Content *!/*/}
      {/*      <div className="hero-content">*/}
      {/*        <motion.div*/}
      {/*          className="hero-badge"*/}
      {/*          initial={{ opacity: 0, y: 20 }}*/}
      {/*          animate={{ opacity: 1, y: 0 }}*/}
      {/*          transition={{ duration: 0.5 }}*/}
      {/*        >*/}
      {/*          <span className="badge-icon">🔮</span>*/}
      {/*          <span>Pakistan's First AI-Powered Real Estate Platform</span>*/}
      {/*        </motion.div>*/}

      {/*        <motion.h1*/}
      {/*          className="hero-title"*/}
      {/*          initial={{ opacity: 0, y: 30 }}*/}
      {/*          animate={{ opacity: 1, y: 0 }}*/}
      {/*          transition={{ duration: 0.7, delay: 0.2 }}*/}
      {/*        >*/}
      {/*          Revolutionize Your <br />*/}
      {/*          <span className="highlight-text">Real Estate</span> Experience*/}
      {/*        </motion.h1>*/}

      {/*        <motion.p*/}
      {/*          className="hero-subtitle"*/}
      {/*          initial={{ opacity: 0, y: 30 }}*/}
      {/*          animate={{ opacity: 1, y: 0 }}*/}
      {/*          transition={{ duration: 0.7, delay: 0.4 }}*/}
      {/*        >*/}
      {/*          InfraEstate AI transforms how you design, analyze, and invest in property with our cutting-edge generative AI technology*/}
      {/*        </motion.p>*/}

      {/*        /!* Search Bar *!/*/}
      {/*        <motion.div*/}
      {/*          className={`search-container ${isSearchFocused ? 'focused' : ''}`}*/}
      {/*          initial={{ opacity: 0, y: 30 }}*/}
      {/*          animate={{ opacity: 1, y: 0 }}*/}
      {/*          transition={{ duration: 0.7, delay: 0.6 }}*/}
      {/*        >*/}
      {/*          <div className="search-bar">*/}
      {/*            <div className="search-icon">*/}
      {/*              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*              </svg>*/}
      {/*            </div>*/}
      {/*            <input*/}
      {/*              type="text"*/}
      {/*              placeholder="Search for properties, cities, or services..."*/}
      {/*              value={searchQuery}*/}
      {/*              onChange={(e) => setSearchQuery(e.target.value)}*/}
      {/*              onFocus={() => setIsSearchFocused(true)}*/}
      {/*              onBlur={() => setIsSearchFocused(false)}*/}
      {/*            />*/}
      {/*            <motion.button*/}
      {/*              className="search-button"*/}
      {/*              whileHover={{ scale: 1.05 }}*/}
      {/*              whileTap={{ scale: 0.95 }}*/}
      {/*            >*/}
      {/*              Search*/}
      {/*            </motion.button>*/}
      {/*          </div>*/}

      {/*          {isSearchFocused && (*/}
      {/*            <motion.div*/}
      {/*              className="search-suggestions"*/}
      {/*              initial={{ opacity: 0, y: -10 }}*/}
      {/*              animate={{ opacity: 1, y: 0 }}*/}
      {/*              exit={{ opacity: 0, y: -10 }}*/}
      {/*            >*/}
      {/*              <div className="suggestion-item">*/}
      {/*                <span className="suggestion-icon">🏠</span>*/}
      {/*                <span>Modern houses in Islamabad</span>*/}
      {/*              </div>*/}
      {/*              <div className="suggestion-item">*/}
      {/*                <span className="suggestion-icon">🏙️</span>*/}
      {/*                <span>Properties in DHA Lahore</span>*/}
      {/*              </div>*/}
      {/*              <div className="suggestion-item">*/}
      {/*                <span className="suggestion-icon">💰</span>*/}
      {/*                <span>Calculate construction costs</span>*/}
      {/*              </div>*/}
      {/*              <div className="suggestion-item">*/}
      {/*                <span className="suggestion-icon">🏗️</span>*/}
      {/*                <span>Create custom floor plans</span>*/}
      {/*              </div>*/}
      {/*            </motion.div>*/}
      {/*          )}*/}
      {/*        </motion.div>*/}

      {/*        /!* Feature Buttons *!/*/}
      {/*        <motion.div*/}
      {/*          className="feature-buttons"*/}
      {/*          initial={{ opacity: 0, y: 30 }}*/}
      {/*          animate={{ opacity: 1, y: 0 }}*/}
      {/*          transition={{ duration: 0.7, delay: 0.8 }}*/}
      {/*        >*/}
      {/*          <Link to="/ai-architect" className="feature-button">*/}
      {/*            <div className="feature-icon">*/}
      {/*              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*              </svg>*/}
      {/*            </div>*/}
      {/*            <span>AI Design</span>*/}
      {/*          </Link>*/}
      {/*          <Link to="/properties" className="feature-button">*/}
      {/*            <div className="feature-icon">*/}
      {/*              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*                <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*              </svg>*/}
      {/*            </div>*/}
      {/*            <span>Market Analysis</span>*/}
      {/*          </Link>*/}
      {/*          <Link to="/construction-estimator" className="feature-button">*/}
      {/*            <div className="feature-icon">*/}
      {/*              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*                <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*              </svg>*/}
      {/*            </div>*/}
      {/*            <span>Price Forecast</span>*/}
      {/*          </Link>*/}
      {/*          <Link to="/infra-ai" className="feature-button">*/}
      {/*            <div className="feature-icon">*/}
      {/*              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*                <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M4.93 4.93L9.17 9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M14.83 14.83L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M14.83 9.17L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M14.83 9.17L18.36 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*                <path d="M4.93 19.07L9.17 14.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
      {/*              </svg>*/}
      {/*            </div>*/}
      {/*            <span>Infra AI Chat</span>*/}
      {/*          </Link>*/}
      {/*        </motion.div>*/}
      {/*      </div>*/}

      {/*      /!* Right Side - Hero SVG *!/*/}
      {/*      <motion.div*/}
      {/*        className="hero-image-container"*/}
      {/*        initial={{ opacity: 0, x: 50 }}*/}
      {/*        animate={{ opacity: 1, x: 0 }}*/}
      {/*        transition={{ duration: 1 }}*/}
      {/*      >*/}
      {/*        <div className="image-glass">*/}
      {/*          <AIBuilding />*/}
      {/*        </div>*/}
      {/*      </motion.div>*/}
      {/*    </div>*/}

      {/*    /!* Stats Section *!/*/}
      {/*    <motion.div*/}
      {/*      className="stats-container"*/}
      {/*      initial={{ opacity: 0, y: 30 }}*/}
      {/*      animate={{ opacity: 1, y: 0 }}*/}
      {/*      transition={{ duration: 0.7, delay: 1 }}*/}
      {/*    >*/}
      {/*      <div className="stat">*/}
      {/*        <div className="stat-number">*/}
      {/*          <CountUp start={4000} end={5000} duration={2.5} /> <span>+</span>*/}
      {/*        </div>*/}
      {/*        <div className="stat-label">AI-Generated Designs</div>*/}
      {/*      </div>*/}
      {/*      <div className="stat">*/}
      {/*        <div className="stat-number">*/}
      {/*          <CountUp start={1500} end={2000} duration={2.5} /> <span>+</span>*/}
      {/*        </div>*/}
      {/*        <div className="stat-label">Satisfied Users</div>*/}
      {/*      </div>*/}
      {/*      <div className="stat">*/}
      {/*        <div className="stat-number">*/}
      {/*          <CountUp end={98.0} decimals={1} suffix="%" duration={2.5} />*/}
      {/*        </div>*/}
      {/*        <div className="stat-label">Prediction Accuracy</div>*/}
      {/*      </div>*/}
      {/*    </motion.div>*/}
      {/*  </section>*/}
      {/*</div>*/}

      {/* Module Showcase Section */}
      <ModuleShowcase />

      {/* Other Sections */}
      <Residencies />
      <Value />
      {/*<Contact />*/}
      <GetStarted />
    </div>
  );
};

// Module Showcase Component
const ModuleShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const modules = [
    {
      id: 0,
      name: "Generative House Footprint Design",
      icon: <AIFloorplan />,
      description: "Create personalized floor plans instantly based on your requirements, with AI-generated variants optimized for your plot size and budget.",
      features: [
        "Multi-variant floor plan generation",
        "Automatic dimension extraction",
        "3D visualization capabilities",
        "Interior styling pipeline"
      ],
      link: "/ai-architect",
      color: "#7c3aed"
    },
    {
      id: 1,
      name: "Market Analysis",
      icon: <AIMarketAnalysis />,
      description: "Leverage our transformer-based PakReNOVate model to analyze market trends and get data-driven insights for smarter investments.",
      features: [
        "Location-based analysis with embeddings",
        "Macroeconomic indicator integration",
        "Interactive trend visualization",
        "Investment opportunity recommendations"
      ],
      link: "/properties",
      color: "#1d4ed8"
    },
    {
      id: 2,
      name: "Price Forecasting",
      icon: <AIForecasting />,
      description: "Predict future property prices and accurately estimate construction costs with our hybrid AI forecasting model.",
      features: [
        "Hybrid parametric-ML estimation",
        "Detailed construction cost breakdown",
        "Budget optimization suggestions",
        "High-accuracy predictions (98.5%)"
      ],
      link: "/construction-estimator",
      color: "#f59e0b"
    },
    {
      id: 3,
      name: "Infra AI Assistant",
      icon: <AIAssistant />,
      description: "Your personal real estate advisor, answering questions about properties, legal processes, and offering personalized recommendations.",
      features: [
        "Intelligent property search",
        "Legal and process guidance",
        "Architectural advice",
        "Multi-session conversation memory"
      ],
      link: "/infra-ai",
      color: "#10b981"
    }
  ];

  const handleMouseMove = (e) => {
    if (isHovering) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      setHoverPosition({ x, y });
    }
  };

  return (
    <section className="module-showcase">
      <div className="module-background-pattern"></div>

      <div className="module-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            CORE FEATURES
          </div>
          <h2 className="section-title">AI-Powered Modules</h2>
          <p className="section-subtitle">
            Explore our comprehensive suite of AI-powered tools designed to revolutionize your real estate experience
          </p>
        </div>

        {/* Module Navigation */}
        <div className="module-navigation">
          {modules.map((module, index) => (
            <motion.button
              key={module.id}
              className={`module-nav-item ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
              style={{
                '--module-color': module.color,
                '--module-active': activeTab === index ? 1 : 0
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="module-nav-icon">{module.icon}</div>
              <div className="module-nav-text">{module.name.split(' ').slice(-2).join(' ')}</div>
              {activeTab === index && (
                <motion.div
                  className="module-nav-indicator"
                  layoutId="moduleIndicator"
                  style={{ backgroundColor: module.color }}
                ></motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Module Content */}
        <div
          className="module-content-container"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          style={{
            '--mouse-x': `${hoverPosition.x}px`,
            '--mouse-y': `${hoverPosition.y}px`,
            '--module-color': modules[activeTab].color
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="module-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="module-text">
                <motion.h3
                  className="module-name"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {modules[activeTab].name}
                </motion.h3>

                <motion.p
                  className="module-description"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {modules[activeTab].description}
                </motion.p>

                <div className="module-features">
                  {modules[activeTab].features.map((feature, i) => (
                    <motion.div
                      key={i}
                      className="module-feature"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    >
                      <div className="feature-bullet" style={{ backgroundColor: modules[activeTab].color }}></div>
                      <div className="feature-text">{feature}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Link
                    to={modules[activeTab].link}
                    className="explore-button"
                    style={{ backgroundColor: modules[activeTab].color }}
                  >
                    <span>Explore {modules[activeTab].name.split(' ').slice(-2).join(' ')}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="module-visual"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="module-icon-large">
                  {modules[activeTab].icon}
                </div>

                <div className="module-decoration">
                  <div className="decoration-circle" style={{
                    left: '10%',
                    top: '20%',
                    backgroundColor: modules[activeTab].color,
                    opacity: 0.1,
                    width: '150px',
                    height: '150px'
                  }}></div>
                  <div className="decoration-circle" style={{
                    right: '20%',
                    bottom: '10%',
                    backgroundColor: modules[activeTab].color,
                    opacity: 0.05,
                    width: '200px',
                    height: '200px'
                  }}></div>
                </div>

                <div className="data-points">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="data-point"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: Math.random() * 0.8 + 0.2 }}
                      transition={{
                        duration: Math.random() * 2 + 1,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor: modules[activeTab].color,
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                      }}
                    ></motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="module-content-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default Website;