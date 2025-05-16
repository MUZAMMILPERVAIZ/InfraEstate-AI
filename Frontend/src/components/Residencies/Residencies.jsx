import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { PuffLoader } from "react-spinners";
import useProperties from "../../hooks/useProperties";

// Enhanced PropertyCard for this component
const EnhancedPropertyCard = ({ property }) => {
  const { id, location, city, price, image_link } = property;

  if (!id) {
    console.error("Property ID is missing for property:", property);
    return null;
  }

  const imageUrl = `http://127.0.0.1:8080/${image_link}`;

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        position: "relative",
        height: "200px",
        overflow: "hidden"
      }}>
        <img 
          src={imageUrl} 
          alt={location} 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease"
          }}
        />
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "linear-gradient(90deg, rgba(29, 78, 216, 0.8), rgba(124, 58, 237, 0.8))",
          color: "white",
          padding: "6px 12px",
          borderRadius: "50px",
          fontSize: "12px",
          fontWeight: "600",
          backdropFilter: "blur(4px)"
        }}>
          Featured
        </div>
      </div>
      
      <div style={{
        padding: "20px",
        flex: "1",
        display: "flex",
        flexDirection: "column"
      }}>
        <h3 style={{
          fontSize: "18px",
          fontWeight: "700",
          marginTop: "0",
          marginBottom: "8px",
          color: "white"
        }}>{location}</h3>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "6px", color: "rgba(255, 255, 255, 0.6)" }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 10a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>{city}</span>
        </div>
        
        <div style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{
            background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "18px",
            fontWeight: "800"
          }}>
            PKR {price.toLocaleString()}
          </div>
          
          <a href={`/properties/${id}`} style={{
            display: "inline-flex",
            alignItems: "center",
            background: "linear-gradient(90deg, #7c3aed, #6d28d9)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)"
          }}>
            View Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "8px" }}>
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Navigation buttons for the slider
const SlideNavButtons = () => {
  const swiper = useSwiper();
  return (
    <div style={{
      position: "absolute",
      display: "flex",
      gap: "10px",
      top: "-4rem",
      right: "0",
      zIndex: "10"
    }}>
      <button 
        onClick={() => swiper.slidePrev()}
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          color: "white",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button 
        onClick={() => swiper.slideNext()}
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(90deg, #7c3aed, #6d28d9)",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
          transition: "all 0.3s ease"
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

// Main Residencies component
const Residencies = () => {
  const { data, isError, isLoading } = useProperties();

  // Slider settings
  const sliderSettings = {
    slidesPerView: 1,
    spaceBetween: 30,
    breakpoints: {
      480: {
        slidesPerView: 1,
      },
      600: {
        slidesPerView: 2,
      },
      750: {
        slidesPerView: 3,
      },
      1100: {
        slidesPerView: 4,
      },
    }
  };

  if (isError) {
    return (
      <div style={{
        padding: "4rem 0",
        textAlign: "center",
        color: "white"
      }}>
        <span>Error while fetching properties data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        padding: "4rem 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh"
      }}>
        <PuffLoader color="#7c3aed" size={80} />
      </div>
    );
  }

  return (
    <div style={{
      padding: "6rem 0",
      background: "#111827",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background gradient */}
      <div style={{
        position: "absolute",
        width: "30rem",
        height: "30rem",
        background: "rgba(124, 58, 237, 0.05)",
        filter: "blur(100px)",
        borderRadius: "50%",
        bottom: "-15rem",
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
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 2rem",
        position: "relative",
        zIndex: "1"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "3rem"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(90deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
            color: "#f59e0b",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "0.875rem",
            marginBottom: "1rem"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            BEST CHOICES
          </div>
          
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "white",
            marginBottom: "1rem",
            position: "relative"
          }}>
            Popular Residencies
            <div style={{
              position: "absolute",
              bottom: "-10px",
              left: "0",
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              borderRadius: "4px"
            }}></div>
          </h2>
          
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            maxWidth: "600px",
            fontSize: "1.125rem",
            lineHeight: "1.6"
          }}>
            Discover our handpicked selection of premium properties in prime locations 
            designed for modern living
          </p>
        </div>
        
        <div style={{
          position: "relative",
          overflow: "visible",
          marginBottom: "2rem"
        }}>
          <Swiper {...sliderSettings}>
            <SlideNavButtons />
            {data.slice(0, 8).map((property, index) => (
              <SwiperSlide key={index} style={{ height: "auto" }}>
                <EnhancedPropertyCard property={property} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "3rem"
        }}>
          <a href="/properties" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            padding: "12px 24px",
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "all 0.3s ease"
          }}>
            View All Properties
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Residencies;