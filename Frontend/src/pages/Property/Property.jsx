import React, { useState, useContext } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import "./Property.css";

// MUI Components
import {
  Typography,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TimelineIcon from '@mui/icons-material/Timeline';
import MoneyIcon from '@mui/icons-material/Money';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

// Markdown
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Context
import UserDetailContext from "../../context/UserDetailContext";

// API Endpoints
const API_BASE_URL = "http://127.0.0.1:8080";

// Function to fetch property details
const fetchPropertyDetails = async (propertyId) => {
  const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch property details");
  }
  return response.json();
};

// Function to fetch property analysis
const fetchAnalysisReport = async (payload) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User is not logged in");
  }

  const response = await fetch(`${API_BASE_URL}/generate-report/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to generate analysis report");
  }

  return response.json();
};

// Helper function to calculate growth percentage
const calculateGrowth = (futurePrice, currentPrice) => {
  const growth = ((futurePrice - currentPrice) / currentPrice) * 100;
  return growth.toFixed(2);
};

// Risk indicator component
const RiskIndicator = ({ level }) => {
  let color, icon, text;

  switch(level.toLowerCase()) {
    case 'high':
      color = "error";
      icon = <WarningIcon />;
      text = 'High Risk';
      break;
    case 'medium':
      color = "warning";
      icon = <ErrorIcon />;
      text = 'Medium Risk';
      break;
    case 'low':
      color = "success";
      icon = <CheckCircleIcon />;
      text = 'Low Risk';
      break;
    default:
      color = "default";
      icon = <ErrorIcon />;
      text = 'Risk Assessment';
  }

  return (
    <Chip
      icon={icon}
      label={text}
      color={color}
      className="prop-risk-chip"
    />
  );
};

const Property = () => {
  const { propertyId } = useParams();
  const { userDetails } = useContext(UserDetailContext);
  const [analysisData, setAnalysisData] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success"
  });

  // Fetch property details
  const { data, isLoading, isError } = useQuery(
    ["property", propertyId],
    () => fetchPropertyDetails(propertyId),
    { enabled: !!propertyId }
  );

  // Analysis mutation
  const { mutate: generateAnalysis, isLoading: isGeneratingAnalysis } = useMutation(
    () =>
      fetchAnalysisReport({
        location: data.location,
        city: data.city,
        size: data.size,
        bedrooms: data.bedrooms,
        baths: data.baths,
        current_price: data.price,
      }),
    {
      onSuccess: (data) => {
        setAnalysisData(data);
        showNotification("Analysis generated successfully", "success");
      },
      onError: (error) => {
        console.error("Error generating analysis:", error.message);
        showNotification("Failed to generate analysis. Please try again.", "error");
      },
    }
  );

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Download chart image
  const downloadImage = (imageUrl, filename) => {
    fetch(`${API_BASE_URL}/${imageUrl}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename || 'chart.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification(`Downloaded ${filename}`, "success");
      })
      .catch(error => {
        console.error('Error downloading image:', error);
        showNotification('Failed to download image', 'error');
      });
  };

  if (isLoading) {
    return (
      <div className="prop-loader-overlay">
        <div className="prop-loader-container">
          <div className="prop-loader">
            <div className="prop-market-loader">
              <div className="prop-market-graph">
                <div className="prop-market-bar prop-market-bar-1"></div>
                <div className="prop-market-bar prop-market-bar-2"></div>
                <div className="prop-market-bar prop-market-bar-3"></div>
                <div className="prop-market-bar prop-market-bar-4"></div>
                <div className="prop-market-bar prop-market-bar-5"></div>
                <div className="prop-market-line"></div>
                <div className="prop-market-trend"></div>
              </div>
            </div>
            <Typography variant="h6" className="prop-loader-title">
              Loading Property Data
            </Typography>
            <Typography variant="body2" className="prop-loader-subtitle">
              We're retrieving detailed information about this property
            </Typography>
            <div className="prop-loading-progress">
              <div className="prop-loading-progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="prop-error-container">
        <div className="prop-error-icon">
          <ErrorIcon fontSize="large" />
        </div>
        <Typography variant="h5" color="error">
          Error loading property details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.history.back()}
          className="prop-back-button"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const { location, city, price, size, bedrooms, baths, type, image_link, owner_email } = data;
  const imageUrl = `${API_BASE_URL}/${image_link}`;

  return (
    <div className="prop-container">
      <div className="prop-content">
        {/* Header with Gradient Title */}
        <div className="prop-header">
          <Typography variant="h2" className="prop-title">
            <span className="prop-title-gradient">
              {analysisData ? "Property Analysis" : "Property Overview"}
            </span>
          </Typography>
          <Typography variant="subtitle1" className="prop-subtitle">
            {analysisData
              ? "Comprehensive real estate market analysis and investment insights"
              : "Detailed information about this property and its potential"
            }
          </Typography>
        </div>

        {/* Main Property Card - Hero Section */}
        <div className="prop-hero-section">
          <div className="prop-image-section">
            <img src={imageUrl} alt={location} className="prop-main-image" />
            <div className="prop-price-tag">
              <MoneyIcon />
              <span>PKR {price.toLocaleString()}</span>
            </div>
          </div>

          <div className="prop-details-section">
            <Typography variant="h4" className="prop-property-title">{location}</Typography>
            <Typography variant="subtitle1" className="prop-location">
              <LocationOnIcon /> {city}
            </Typography>

            <div className="prop-stats-grid">
              <div className="prop-stat-item">
                <div className="prop-stat-icon">
                  <HomeIcon />
                </div>
                <div className="prop-stat-details">
                  <Typography variant="body2" className="prop-stat-label">Property Type</Typography>
                  <Typography variant="h6" className="prop-stat-value">{type}</Typography>
                </div>
              </div>

              <div className="prop-stat-item">
                <div className="prop-stat-icon">
                  <SquareFootIcon />
                </div>
                <div className="prop-stat-details">
                  <Typography variant="body2" className="prop-stat-label">Size</Typography>
                  <Typography variant="h6" className="prop-stat-value">{size} Marla</Typography>
                </div>
              </div>

              <div className="prop-stat-item">
                <div className="prop-stat-icon">
                  <BedIcon />
                </div>
                <div className="prop-stat-details">
                  <Typography variant="body2" className="prop-stat-label">Bedrooms</Typography>
                  <Typography variant="h6" className="prop-stat-value">{bedrooms}</Typography>
                </div>
              </div>

              <div className="prop-stat-item">
                <div className="prop-stat-icon">
                  <BathtubIcon />
                </div>
                <div className="prop-stat-details">
                  <Typography variant="body2" className="prop-stat-label">Bathrooms</Typography>
                  <Typography variant="h6" className="prop-stat-value">{baths}</Typography>
                </div>
              </div>
            </div>

            <div className="prop-contact-row">
              <EmailIcon />
              <Typography variant="body1" className="prop-contact-email">
                <a href={`mailto:${owner_email}`}>{owner_email}</a>
              </Typography>
            </div>

            <Button
              variant="contained"
              startIcon={<AnalyticsIcon />}
              className="prop-analyze-button"
              onClick={() => generateAnalysis()}
              disabled={isGeneratingAnalysis}
              size="large"
              fullWidth
            >
              {isGeneratingAnalysis ? 'Generating Analysis...' : 'Generate Investment Analysis'}
            </Button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisData && (
          <div className="prop-analysis-results">
            {/* Risk Analysis Card */}
            <div className="prop-card prop-risk-card">
              <div className="prop-card-header">
                <div className="prop-card-title-group">
                  <TimelineIcon className="prop-card-icon" />
                  <Typography variant="h5" className="prop-card-title">
                    Risk Analysis
                  </Typography>
                </div>
                {/*<RiskIndicator level="medium" /> /!* This would be dynamic in a real implementation *!/*/}
              </div>
              <div className="prop-card-content">
                <div className="prop-markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {analysisData.report.replace(/\\n/g, '\n')}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Forecast Charts */}
            <div className="prop-card prop-chart-card">
              <div className="prop-card-header">
                <div className="prop-card-title-group">
                  <TrendingUpIcon className="prop-card-icon" />
                  <Typography variant="h5" className="prop-card-title">
                    Price Forecast Charts
                  </Typography>
                </div>
              </div>
              <div className="prop-card-content">
                <div className="prop-charts-container">
                  {analysisData.chart_urls.map((chartUrl, index) => (
                    <div key={index} className="prop-chart-wrapper">
                      <div className="prop-chart-title-bar">
                        <Typography variant="h6">Forecast Chart {index + 1}</Typography>
                        <Button
                          className="prop-chart-download-button"
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => downloadImage(chartUrl, `forecast_chart_${index + 1}.png`)}
                        >
                          Download
                        </Button>
                      </div>
                      <div className="prop-chart-image-container">
                        <img
                          src={`${API_BASE_URL}/${chartUrl}`}
                          alt={`Forecast Chart ${index + 1}`}
                          className="prop-chart-image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Forecast Table */}
            <div className="prop-card prop-chart-card">
              <div className="prop-card-header">
                <div className="prop-card-title-group">
                  <MoneyIcon className="prop-card-icon" />
                  <Typography variant="h5" className="prop-card-title">
                    Price Forecast
                  </Typography>
                </div>
              </div>
              <div className="prop-card-content">
                <TableContainer component={Paper} className="prop-table-container">
                  <Table className="prop-forecast-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell>Forecasted Price</TableCell>
                        <TableCell>Growth</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(analysisData.price_forecast).map(([year, forecastedPrice]) => {
                        const growth = calculateGrowth(forecastedPrice, price);
                        const isPositive = parseFloat(growth) >= 0;

                        return (
                          <TableRow key={year}>
                            <TableCell>{year}</TableCell>
                            <TableCell>PKR {forecastedPrice.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className={`prop-growth ${isPositive ? 'prop-positive' : 'prop-negative'}`}>
                                {isPositive ? (
                                  <TrendingUpIcon fontSize="small" />
                                ) : (
                                  <TrendingDownIcon fontSize="small" />
                                )}
                                <span>{isPositive ? '+' : ''}{growth}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* Related News */}
            <div className="prop-card prop-chart-card">
              <div className="prop-card-header">
                <div className="prop-card-title-group">
                  <NewspaperIcon className="prop-card-icon" />
                  <Typography variant="h5" className="prop-card-title">
                    Market News Impact
                  </Typography>
                </div>
              </div>
              <div className="prop-card-content">
                <div className="prop-news-container">
                  {analysisData.news.map((newsGroup, groupIndex) => (
                    <div key={groupIndex} className="prop-news-group">
                      <div className="prop-news-group-header">
                        <ArticleIcon className="prop-news-group-icon" />
                        <Typography variant="h6" className="prop-news-group-title">
                          Market Trend {groupIndex + 1}
                        </Typography>
                      </div>
                      <div className="prop-news-items">
                        {newsGroup.map((newsItem, itemIndex) => (
                          <div key={itemIndex} className="prop-news-item">
                            <div className="prop-news-item-content">
                              <LightbulbIcon className="prop-news-item-icon" />
                              <Typography variant="body1"><ReactMarkdown>{newsItem}</ReactMarkdown></Typography>
                            </div>
                            <div className="prop-news-impact">
                              {/*<Chip*/}
                              {/*  label={itemIndex % 2 === 0 ? "Positive Impact" : "Neutral Impact"}*/}
                              {/*  color={itemIndex % 2 === 0 ? "success" : "default"}*/}
                              {/*  size="small"*/}
                              {/*  className="prop-impact-chip"*/}
                              {/*/>*/}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="prop-footer">
          <Typography variant="body2" className="prop-footer-text">
            &copy; 2025 InfraEstate AI. All rights reserved. Powered by advanced AI technology.
          </Typography>
        </footer>

        {/* Loading Overlay */}
        {isGeneratingAnalysis && (
          <div className="prop-loading-overlay">
            <div className="prop-loading-container">
              <div className="prop-loading-animation">
                <div className="prop-market-analysis-loader">
                  <div className="prop-circle-container">
                    <div className="prop-analysis-circle"></div>
                    <div className="prop-analysis-bar-1"></div>
                    <div className="prop-analysis-bar-2"></div>
                    <div className="prop-analysis-bar-3"></div>
                    <div className="prop-analysis-line"></div>
                    <div className="prop-analysis-arrow up"></div>
                    <div className="prop-analysis-arrow down"></div>
                  </div>
                </div>
              </div>
              <h3 className="prop-loading-title">
                Generating Market Analysis
              </h3>
              <p className="prop-loading-description">
                Our AI is evaluating market trends, property values, and investment potential. This may take a minute...
              </p>
              <div className="prop-loading-progress">
                <div className="prop-loading-progress-bar"></div>
              </div>
            </div>
          </div>
        )}

        {/* Notification System */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type}
            className="prop-notification"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Property;