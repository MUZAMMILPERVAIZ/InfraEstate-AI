import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import PropertyCard from './PropertyCard';
import './PropertyCard.css';

const PropertyList = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <Fade in={true} timeout={800}>
      <Box className="properties-section">
        <Typography variant="h6" className="properties-section-title">
          Properties Found ({properties.length})
        </Typography>
        <Box className="property-cards-container">
          {properties.map((property, index) => (
            <PropertyCard key={property.id || `property-${index}`} property={property} />
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default PropertyList;