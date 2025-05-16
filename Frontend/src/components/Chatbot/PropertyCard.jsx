import React from 'react';
import {Box, Button, Card, CardContent, Chip, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {
    Bathtub as BathroomIcon,
    CalendarToday as YearIcon,
    Home as HomeIcon,
    KingBed as BedroomIcon,
    LocationOn as LocationIcon,
    SquareFoot as SizeIcon
} from '@mui/icons-material';
import './PropertyCard.css';

const formatPrice = (price) => {
    if (price >= 1000000) {
        return `PKR ${(price / 1000000).toFixed(0)}M`;
    } else if (price >= 100000) {
        return `PKR ${(price / 100000).toFixed(0)}L`;
    } else {
        return `PKR ${price.toLocaleString()}`;
    }
};

const PropertyCard = ({property}) => {
    const navigate = useNavigate();

    const handleViewProperty = () => {
        navigate(`/properties/${property.id}`);
    };

    // Construct the full image URL
    const getImageUrl = () => {
        if (!property.image_link) return "https://source.unsplash.com/800x600/?house,real,estate";

        // Check if the URL already includes the base
        if (property.image_link.startsWith('http')) {
            return property.image_link;
        }

        // Otherwise add the base URL
        return `http://127.0.0.1:8080${property.image_link.startsWith('/') ? '' : '/'}${property.image_link}`;
    };

    return (
        <Card className="property-card-improved">
            <Box className="property-image-container">
                <img
                    src={getImageUrl()}
                    alt={`Property in ${property.location}`}
                    className="property-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://source.unsplash.com/800x600/?house,real,estate";
                    }}
                />
                <Chip
                    label={property.type || "residential"}
                    className="property-type-label"
                />
                <Box className="property-price-tag">
                    {formatPrice(property.price)}
                </Box>
            </Box>

            <CardContent className="property-content">
                <Box className="property-location-container">
                    <LocationIcon className="location-icon"/>
                    <Typography variant="subtitle1" className="property-location-text">
                        {property.location}, {property.city}
                    </Typography>
                </Box>

                <Box className="property-features-container">
                    <Box className="feature-item">
                        <BedroomIcon className="feature-icon"/>
                        <Typography className="feature-text">
                            {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                        </Typography>
                    </Box>

                    <Box className="feature-item">
                        <BathroomIcon className="feature-icon"/>
                        <Typography className="feature-text">
                            {property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}
                        </Typography>
                    </Box>

                    <Box className="feature-item">
                        <SizeIcon className="feature-icon"/>
                        <Typography className="feature-text">
                            {property.size} Marla
                        </Typography>
                    </Box>
                </Box>

                <Box className="property-footer">
                    <Box className="built-year">
                        <YearIcon fontSize="small"/>
                        <Typography variant="body2">Built: {property.year}</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        className="view-property-button"
                        onClick={handleViewProperty}
                        startIcon={<HomeIcon/>}
                    >
                        View Property
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PropertyCard;