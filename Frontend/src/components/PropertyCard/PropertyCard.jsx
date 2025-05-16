import React from "react";
import { Link } from "react-router-dom";
import "./PropertyCard.css";

const PropertyCard = ({ property }) => {
  const { id, location, city, price, image_link } = property;

  if (!id) {
    console.error("Property ID is missing for property:", property);
  }

  const imageUrl = `http://127.0.0.1:8080/${image_link}`;

  return (
    <div className="property-card">
      <img src={imageUrl} alt={location} className="property-card-image" />
      <div className="property-card-content">
        <h3 className="property-card-title">{location}</h3>
        <p className="property-card-city">{city}</p>
        <p className="property-card-price">
          PKR {price.toLocaleString()}
        </p>
        <Link to={`/properties/${id}`} className="view-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
