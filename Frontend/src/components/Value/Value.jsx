// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionItemHeading,
//   AccordionItemButton,
//   AccordionItemPanel,
//   AccordionItemState,
// } from "react-accessible-accordion";
// import "react-accessible-accordion/dist/fancy-example.css";
// import {
//   MdOutlineArrowDropDown,
// } from "react-icons/md";
// import data from "../../utils/accordion.jsx";
// import "./Value.css";
//
// const Value = () => {
//   return (
//     <section id="value" className="value-section">
//       <div className="content-wrapper flexCenter value-container">
//         {/* Left Section: Image */}
//         <div className="value-left">
//           <div className="image-container">
//             <img src="./value.png" alt="Value" className="value-image" />
//           </div>
//         </div>
//
//         {/* Right Section: Text and Accordion */}
//         <div className="value-right flexColStart">
//           <h2 className="highlight-text">Why Choose InfraEstate AI?</h2>
//           <h3 className="main-heading">Empowering You with Real Estate Intelligence</h3>
//
//           <p className="description-text">
//             At InfraEstate AI, we prioritize your convenience and success. Our platform provides intelligent solutions to make property transactions seamless and stress-free.
//             <br />
//             We believe that finding the perfect property transforms your lifestyle, and we are here to make that happen.
//           </p>
//
//           {/* Accordion Section */}
//           <Accordion
//             className="accordion"
//             allowMultipleExpanded={false}
//             preExpanded={[0]}
//           >
//             {data.map((item, i) => {
//               const [className, setClassName] = useState(null);
//               return (
//                 <AccordionItem
//                   className={`accordion-item ${className}`}
//                   uuid={i}
//                   key={i}
//                 >
//                   <AccordionItemHeading>
//                     <AccordionItemButton className="accordion-button flexCenter">
//                       {/* Toggle Accordion State */}
//                       <AccordionItemState>
//                         {({ expanded }) =>
//                           expanded
//                             ? setClassName("expanded")
//                             : setClassName("collapsed")
//                         }
//                       </AccordionItemState>
//                       <div className="icon-container">{item.icon}</div>
//                       <span className="accordion-heading">{item.heading}</span>
//                       <MdOutlineArrowDropDown size={20} className="dropdown-icon" />
//                     </AccordionItemButton>
//                   </AccordionItemHeading>
//                   <AccordionItemPanel>
//                     <p className="accordion-text">{item.detail}</p>
//                   </AccordionItemPanel>
//                 </AccordionItem>
//               );
//             })}
//           </Accordion>
//         </div>
//       </div>
//     </section>
//   );
// };
//
// export default Value;


import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi";
import { MdAnalytics, MdCancel } from "react-icons/md";

// Updated accordion data with relevant AI real estate features
const accordionData = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    heading: "AI-Powered Design",
    detail: "Create personalized floor plans instantly with our AI technology. Generate multiple variants optimized for your plot size and budget with automatic dimension extraction and 3D visualization.",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    heading: "Advanced Market Analysis",
    detail: "Leverage our transformer-based PakReNOVate model for location-based analysis with embeddings, macroeconomic indicator integration, and interactive trend visualization to make smarter investment decisions.",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    heading: "Precise Price Forecasting",
    detail: "Predict future property prices with our hybrid parametric-ML estimation model offering 98.5% accuracy. Get detailed construction cost breakdowns and budget optimization suggestions.",
  },
];

