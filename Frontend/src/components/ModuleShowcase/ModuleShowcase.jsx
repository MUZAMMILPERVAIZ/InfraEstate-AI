import React, { useState } from "react";
import "./ModuleShowcase.css";
import { Container, Grid, Typography, Box, Paper, Button, Tabs, Tab } from "@mui/material";
import {
  Architecture,
  Analytics,
  PriceChange,
  SmartToy,
  ArrowForward
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const ModuleShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const modules = [
    {
      id: 0,
      name: "Generative House Footprint Design",
      icon: <Architecture />,
      description: "Create personalized floor plans instantly based on your requirements, with AI-generated variants optimized for your plot size and budget.",
      image: "./module-ghfd.png", // Ensure this image exists in your public folder
      features: [
        "Multi-variant floor plan generation",
        "Automatic dimension extraction",
        "3D visualization capabilities",
        "Interior styling pipeline"
      ],
      link: "/ai-architect"
    },
    {
      id: 1,
      name: "Market Analysis",
      icon: <Analytics />,
      description: "Leverage our transformer-based PakReNOVate model to analyze market trends and get data-driven insights for smarter investments.",
      image: "./module-market.png", // Ensure this image exists
      features: [
        "Location-based analysis with embeddings",
        "Macroeconomic indicator integration",
        "Interactive trend visualization",
        "Investment opportunity recommendations"
      ],
      link: "/market-analysis"
    },
    {
      id: 2,
      name: "Price Forecasting",
      icon: <PriceChange />,
      description: "Predict future property prices and accurately estimate construction costs with our hybrid AI forecasting model.",
      image: "./module-forecast.png", // Ensure this image exists
      features: [
        "Hybrid parametric-ML estimation",
        "Detailed construction cost breakdown",
        "Budget optimization suggestions",
        "High-accuracy predictions (98.5%)"
      ],
      link: "/construction-estimator"
    },
    {
      id: 3,
      name: "Infra AI Assistant",
      icon: <SmartToy />,
      description: "Your personal real estate advisor, answering questions about properties, legal processes, and offering personalized recommendations.",
      image: "./module-infra-ai.png", // Ensure this image exists
      features: [
        "Intelligent property search",
        "Legal and process guidance",
        "Architectural advice",
        "Multi-session conversation memory"
      ],
      link: "/infra-ai"
    }
  ];

  return (
    <section className="module-showcase">
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box className="section-header">
          <Box className="badge-container">
            <Typography variant="overline" className="section-badge">
              CORE FEATURES
            </Typography>
          </Box>
          <Typography variant="h2" className="section-title">
            AI-Powered Modules
          </Typography>
          <Typography variant="body1" className="section-subtitle">
            Explore our comprehensive suite of AI-powered tools designed to revolutionize your real estate experience
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper elevation={0} className="module-tabs-wrapper">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            className="module-tabs"
          >
            {modules.map((module) => (
              <Tab
                key={module.id}
                icon={module.icon}
                label={module.name.split(' ').slice(-2).join(' ')}
                className="module-tab"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Module Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="module-content"
          >
            <Grid container spacing={4} alignItems="center">
              {/* Left Side - Text */}
              <Grid item xs={12} md={6}>
                <Box className="module-info">
                  <Typography variant="h3" className="module-title">
                    {modules[activeTab].name}
                  </Typography>
                  <Typography variant="body1" className="module-description">
                    {modules[activeTab].description}
                  </Typography>

                  <Box className="feature-list">
                    {modules[activeTab].features.map((feature, index) => (
                      <Box key={index} className="feature-item">
                        <Box className="feature-bullet"></Box>
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    component={Link}
                    to={modules[activeTab].link}
                    variant="contained"
                    endIcon={<ArrowForward />}
                    className="explore-button"
                  >
                    Explore {modules[activeTab].name.split(' ').slice(-2).join(' ')}
                  </Button>
                </Box>
              </Grid>

              {/* Right Side - Image */}
              <Grid item xs={12} md={6}>
                <Box className="module-image-container">
                  <Paper elevation={3} className="module-image-wrapper">
                    <img
                      src={modules[activeTab].image}
                      alt={modules[activeTab].name}
                      className="module-image"
                    />
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
};

export default ModuleShowcase;