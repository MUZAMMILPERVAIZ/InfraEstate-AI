import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Properties.css";

// MUI Components
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  InputBase,
  IconButton,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Skeleton,
  Grid,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ErrorIcon from '@mui/icons-material/Error';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';

const API_BASE_URL = "http://127.0.0.1:8080";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCity, setFilterCity] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success"
  });

  // Get unique cities and types for filters
  const cities = properties.length > 0
    ? ["all", ...new Set(properties.map(property => property.city))]
    : ["all"];

  const propertyTypes = properties.length > 0
    ? ["all", ...new Set(properties.map(property => property.type))]
    : ["all"];

  // Price range options
  const priceRangeOptions = [
    { value: "all", label: "All Prices" },
    { value: "0-5000000", label: "Under 5M" },
    { value: "5000000-10000000", label: "5M - 10M" },
    { value: "10000000-20000000", label: "10M - 20M" },
    { value: "20000000+", label: "Over 20M" }
  ];

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/properties`);
        setProperties(response.data);
        setFilteredProperties(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching properties. Please try again later.");
        setLoading(false);
      }
    };

    fetchProperties();

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('propertyFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Apply filters and sorting whenever any filter/sort option changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchQuery, sortBy, filterCity, filterType, priceRange, properties]);

  // Function to filter and sort properties
  const applyFiltersAndSort = () => {
    let results = [...properties];

    // Apply search query
    if (searchQuery) {
      results = results.filter(property =>
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply city filter
    if (filterCity !== "all") {
      results = results.filter(property => property.city === filterCity);
    }

    // Apply type filter
    if (filterType !== "all") {
      results = results.filter(property => property.type === filterType);
    }

    // Apply price range filter
    if (priceRange !== "all") {
      if (priceRange.includes("+")) {
        const minPrice = parseInt(priceRange.split("+")[0]);
        results = results.filter(property => property.price >= minPrice);
      } else {
        const [minPrice, maxPrice] = priceRange.split("-").map(Number);
        results = results.filter(property =>
          property.price >= minPrice && property.price <= maxPrice
        );
      }
    }

    // Apply sorting
    switch(sortBy) {
      case "price-low-high":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Assuming there's an id or date field - using id as proxy for newest
        results.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        results.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }

    setFilteredProperties(results);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFiltersAndSort();
  };

  // Toggle favorite status for a property
  const toggleFavorite = (propertyId) => {
    let newFavorites;

    if (favorites.includes(propertyId)) {
      newFavorites = favorites.filter(id => id !== propertyId);
      showNotification("Removed from favorites", "info");
    } else {
      newFavorites = [...favorites, propertyId];
      showNotification("Added to favorites", "success");
    }

    setFavorites(newFavorites);
    localStorage.setItem('propertyFavorites', JSON.stringify(newFavorites));
  };

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

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setFilterCity("all");
    setFilterType("all");
    setPriceRange("all");
    setFilteredProperties(properties);
    showNotification("Filters reset", "info");
  };

  // Render property card
  const renderPropertyCard = (property) => {
    const isFavorite = favorites.includes(property.id);
    return (
      <Card className="pe-property-card" key={property.id}>
        <div className="pe-card-favorite">
          <IconButton
            className={`pe-favorite-button ${isFavorite ? 'pe-favorite-active' : ''}`}
            onClick={() => toggleFavorite(property.id)}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </div>
        <CardMedia
          component="img"
          image={`${API_BASE_URL}/${property.image_link}`}
          alt={property.title || property.location}
          className="pe-card-media"
        />
        <div className="pe-price-tag">
          <Typography variant="body1">PKR {property.price.toLocaleString()}</Typography>
        </div>
        <Chip
          label={property.type || "Residential"}
          className="pe-property-type-chip"
        />
        <CardContent className="pe-card-content">
          <Typography variant="h6" className="pe-card-title">
            {property.title || property.location}
          </Typography>

          <div className="pe-location">
            <LocationOnIcon className="pe-location-icon" />
            <Typography variant="body2">
              {property.location && property.city ? `${property.location}, ${property.city}` : (property.location || property.city || "Location not specified")}
            </Typography>
          </div>

          <Divider className="pe-divider" />

          <div className="pe-property-features">
            {property.bedrooms && (
              <div className="pe-feature">
                <BedIcon className="pe-feature-icon" />
                <Typography variant="body2">{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</Typography>
              </div>
            )}

            {property.baths && (
              <div className="pe-feature">
                <BathtubIcon className="pe-feature-icon" />
                <Typography variant="body2">{property.baths} {property.baths === 1 ? "Bath" : "Baths"}</Typography>
              </div>
            )}

            {property.size && (
              <div className="pe-feature">
                <SquareFootIcon className="pe-feature-icon" />
                <Typography variant="body2">{property.size} Marla</Typography>
              </div>
            )}
          </div>

          <Link to={`/properties/${property.id}`} className="pe-view-details-link">
            <Button
              variant="contained"
              className="pe-view-button"
              startIcon={<VisibilityIcon />}
              fullWidth
            >
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  // Render loading skeleton cards
  const renderSkeletonCards = () => {
    return Array(6).fill().map((_, index) => (
      <Card className="pe-property-card" key={`skeleton-${index}`}>
        <Skeleton variant="rectangular" className="pe-card-media-skeleton" />
        <CardContent>
          <Skeleton variant="text" height={32} style={{ marginBottom: 8 }} />
          <Skeleton variant="text" height={20} width="60%" style={{ marginBottom: 16 }} />
          <Skeleton variant="text" height={20} style={{ marginBottom: 8 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </div>
          <Skeleton variant="rectangular" height={36} />
        </CardContent>
      </Card>
    ));
  };

  // If there's an error fetching properties
  if (error && !loading) {
    return (
      <div className="pe-error-container">
        <ErrorIcon className="pe-error-icon" />
        <Typography variant="h5" color="error">{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          className="pe-retry-button"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="pe-container">
      <div className="pe-content">
        {/* Header */}
        <div className="pe-header">
          <Typography variant="h2" className="pe-title">
            <span className="pe-title-gradient">Property Explorer</span>
          </Typography>
          <Typography variant="subtitle1" className="pe-subtitle">
            Discover your perfect home from our extensive collection of premium properties
          </Typography>
        </div>

        {/* Search and Filter Section */}
        <div className="pe-controls-container">
          <div className="pe-search-container">
            <form onSubmit={handleSearchSubmit} className="pe-search-form">
              <div className="pe-search-input-container">
                <SearchIcon className="pe-search-icon" />
                <InputBase
                  placeholder="Search properties by location, type, or keyword..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pe-search-input"
                  inputProps={{ 'aria-label': 'search properties' }}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                className="pe-search-button"
              >
                Search
              </Button>
            </form>
          </div>

          <div className="pe-filters-container">
            <div className="pe-filter-group">
              <FormControl variant="outlined" size="small" className="pe-filter">
                <InputLabel id="city-filter-label">Location</InputLabel>
                <Select
                  labelId="city-filter-label"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  label="Location"
                >
                  {cities.map(city => (
                    <MenuItem key={city} value={city}>
                      {city === "all" ? "All Locations" : city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" className="pe-filter">
                <InputLabel id="type-filter-label">Property Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Property Type"
                >
                  {propertyTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" className="pe-filter">
                <InputLabel id="price-range-label">Price Range</InputLabel>
                <Select
                  labelId="price-range-label"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  label="Price Range"
                >
                  {priceRangeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" className="pe-filter">
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                  <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Button
              variant="outlined"
              className="pe-reset-button"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Results Count and Sort Order */}
        <div className="pe-results-header">
          <Typography variant="body1" className="pe-results-count">
            {loading ? 'Loading properties...' : `Showing ${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'}`}
          </Typography>

          <div className="pe-active-filters">
            {filterCity !== "all" && (
              <Chip
                label={`Location: ${filterCity}`}
                onDelete={() => setFilterCity("all")}
                size="small"
                className="pe-filter-chip"
              />
            )}

            {filterType !== "all" && (
              <Chip
                label={`Type: ${filterType}`}
                onDelete={() => setFilterType("all")}
                size="small"
                className="pe-filter-chip"
              />
            )}

            {priceRange !== "all" && (
              <Chip
                label={`Price: ${priceRangeOptions.find(opt => opt.value === priceRange)?.label}`}
                onDelete={() => setPriceRange("all")}
                size="small"
                className="pe-filter-chip"
              />
            )}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="pe-properties-grid">
          {loading ? (
            renderSkeletonCards()
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map(property => renderPropertyCard(property))
          ) : (
            <div className="pe-no-results">
              <Typography variant="h5">No properties found</Typography>
              <Typography variant="body1">
                Try adjusting your search criteria or filters to see more results
              </Typography>
              <Button
                variant="contained"
                onClick={resetFilters}
                className="pe-reset-search-button"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="pe-footer">
          <Typography variant="body2" className="pe-footer-text">
            &copy; 2025 InfraEstate AI. All rights reserved. Powered by advanced AI technology.
          </Typography>
        </footer>

        {/* Notification System */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type}
            className="pe-notification"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Properties;