const Value = () => {
  // Custom accordion item component
  const CustomAccordionItem = ({ item, index }) => {
    const [expanded, setExpanded] = useState(index === 0);
    
    return (
      <div 
        style={{
          marginBottom: "16px",
          borderRadius: "16px",
          overflow: "hidden",
          background: expanded ? "white" : "rgba(248, 250, 252, 0.8)",
          boxShadow: expanded 
            ? "0 15px 30px rgba(124, 58, 237, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)" 
            : "0 5px 15px rgba(0, 0, 0, 0.02)",
          transition: "all 0.3s ease",
          border: expanded 
            ? "1px solid rgba(124, 58, 237, 0.2)" 
            : "1px solid rgba(0, 0, 0, 0.05)",
          position: "relative"
        }}
      >
        <div 
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 24px",
            cursor: "pointer",
            transition: "background 0.3s ease",
            background: expanded ? "white" : "rgba(248, 250, 252, 0.8)",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            marginRight: "16px",
            background: expanded 
              ? "linear-gradient(90deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05))" 
              : "rgba(0, 0, 0, 0.03)",
            color: expanded ? "#7c3aed" : "#64748b"
          }}>
            {item.icon}
          </div>
          
          <span style={{
            flex: 1,
            fontSize: "18px",
            fontWeight: "600",
            color: expanded ? "#1e293b" : "#475569"
          }}>
            {item.heading}
          </span>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            color: expanded ? "#7c3aed" : "#94a3b8"
          }}>
            <MdOutlineArrowDropDown size={24} />
          </div>
        </div>
        
        {expanded && (
          <div style={{
            padding: "0 24px 24px 82px",
            lineHeight: "1.7",
            color: "#64748b",
            fontSize: "16px",
            position: "relative" // Added to ensure content doesn't affect layout
          }}>
            {item.detail}
          </div>
        )}
      </div>
    );
  };

  return (
    <section style={{
      padding: "100px 0",
      background: "white",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background elements */}
      <div style={{
        position: "absolute",
        top: "0",
        right: "0",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
        borderRadius: "50%",
        zIndex: "0"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
        borderRadius: "50%",
        zIndex: "0"
      }}></div>
      
      <div style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start", // Changed from center to flex-start
        gap: "60px",
        position: "relative",
        zIndex: "1"
      }}>
        {/* Left side - Image */}
        <div style={{
          flex: "1",
          maxWidth: "550px"
        }}>
          <div style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.1)",
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)",
              mixBlendMode: "multiply",
              zIndex: 1
            }}></div>
            
            <img 
              src="./value.png" 
              alt="Value" 
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                transform: "scale(1.01)", // Slightly overflow to avoid white gaps
              }} 
            />
            
            {/* Decorative elements */}
            <div style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "12px 20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              zIndex: "2",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #7c3aed, #6d28d9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>AI-Verified</div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>98.5% Accuracy</div>
              </div>
            </div>
            
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "12px 20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              zIndex: "2"
            }}>
              <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px", marginBottom: "4px" }}>
                Trusted by Professionals
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < 4 ? "#f59e0b" : "none"} xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
                <span style={{ color: "#64748b", fontSize: "12px", marginLeft: "6px" }}>4.8/5</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Content */}
        <div style={{
          flex: "1"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(90deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05))",
            color: "#7c3aed",
            padding: "8px 16px",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "1.5rem"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 14.5L5 16.5V9.5L12 5.25L19 9.5V16.5L15.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5.25V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12L12 10L9 12V16L12 18L15 16V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            WHY CHOOSE US
          </div>
          
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "1.5rem",
            lineHeight: "1.2",
            position: "relative"
          }}>
            Empowering You with<br />
            <span style={{
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Real Estate Intelligence</span>
            
            <div style={{
              position: "absolute",
              top: "calc(100% + 5px)",
              left: "0",
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              borderRadius: "4px"
            }}></div>
          </h2>
          
          <p style={{
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#64748b",
            marginBottom: "2.5rem",
            maxWidth: "90%"
          }}>
            At InfraEstate AI, we prioritize your convenience and success. Our platform provides intelligent 
            solutions to make property transactions seamless and stress-free. We believe that finding the 
            perfect property transforms your lifestyle, and we are here to make that happen with cutting-edge 
            AI technology.
          </p>
          
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "1.5rem"
            }}>What sets us apart:</h3>
            
            {/* Accordion items */}
            {accordionData.map((item, index) => (
              <CustomAccordionItem key={index} item={item} index={index} />
            ))}
          </div>
          
          <div style={{
            marginTop: "2.5rem",
            display: "flex",
            gap: "1rem"
          }}>
            <button style={{
              background: "linear-gradient(90deg, #7c3aed, #6d28d9)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              Learn More
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button style={{
              background: "transparent",
              color: "#1e293b",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Value;