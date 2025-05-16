import React from "react";
import logo from "../../assets/header-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Footer navigation links
  const footerLinks = {
    company: [
      { label: "About Us", url: "/about" },
      { label: "Careers", url: "/careers" },
      { label: "Blog", url: "/blog" },
      { label: "Press", url: "/press" }
    ],
    services: [
      { label: "AI Design", url: "/ai-architect" },
      { label: "Market Analysis", url: "/market-analysis" },
      { label: "Price Forecasting", url: "/construction-estimator" },
      { label: "Infra AI Chat", url: "/infra-ai" }
    ],
    support: [
      { label: "Help Center", url: "/help" },
      { label: "Contact Us", url: "/contact-us" },
      { label: "FAQ", url: "/faq" },
      { label: "Community", url: "/community" }
    ],
    legal: [
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Terms of Service", url: "/terms" },
      { label: "Cookie Policy", url: "/cookies" },
      { label: "Licenses", url: "/licenses" }
    ]
  };

  // Social media links
  const socialLinks = [
    { 
      name: "Facebook", 
      url: "https://facebook.com", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: "Twitter", 
      url: "https://twitter.com", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: "Instagram", 
      url: "https://instagram.com", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: "LinkedIn", 
      url: "https://linkedin.com", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  // Features highlight
  const features = [
    "AI-Powered Design",
    "Market Analysis",
    "Price Forecasting",
    "Personalized Recommendations"
  ];

  return (
    <footer style={{
      background: "#111827",
      color: "white",
      position: "relative",
      overflow: "hidden",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
    }}>
      {/* Background gradient elements */}
      <div style={{
        position: "absolute",
        width: "40rem",
        height: "40rem",
        background: "rgba(124, 58, 237, 0.03)",
        filter: "blur(100px)",
        borderRadius: "50%",
        top: "30%",
        left: "-20rem",
        zIndex: "0"
      }}></div>
      
      <div style={{
        position: "absolute",
        width: "40rem",
        height: "40rem",
        background: "rgba(245, 158, 11, 0.03)",
        filter: "blur(100px)",
        borderRadius: "50%",
        bottom: "-20rem",
        right: "-10rem",
        zIndex: "0"
      }}></div>
      
      <div style={{
        position: "relative",
        zIndex: "1"
      }}>
        {/* Main Footer Content */}
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 2rem 3rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "3rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
        }}>
          {/* Company Info Column */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            {/* Logo */}
            <a href="/" style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              marginBottom: "1rem"
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                background: "linear-gradient(135deg, #7c3aed, #f59e0b)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column"
              }}>
                <span style={{
                  fontWeight: "800",
                  fontSize: "20px",
                  background: "linear-gradient(to right, #ffffff, #e2e8f0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  InfraEstate
                </span>
                <span style={{
                  fontWeight: "700",
                  fontSize: "12px",
                  background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "1px"
                }}>
                  AI PLATFORM
                </span>
              </div>
            </a>
            
            <p style={{
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: "1.7",
              marginBottom: "1.5rem"
            }}>
              Our vision is to revolutionize the real estate industry through AI-powered solutions, making property transactions seamless and stress-free.
            </p>
            
            {/* Social Links */}
            <div style={{
              display: "flex",
              gap: "12px",
              marginBottom: "1rem"
            }}>
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    textDecoration: "none"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(124, 58, 237, 0.2)";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.target.style.color = "rgba(255, 255, 255, 0.7)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links Columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column" }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "1.5rem",
                color: "white",
                position: "relative",
                paddingBottom: "10px"
              }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <div style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "30px",
                  height: "2px",
                  background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
                  borderRadius: "2px"
                }}></div>
              </h3>
              
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                {links.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.url}
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "white";
                        e.target.style.paddingLeft = "5px";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "rgba(255, 255, 255, 0.7)";
                        e.target.style.paddingLeft = "0px";
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

            {/* App badges */}

        </div>
        
        {/* Bottom Bar */}
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div style={{
            display: "flex",
            gap: "20px",
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)"
          }}>
            <span>© {currentYear} InfraEstate AI. All rights reserved.</span>
          </div>
          
          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.05)"
              }}>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;