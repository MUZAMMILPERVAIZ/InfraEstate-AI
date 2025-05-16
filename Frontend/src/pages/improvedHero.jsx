import React, { useState } from 'react';
import "./ImprovedHero.css";
import FloatingElements from "../components/SVG/FloatingElements";

const ImprovedHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="hero-wrapper" style={{ background: "#111827" }}>
      {/* Gradient backgrounds with improved opacity */}
      <div className="white-gradient hero-gradient-1" style={{ opacity: 0.2 }} />
      <div className="purple-gradient hero-gradient-2" style={{ opacity: 0.2 }} />

      <section className="hero-section" style={{ padding: "5rem 0 1rem" }}>
        {/* Background pattern with adjusted opacity */}
        <div className="neural-background" style={{ opacity: 0.2 }}></div>
          <div className="neural-background">
            <FloatingElements />
          </div>

        <div className="hero-container innerWidth" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "3rem" }}>
          {/* Left side content */}
          <div className="hero-content" style={{ flex: 1 }}>
            <div
              className="hero-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(90deg, rgba(29, 78, 216, 0.9), rgba(124, 58, 237, 0.9))",
                color: "white",
                fontWeight: "600",
                padding: "8px 16px",
                borderRadius: "50px",
                marginBottom: "1.5rem",
                fontSize: "14px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 20px rgba(124, 58, 237, 0.25)"
              }}
            >
              <span className="badge-icon">🔮</span>
              <span>Pakistan's First AI-Powered Real Estate Platform</span>
            </div>

            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: "800",
                lineHeight: "1.2",
                marginBottom: "1.5rem",
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
              }}
            >
              Revolutionize Your <br />
              <span style={{
                background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none"
              }}>Real Estate</span> Experience
            </h1>

            <p
              className="hero-subtitle"
              style={{
                fontSize: "1.125rem",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "2rem",
                maxWidth: "570px",
                lineHeight: "1.6",
                fontWeight: "500",
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)"
              }}
            >
              InfraEstate AI transforms how you design, analyze, and invest in property with our cutting-edge generative AI technology
            </p>

            {/* Search Bar */}
            {/*<div*/}
            {/*  className={`search-container ${isSearchFocused ? 'focused' : ''}`}*/}
            {/*  style={{*/}
            {/*    marginBottom: "2rem",*/}
            {/*    width: "100%",*/}
            {/*    position: "relative"*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <div className="search-bar" style={{*/}
            {/*    display: "flex",*/}
            {/*    alignItems: "center",*/}
            {/*    background: "rgba(255, 255, 255, 0.1)",*/}
            {/*    backdropFilter: "blur(10px)",*/}
            {/*    borderRadius: "12px",*/}
            {/*    padding: "0.5rem",*/}
            {/*    border: "1px solid rgba(255, 255, 255, 0.2)",*/}
            {/*    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"*/}
            {/*  }}>*/}
            {/*    <div className="search-icon" style={{*/}
            {/*      display: "flex",*/}
            {/*      alignItems: "center",*/}
            {/*      justifyContent: "center",*/}
            {/*      padding: "0 12px",*/}
            {/*      color: "rgba(255, 255, 255, 0.7)"*/}
            {/*    }}>*/}
            {/*      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
            {/*        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
            {/*      </svg>*/}
            {/*    </div>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      placeholder="Search for properties, cities, or services..."*/}
            {/*      value={searchQuery}*/}
            {/*      onChange={(e) => setSearchQuery(e.target.value)}*/}
            {/*      onFocus={() => setIsSearchFocused(true)}*/}
            {/*      onBlur={() => setIsSearchFocused(false)}*/}
            {/*      style={{*/}
            {/*        flex: 1,*/}
            {/*        border: "none",*/}
            {/*        outline: "none",*/}
            {/*        padding: "0.75rem 1rem",*/}
            {/*        fontSize: "1rem",*/}
            {/*        background: "transparent",*/}
            {/*        color: "white"*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <button*/}
            {/*      className="search-button"*/}
            {/*      style={{*/}
            {/*        background: "linear-gradient(90deg, #7c3aed, #6d28d9)",*/}
            {/*        color: "white",*/}
            {/*        border: "none",*/}
            {/*        borderRadius: "8px",*/}
            {/*        padding: "0.75rem 1.5rem",*/}
            {/*        fontWeight: "600",*/}
            {/*        cursor: "pointer",*/}
            {/*        transition: "all 0.3s ease",*/}
            {/*        boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      Search*/}
            {/*    </button>*/}
            {/*  </div>*/}

            {/*  {isSearchFocused && (*/}
            {/*    <div*/}
            {/*      className="search-suggestions"*/}
            {/*      style={{*/}
            {/*        position: "absolute",*/}
            {/*        top: "100%",*/}
            {/*        left: 0,*/}
            {/*        right: 0,*/}
            {/*        background: "rgba(30, 41, 59, 0.95)",*/}
            {/*        backdropFilter: "blur(10px)",*/}
            {/*        borderRadius: "12px",*/}
            {/*        marginTop: "8px",*/}
            {/*        padding: "0.5rem",*/}
            {/*        zIndex: 10,*/}
            {/*        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",*/}
            {/*        border: "1px solid rgba(255, 255, 255, 0.1)"*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <div className="suggestion-item" style={{*/}
            {/*        display: "flex",*/}
            {/*        alignItems: "center",*/}
            {/*        gap: "10px",*/}
            {/*        padding: "0.75rem 1rem",*/}
            {/*        color: "rgba(255, 255, 255, 0.9)",*/}
            {/*        borderRadius: "8px",*/}
            {/*        cursor: "pointer"*/}
            {/*      }}>*/}
            {/*        <span className="suggestion-icon">🏠</span>*/}
            {/*        <span>Modern houses in Islamabad</span>*/}
            {/*      </div>*/}
            {/*      <div className="suggestion-item" style={{*/}
            {/*        display: "flex",*/}
            {/*        alignItems: "center",*/}
            {/*        gap: "10px",*/}
            {/*        padding: "0.75rem 1rem",*/}
            {/*        color: "rgba(255, 255, 255, 0.9)",*/}
            {/*        borderRadius: "8px",*/}
            {/*        cursor: "pointer"*/}
            {/*      }}>*/}
            {/*        <span className="suggestion-icon">🏙️</span>*/}
            {/*        <span>Properties in DHA Lahore</span>*/}
            {/*      </div>*/}
            {/*      <div className="suggestion-item" style={{*/}
            {/*        display: "flex",*/}
            {/*        alignItems: "center",*/}
            {/*        gap: "10px",*/}
            {/*        padding: "0.75rem 1rem",*/}
            {/*        color: "rgba(255, 255, 255, 0.9)",*/}
            {/*        borderRadius: "8px",*/}
            {/*        cursor: "pointer"*/}
            {/*      }}>*/}
            {/*        <span className="suggestion-icon">💰</span>*/}
            {/*        <span>Calculate construction costs</span>*/}
            {/*      </div>*/}
            {/*      <div className="suggestion-item" style={{*/}
            {/*        display: "flex",*/}
            {/*        alignItems: "center",*/}
            {/*        gap: "10px",*/}
            {/*        padding: "0.75rem 1rem",*/}
            {/*        color: "rgba(255, 255, 255, 0.9)",*/}
            {/*        borderRadius: "8px",*/}
            {/*        cursor: "pointer"*/}
            {/*      }}>*/}
            {/*        <span className="suggestion-icon">🏗️</span>*/}
            {/*        <span>Create custom floor plans</span>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</div>*/}

            {/* Feature Buttons */}
            <div
              className="feature-buttons"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                marginBottom: "2rem"
              }}
            >
              <a href="/ai-architect" className="feature-button" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                textAlign: "center",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                textDecoration: "none"
              }}>
                <div className="feature-icon" style={{
                  marginBottom: "0.75rem",
                  color: "#7c3aed"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontWeight: "600" }}>AI Design</span>
              </a>
              <a href="/market-analysis" className="feature-button" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                textAlign: "center",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                textDecoration: "none"
              }}>
                <div className="feature-icon" style={{
                  marginBottom: "0.75rem",
                  color: "#1d4ed8"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontWeight: "600" }}>Market Analysis</span>
              </a>
              <a href="/construction-estimator" className="feature-button" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                textAlign: "center",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                textDecoration: "none"
              }}>
                <div className="feature-icon" style={{
                  marginBottom: "0.75rem",
                  color: "#f59e0b"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontWeight: "600" }}>Price Forecast</span>
              </a>
              <a href="/infra-ai" className="feature-button" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                textAlign: "center",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                textDecoration: "none"
              }}>
                <div className="feature-icon" style={{
                  marginBottom: "0.75rem",
                  color: "#10b981"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.93 4.93L9.17 9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.83 14.83L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.83 9.17L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.83 9.17L18.36 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.93 19.07L9.17 14.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontWeight: "600" }}>Infra AI Chat</span>
              </a>
            </div>
          </div>

          {/* Right Side - Hero Image with improved shadow and effects */}
          <div
            className="hero-image-container"
            style={{
              flex: 1,
              maxWidth: "500px"
            }}
          >
            <div className="image-glass" style={{
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              padding: "20px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 100px rgba(124, 58, 237, 0.2)",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              {/* This is where your AIBuilding component would go.
                  I'm showing a placeholder SVG for demonstration */}
              <svg width="100%" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="60" y="100" width="180" height="200" rx="5" fill="#7c3aed" fillOpacity="0.2" stroke="white" strokeWidth="2"/>
                <rect x="100" y="30" width="100" height="70" rx="5" fill="#7c3aed" fillOpacity="0.3" stroke="white" strokeWidth="2"/>
                <rect x="80" y="130" width="40" height="60" rx="2" fill="white" fillOpacity="0.3"/>
                <rect x="130" y="130" width="40" height="60" rx="2" fill="white" fillOpacity="0.3"/>
                <rect x="180" y="130" width="40" height="60" rx="2" fill="white" fillOpacity="0.3"/>
                <rect x="80" y="200" width="40" height="60" rx="2" fill="white" fillOpacity="0.3"/>
                <rect x="130" y="200" width="40" height="60" rx="2" fill="white" fillOpacity="0.3"/>
                <rect x="180" y="200" width="40" height="60" rx="2" fill="white" fillOpacity="0.3"/>
                <circle cx="150" cy="100" r="10" fill="#f59e0b"/>
                <rect x="145" y="270" width="10" height="30" fill="#f59e0b" fillOpacity="0.8"/>
                <circle cx="250" cy="50" r="20" fill="#7c3aed" fillOpacity="0.1"/>
                <circle cx="50" cy="200" r="15" fill="#7c3aed" fillOpacity="0.1"/>

                {/* Add some floating dots for AI effect */}
                {[...Array(20)].map((_, i) => (
                  <circle
                    key={i}
                    cx={50 + Math.random() * 200}
                    cy={50 + Math.random() * 200}
                    r={1 + Math.random() * 2}
                    fill="white"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Section with improved visibility */}
        <div
          className="stats-container"
          style={{
            display: "flex",
            justifyContent: "space-around",
            background: "rgba(30, 41, 59, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "2rem",
            margin: "3rem auto 0",
            maxWidth: "800px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div className="stat" style={{ textAlign: "center" }}>
            <div className="stat-number" style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
              display: "inline-block"
            }}>
              5,000 <span>+</span>
            </div>
            <div className="stat-label" style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: "500"
            }}>AI-Generated Designs</div>
          </div>
          <div className="stat" style={{ textAlign: "center" }}>
            <div className="stat-number" style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
              display: "inline-block"
            }}>
              2,000 <span>+</span>
            </div>
            <div className="stat-label" style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: "500"
            }}>Satisfied Users</div>
          </div>
          <div className="stat" style={{ textAlign: "center" }}>
            <div className="stat-number" style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
              display: "inline-block"
            }}>
              98.0<span>%</span>
            </div>
            <div className="stat-label" style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: "500"
            }}>Prediction Accuracy</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImprovedHero;