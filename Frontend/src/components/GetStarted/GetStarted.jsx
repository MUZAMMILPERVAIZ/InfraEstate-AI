import React from "react";

const GetStarted = () => {
  return (
    <section style={{
      padding: "6rem 0",
      background: "#111827",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background gradient elements */}
      <div style={{
        position: "absolute",
        width: "30rem",
        height: "30rem",
        background: "rgba(124, 58, 237, 0.05)",
        filter: "blur(100px)",
        borderRadius: "50%",
        top: "-15rem",
        right: "-10rem",
        zIndex: "0"
      }}></div>
      
      <div style={{
        position: "absolute",
        width: "25rem",
        height: "25rem",
        background: "rgba(245, 158, 11, 0.05)",
        filter: "blur(100px)",
        borderRadius: "50%",
        bottom: "-10rem",
        left: "-10rem",
        zIndex: "0"
      }}></div>
      
      {/* Background pattern */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundImage: "radial-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        zIndex: "0",
        opacity: "0.3"
      }}></div>
      
      <div style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 2rem",
        position: "relative",
        zIndex: "1"
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(29, 78, 216, 0.2))",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          overflow: "hidden",
          position: "relative",
          padding: "4rem 3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
        }}>
          {/* Decorative elements */}
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: "-1"
          }}>
            <div style={{
              position: "absolute",
              top: "-50px",
              left: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(124, 58, 237, 0))",
              filter: "blur(30px)"
            }}></div>
            
            <div style={{
              position: "absolute",
              bottom: "-80px",
              right: "-50px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0))",
              filter: "blur(30px)"
            }}></div>
            
            {/* Animated floating particles */}
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#7c3aed" : "#f59e0b",
                opacity: "0.1",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
          
          {/* Content */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "8px 16px",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "1.5rem",
            color: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            JOIN INFRAESTATE AI TODAY
          </div>
          
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: "800",
            background: "linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "1.5rem",
            textAlign: "center",
            lineHeight: "1.2"
          }}>
            Transform Your Real Estate Experience<br />With <span style={{ 
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>AI Power</span>
          </h2>
          
          <p style={{
            fontSize: "1.125rem",
            color: "rgba(255, 255, 255, 0.7)",
            maxWidth: "700px",
            marginBottom: "3rem",
            lineHeight: "1.6"
          }}>
            Subscribe and discover premium properties at competitive prices. Let our AI-driven platform find your perfect property match and guide you through every step of your real estate journey.
          </p>
          
          <div style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <a href="/properties" style={{
              background: "linear-gradient(90deg, #7c3aed, #6d28d9)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "18px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
              transition: "all 0.3s ease",
              border: "none"
            }}>
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            
            <a href="/contact-us" style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "18px",
              textDecoration: "none",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.3s ease"
            }}>
              Contact Us
            </a>
          </div>
          
          {/* Features highlight */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            marginTop: "4rem",
            flexWrap: "wrap"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#7c3aed" }}>
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>AI-Powered Design</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#7c3aed" }}>
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>Accurate Forecasting</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#7c3aed" }}>
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>Market Analysis</span>
            </div>
          </div>
          
          {/* Animation keyframes would normally go in a CSS file */}
          <style>{`
            @keyframes float {
              0% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
              100% { transform: translateY(0) rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;