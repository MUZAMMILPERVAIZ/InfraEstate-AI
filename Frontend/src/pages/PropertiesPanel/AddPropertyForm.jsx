import React, { useState } from "react";
import "./AddPropertyForm.css";
import {message} from "antd";

const AddPropertyForm = ({ onClose, fetchProperties }) => {
    const [formData, setFormData] = useState({
        location: "",
        city: "",
        price: "",
        size: "",
        bedrooms: "",
        baths: "",
        year: "",
        type: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const token = localStorage.getItem("access_token");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData({ ...formData, image: file });
        }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key]);
        });

        try {
            const response = await fetch("http://127.0.0.1:8080/properties/", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });

            if (!response.ok) throw new Error("Failed to add property");
            message.success("Property added successfully!");


            setFormData({
                location: "",
                city: "",
                price: "",
                size: "",
                bedrooms: "",
                baths: "",
                year: "",
                type: "",
                image: null,
            });
            setImagePreview(null);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="form-container">
            <div className="settings-card">
                <h2 className="form-title">Add Property</h2>
                {imagePreview && <img src={imagePreview} alt="Property" className="property-image-preview" />}
                <form onSubmit={handleAddProperty} className="property-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Upload Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} required className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Size (Marla)</label>
                            <input type="number" name="size" value={formData.size} onChange={handleChange} required className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Bedrooms</label>
                            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Baths</label>
                            <input type="number" name="baths" value={formData.baths} onChange={handleChange} required className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} required className="input-field"/>
                        </div>
                        <div className="form-group full-width">
                            <label>Property Type</label>
                            <input type="text" name="type" value={formData.type} onChange={handleChange} required className="input-field"/>
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Add Property</button>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyForm;

