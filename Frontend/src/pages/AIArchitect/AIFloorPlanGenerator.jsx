// import React, {useState} from "react";
// import {useNavigate} from "react-router-dom";
// import "./AIFloorPlanGenerator.css";
//
// // React MD Icons imports
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import ErrorIcon from '@mui/icons-material/Error';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import StraightenIcon from '@mui/icons-material/Straighten';
// import ColorLensIcon from '@mui/icons-material/ColorLens';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import GetAppIcon from '@mui/icons-material/GetApp';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import CheckIcon from '@mui/icons-material/Check';
// import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
// import {Alert, Snackbar} from '@mui/material';
//
// const API_BASE_URL = "http://127.0.0.1:8080";
//
// const AIFloorPlanGenerator = () => {
//     const navigate = useNavigate();
//
//     // Initial form state
//     const [formData, setFormData] = useState({
//         plot_size: "5 Marla",
//         bedrooms: 2,
//         kitchen: 1,
//         living_area: 1,
//         design_preference: "Modern Minimalist",
//         additional_features: []
//     });
//
//     // Process state management
//     const [currentStep, setCurrentStep] = useState(0);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [notification, setNotification] = useState({
//         open: false,
//         message: "",
//         type: "success"
//     });
//
//     // Results from API calls
//     const [floorPlanVariants, setFloorPlanVariants] = useState([]);
//     const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
//     const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
//     const [measurementData, setMeasurementData] = useState(null);
//     const [threeDImage, setThreeDImage] = useState(null);
//     const [interiorImages, setInteriorImages] = useState([]);
//
//     // Process steps
//     const steps = [
//         {id: 0, name: "Property Details", icon: ApartmentIcon},
//         {id: 1, name: "Select Floor Plan", icon: CompareArrowsIcon},
//         {id: 2, name: "Measurements", icon: StraightenIcon},
//         {id: 3, name: "3D Visualization", icon: VisibilityIcon},
//         {id: 4, name: "Interior Design", icon: ColorLensIcon}
//     ];
//
//     // Design preferences from backend
//     const designPreferences = [
//         "Modern",
//         "Modern Minimalist",
//         "Subtle Pakistani Touch",
//         "Contemporary Casual",
//         "Soft Industrial",
//         "Scandi-Cozy",
//         "Relaxed Boho"
//     ];
//
//     // Additional features options
//     const additionalFeatureOptions = [
//         {id: "lawn", label: "Lawn"},
//         {id: "air_conditioned", label: "Air Conditioned"},
//         {id: "garage", label: "Garage"},
//     ];
//
//     // Handle form input changes
//     const handleInputChange = (e) => {
//         const {name, value} = e.target;
//         setFormData({
//             ...formData,
//             [name]: name === "bedrooms" || name === "kitchen" || name === "living_area"
//                 ? parseInt(value, 10)
//                 : value
//         });
//     };
//
//     // Handle checkbox changes for additional features
//     const handleFeatureChange = (featureId) => {
//         const currentFeatures = [...formData.additional_features];
//
//         if (currentFeatures.includes(featureId)) {
//             // Remove the feature if already selected
//             setFormData({
//                 ...formData,
//                 additional_features: currentFeatures.filter(id => id !== featureId)
//             });
//         } else {
//             // Add the feature if not selected
//             setFormData({
//                 ...formData,
//                 additional_features: [...currentFeatures, featureId]
//             });
//         }
//     };
//
//     // Close notification
//     const handleCloseNotification = () => {
//         setNotification({
//             ...notification,
//             open: false
//         });
//     };
//
//     // Show notification
//     const showNotification = (message, type = "success") => {
//         setNotification({
//             open: true,
//             message,
//             type
//         });
//     };
//
//     // Convert file to FormData
//     const fileToFormData = async (url) => {
//         try {
//             const response = await fetch(url);
//             const blob = await response.blob();
//             const formData = new FormData();
//             formData.append("file", blob, "floorplan.png");
//             return formData;
//         } catch (err) {
//             console.error("Error converting file to FormData:", err);
//             throw err;
//         }
//     };
//
//     // Step 1: Generate 2D Floor Plan Variants
//     const generateFloorPlanVariants = async () => {
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             const response = await fetch(`${API_BASE_URL}/ghfd/generate-floorplan`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             // Parse the JSON response with file paths
//             const data = await response.json();
//
//             // Create an array of variant objects with full URLs and letters
//             const variants = data.files.map((path, index) => {
//                 const letter = String.fromCharCode(65 + index); // A, B, C, D
//                 const fullPath = path.startsWith('http') ? path : `${API_BASE_URL}/${path}`;
//                 return {
//                     id: index,
//                     letter,
//                     path: fullPath
//                 };
//             });
//
//             setFloorPlanVariants(variants);
//             setCurrentStep(1);
//             showNotification("Floor plan variants successfully generated");
//         } catch (err) {
//             setError("Failed to generate floor plan variants. Please try again.");
//             showNotification("Failed to generate floor plan variants", "error");
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     // Handle floor plan variant selection
//     const handleSelectFloorPlan = (variant, index) => {
//         setSelectedFloorPlan(variant.path);
//         setSelectedVariantIndex(index);
//     };
//
//     // Step 2: Generate Measurement Plan
//     const generateMeasurementPlan = async () => {
//         if (!selectedFloorPlan) return;
//
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             const formData = await fileToFormData(selectedFloorPlan);
//             const response = await fetch(`${API_BASE_URL}/ghfd/generate-measurement-plan`, {
//                 method: 'POST',
//                 body: formData
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             // This endpoint returns JSON with text and image URL
//             const data = await response.json();
//             // Construct the full URL for the image
//             if (data.image && !data.image.startsWith('http')) {
//                 data.image = `${API_BASE_URL}${data.image}`;
//             }
//             setMeasurementData(data);
//             setCurrentStep(2);
//             showNotification("Measurements successfully generated");
//         } catch (err) {
//             setError("Failed to generate measurements. Please try again.");
//             showNotification("Failed to generate measurements", "error");
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     // Step 3: Generate 3D Plan
//     const generate3DPlan = async () => {
//         if (!selectedFloorPlan) return;
//
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             const formData = await fileToFormData(selectedFloorPlan);
//             const response = await fetch(`${API_BASE_URL}/ghfd/generate-3d-plan`, {
//                 method: 'POST',
//                 body: formData
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             // For FileResponse endpoints, we use the response URL directly
//             const imageUrl = window.URL.createObjectURL(await response.blob());
//             setThreeDImage(imageUrl);
//             setCurrentStep(3);
//             showNotification("3D visualization successfully generated");
//         } catch (err) {
//             setError("Failed to generate 3D visualization. Please try again.");
//             showNotification("Failed to generate 3D visualization", "error");
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     // Step 4: Generate Interior Designs
//     const generateInteriorDesigns = async () => {
//         if (!measurementData || !measurementData.image) return;
//
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             const formData = await fileToFormData(measurementData.image);
//             formData.append("design_preference", formData.design_preference || "Modern Minimalist");
//
//             const response = await fetch(`${API_BASE_URL}/ghfd/generate-design-image`, {
//                 method: 'POST',
//                 body: formData
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             // This endpoint returns JSON with an images object containing paths
//             const data = await response.json();
//
//             // Convert the object of paths to an array with full URLs
//             const imageArray = Object.entries(data.images).map(([roomId, path]) => {
//                 // If the path doesn't start with http, prepend the API base URL
//                 const fullPath = path.startsWith('http') ? path : `${API_BASE_URL}/static/${path.split('/').pop()}`;
//                 return {roomId, path: fullPath};
//             });
//
//             setInteriorImages(imageArray);
//             setCurrentStep(4);
//             showNotification("Interior designs successfully generated");
//         } catch (err) {
//             setError("Failed to generate interior designs. Please try again.");
//             showNotification("Failed to generate interior designs", "error");
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     // Proceed to next step
//     const proceedToNextStep = async () => {
//         switch (currentStep) {
//             case 0:
//                 await generateFloorPlanVariants();
//                 break;
//             case 1:
//                 if (selectedFloorPlan) {
//                     await generateMeasurementPlan();
//                 } else {
//                     showNotification("Please select a floor plan variant", "warning");
//                 }
//                 break;
//             case 2:
//                 await generate3DPlan();
//                 break;
//             case 3:
//                 await generateInteriorDesigns();
//                 break;
//             default:
//                 break;
//         }
//     };
//
//     // Download image
//     const downloadImage = (imageUrl, filename) => {
//         fetch(imageUrl)
//             .then(response => response.blob())
//             .then(blob => {
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement('a');
//                 a.style.display = 'none';
//                 a.href = url;
//                 a.download = filename || 'download.png';
//                 document.body.appendChild(a);
//                 a.click();
//                 window.URL.revokeObjectURL(url);
//                 document.body.removeChild(a);
//                 showNotification(`Downloaded ${filename}`);
//             })
//             .catch(error => {
//                 console.error('Error downloading image:', error);
//                 showNotification('Failed to download image', 'error');
//             });
//     };
//
//     // Download all results as a zip
//     const downloadAllResults = () => {
//         // For demonstration, we'll just notify the user
//         // In a real implementation, this would use JSZip or similar to package all images
//         showNotification("Preparing download package...");
//
//         // Simulating a delay for the download preparation
//         setTimeout(() => {
//             showNotification("Download package ready!", "success");
//         }, 1500);
//     };
//
//     // Render step icon
//     const renderStepIcon = (step) => {
//         const StepIcon = step.icon;
//         return <StepIcon className="afp-step-icon"/>;
//     };
//
//     return (
//         <div className="afp-container">
//             <div className="afp-content">
//                 {/* Header */}
//                 <div className="afp-header">
//                     <h1 className="afp-title">
//                         <span className="afp-title-gradient">
//                           AI-Powered Floor Plan Generator
//                         </span>
//                     </h1>
//                     <p className="afp-subtitle">
//                         Design your dream home with our advanced AI technology. Generate detailed floor plans, 3D
//                         visualizations, and interior designs in minutes.
//                     </p>
//                 </div>
//
//                 {/* Progress Stepper */}
//                 <div className="afp-stepper-container">
//                     <div className="afp-stepper">
//                         {steps.map((step) => (
//                             <div
//                                 key={step.id}
//                                 className={`afp-step ${
//                                     currentStep >= step.id ? "afp-step-active" : ""
//                                 } ${step.id < currentStep ? "afp-step-completed" : ""}`}
//                                 onClick={() => {
//                                     if (step.id < currentStep) {
//                                         setCurrentStep(step.id);
//                                     }
//                                 }}
//                             >
//                                 <div className="afp-step-icon-container">
//                                   <span
//                                       className={`afp-step-icon-wrapper ${
//                                           currentStep > step.id
//                                               ? "afp-step-icon-completed"
//                                               : currentStep === step.id
//                                                   ? "afp-step-icon-current"
//                                                   : "afp-step-icon-pending"
//                                       }`}
//                                   >
//                                     {currentStep > step.id ? (
//                                         <CheckCircleIcon className="afp-icon"/>
//                                     ) : (
//                                         renderStepIcon(step)
//                                     )}
//                                   </span>
//                                     {step.id !== steps.length - 1 && (
//                                         <div
//                                             className={`afp-step-connector ${
//                                                 currentStep > step.id ? "afp-step-connector-completed" : ""
//                                             }`}
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="afp-step-label">
//                                   <span
//                                       className={`afp-step-text ${
//                                           currentStep >= step.id
//                                               ? "afp-step-text-active"
//                                               : ""
//                                       }`}
//                                   >
//                                     {step.name}
//                                   </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Main Content */}
//                 <div className="afp-card">
//                     {/* Property Details Form */}
//                     {currentStep === 0 && (
//                         <div className="afp-form-container">
//                             <div className="afp-form-header">
//                                 <h2 className="afp-form-title">Property Details</h2>
//                                 <p className="afp-form-subtitle">
//                                     Tell us about your dream home and we'll bring it to life
//                                 </p>
//                             </div>
//
//                             <div className="afp-form-grid">
//                                 <div className="afp-form-group">
//                                     <label className="afp-label">Plot Size</label>
//                                     <select
//                                         name="plot_size"
//                                         value={formData.plot_size}
//                                         onChange={handleInputChange}
//                                         className="afp-select"
//                                     >
//                                         <option value="5 Marla">5 Marla</option>
//                                         <option value="10 Marla">10 Marla</option>
//                                         <option value="1 Kanal">1 Kanal</option>
//                                     </select>
//                                 </div>
//
//                                 <div className="afp-form-group">
//                                     <label className="afp-label">Number of Bedrooms</label>
//                                     <select
//                                         name="bedrooms"
//                                         value={formData.bedrooms}
//                                         onChange={handleInputChange}
//                                         className="afp-select"
//                                     >
//                                         {[1, 2, 3, 4, 5, 6].map((num) => (
//                                             <option key={num} value={num}>
//                                                 {num} {num === 1 ? "Bedroom" : "Bedrooms"}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//
//                                 <div className="afp-form-group">
//                                     <label className="afp-label">Number of Kitchens</label>
//                                     <select
//                                         name="kitchen"
//                                         value={formData.kitchen}
//                                         onChange={handleInputChange}
//                                         className="afp-select"
//                                     >
//                                         {[1, 2, 3].map((num) => (
//                                             <option key={num} value={num}>
//                                                 {num} {num === 1 ? "Kitchen" : "Kitchens"}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//
//                                 <div className="afp-form-group">
//                                     <label className="afp-label">Number of Living Areas</label>
//                                     <select
//                                         name="living_area"
//                                         value={formData.living_area}
//                                         onChange={handleInputChange}
//                                         className="afp-select"
//                                     >
//                                         {[1, 2, 3].map((num) => (
//                                             <option key={num} value={num}>
//                                                 {num} {num === 1 ? "Living Area" : "Living Areas"}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//
//                                 <div className="afp-form-group afp-form-group-full">
//                                     <label className="afp-label">Interior Design Preference</label>
//                                     <select
//                                         name="design_preference"
//                                         value={formData.design_preference}
//                                         onChange={handleInputChange}
//                                         className="afp-select"
//                                     >
//                                         {designPreferences.map((style) => (
//                                             <option key={style} value={style}>
//                                                 {style}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//
//                                 <div className="afp-form-group afp-form-group-full">
//                                     <label className="afp-label">Additional Features</label>
//                                     <div className="afp-checkbox-group">
//                                         {additionalFeatureOptions.map((feature) => (
//                                             <div key={feature.id} className="afp-checkbox-item">
//                                                 <input
//                                                     type="checkbox"
//                                                     id={feature.id}
//                                                     checked={formData.additional_features.includes(feature.id)}
//                                                     onChange={() => handleFeatureChange(feature.id)}
//                                                     className="afp-checkbox"
//                                                 />
//                                                 <label htmlFor={feature.id} className="afp-checkbox-label">
//                                                     {feature.label}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Floor Plan Variants Selection */}
//                     {currentStep === 1 && (
//                         <div className="afp-result-container">
//                             <div className="afp-result-header">
//                                 <h2 className="afp-result-title">Select Your Preferred Floor Plan</h2>
//                                 <p className="afp-result-subtitle">
//                                     Choose from these four AI-generated floor plan options
//                                 </p>
//                             </div>
//
//                             <div className="afp-variants-grid">
//                                 {floorPlanVariants.map((variant, index) => (
//                                     <div
//                                         key={variant.id}
//                                         className={`afp-variant-container ${selectedVariantIndex === index ? 'afp-variant-selected' : ''}`}
//                                         onClick={() => handleSelectFloorPlan(variant, index)}
//                                     >
//                                         <div className="afp-variant-letter">Option {variant.letter}</div>
//                                         <img
//                                             src={variant.path}
//                                             alt={`Floor Plan Variant ${variant.letter}`}
//                                             className="afp-variant-image"
//                                         />
//                                         {selectedVariantIndex === index && (
//                                             <div className="afp-variant-selected-indicator">
//                                                 <CheckIcon/>
//                                                 <span>Selected</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//
//                             <div className="afp-image-description">
//                                 <p>
//                                     These floor plans match your specifications for a {formData.plot_size} plot
//                                     with {formData.bedrooms} bedrooms,{" "}
//                                     {formData.kitchen} kitchen{formData.kitchen > 1 ? "s" : ""}, and{" "}
//                                     {formData.living_area} living area{formData.living_area > 1 ? "s" : ""}.
//                                     {formData.additional_features.length > 0 && (
//                                         <>
//                                             {" "}Additional features include: {formData.additional_features.map(id => {
//                                             const feature = additionalFeatureOptions.find(f => f.id === id);
//                                             return feature ? feature.label.toLowerCase() : id;
//                                         }).join(", ")}.
//                                         </>
//                                     )}
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Measurements Result */}
//                     {currentStep === 2 && (
//                         <div className="afp-result-container">
//                             <div className="afp-result-header">
//                                 <h2 className="afp-result-title">Detailed Measurements</h2>
//                                 <p className="afp-result-subtitle">
//                                     Precise room dimensions and measurements of your floor plan
//                                 </p>
//                             </div>
//
//                             <div className="afp-measurements-grid">
//                                 {measurementData && (
//                                     <>
//                                         <div className="afp-image-container afp-image-container-enhanced">
//                                             <img
//                                                 src={measurementData.image}
//                                                 alt="Measurement Plan"
//                                                 className="afp-image"
//                                             />
//                                             <div className="afp-image-actions">
//                                                 <button
//                                                     className="afp-image-action-button"
//                                                     title="Download"
//                                                     onClick={() => downloadImage(measurementData.image, 'measurement_plan.png')}
//                                                 >
//                                                     <GetAppIcon className="afp-icon"/>
//                                                 </button>
//                                             </div>
//                                         </div>
//
//                                         <div className="afp-measurements-details">
//                                             <h3 className="afp-measurements-title">Measurement Details</h3>
//                                             <div className="afp-measurements-text">
//                                                 <pre className="afp-measurements-pre">
//                                                   {measurementData.text}
//                                                 </pre>
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//
//                     {/* 3D Visualization Result */}
//                     {currentStep === 3 && (
//                         <div className="afp-result-container">
//                             <div className="afp-result-header">
//                                 <h2 className="afp-result-title">3D Visualization</h2>
//                                 <p className="afp-result-subtitle">
//                                     Explore your floor plan in three dimensions
//                                 </p>
//                             </div>
//
//                             <div className="afp-result-content">
//                                 {threeDImage && (
//                                     <div className="afp-image-container afp-image-container-enhanced">
//                                         <img
//                                             src={threeDImage}
//                                             alt="3D Visualization"
//                                             className="afp-image"
//                                         />
//                                         <div className="afp-image-actions">
//                                             <button
//                                                 className="afp-image-action-button"
//                                                 title="Download"
//                                                 onClick={() => downloadImage(threeDImage, '3d_visualization.png')}
//                                             >
//                                                 <GetAppIcon className="afp-icon"/>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//
//                                 <div className="afp-image-description">
//                                     <p>
//                                         This 3D visualization brings your floor plan to life, showing realistic walls,
//                                         doors, and spatial relationships.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Interior Design Result */}
//                     {currentStep === 4 && (
//                         <div className="afp-result-container">
//                             <div className="afp-result-header">
//                                 <h2 className="afp-result-title">Interior Designs</h2>
//                                 <p className="afp-result-subtitle">
//                                     Custom interior designs in your chosen {formData.design_preference} style
//                                 </p>
//                             </div>
//
//                             <div className="afp-interior-designs">
//                                 {interiorImages.length > 0 ? (
//                                     <div className="afp-interior-designs-grid">
//                                         {interiorImages.map((item, index) => (
//                                             <div key={index} className="afp-interior-design-item">
//                                                 <div className="afp-room-label">
//                                                     Room {item.roomId}
//                                                 </div>
//                                                 <img
//                                                     src={item.path}
//                                                     alt={`Interior design for room ${item.roomId}`}
//                                                     className="afp-interior-image"
//                                                 />
//                                                 <div className="afp-image-actions">
//                                                     <button
//                                                         className="afp-image-action-button"
//                                                         title="Download"
//                                                         onClick={() => downloadImage(item.path, `interior_room_${item.roomId}.png`)}
//                                                     >
//                                                         <GetAppIcon className="afp-icon"/>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="afp-no-designs">
//                                         <p>No interior designs available yet.</p>
//                                     </div>
//                                 )}
//                             </div>
//
//                             {/* Download All Results Button */}
//                             <div className="afp-download-section">
//                                 <button
//                                     onClick={downloadAllResults}
//                                     className="afp-download-button"
//                                 >
//                                     <GetAppIcon className="afp-button-icon"/>
//                                     Download Complete Package
//                                 </button>
//                                 <p className="afp-download-description">
//                                     Download all floor plans, measurements, 3D views, and interior designs.
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Error Display */}
//                     {error && (
//                         <div className="afp-error">
//                             <div className="afp-error-content">
//                                 <div className="afp-error-icon">
//                                     <ErrorIcon/>
//                                 </div>
//                                 <div className="afp-error-message">
//                                     <p>{error}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Navigation Buttons */}
//                     <div className="afp-navigation afp-navigation-between">
//                         {/* Back Button - Always visible except on first step */}
//                         {currentStep > 0 && (
//                             <button
//                                 onClick={() => setCurrentStep(currentStep - 1)}
//                                 className="afp-back-button"
//                             >
//                                 <ArrowBackIcon className="afp-button-icon"/>
//                                 Back
//                             </button>
//                         )}
//
//                         {/* Conditional center section */}
//                         {currentStep === 0 ? (
//                             <div></div>
//                         ) : null}
//
//                         {/* Generate/Next Button Logic */}
//                         {currentStep < 4 ? (
//                             <div className="afp-actions-container">
//                                 {/* Generate button - only visible on steps 0-3 */}
//                                 <button
//                                     onClick={proceedToNextStep}
//                                     disabled={isLoading || (currentStep === 1 && !selectedFloorPlan)}
//                                     className={`afp-action-button ${
//                                         isLoading || (currentStep === 1 && !selectedFloorPlan) ? "afp-button-disabled" : ""
//                                     }`}
//                                 >
//                                     {currentStep === 0
//                                         ? "Generate Floor Plan Options"
//                                         : currentStep === 1
//                                             ? "Generate Measurements"
//                                             : currentStep === 2
//                                                 ? "Generate 3D View"
//                                                 : "Design Interiors"}
//                                 </button>
//                             </div>
//                         ) : (
//                             <div>
//                                 {/* On final step */}
//                                 <button
//                                     onClick={() => setCurrentStep(0)}
//                                     className="afp-restart-button"
//                                 >
//                                     <RefreshIcon className="afp-button-icon"/>
//                                     Start New Design
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Features Section */}
//                 {currentStep === 0 && (
//                     <div className="afp-features">
//                         <div className="afp-features-header">
//                             <h2 className="afp-features-title">Advanced AI Architecture Features</h2>
//                             <p className="afp-features-subtitle">
//                                 Our AI-powered system offers professional-grade architectural planning tools
//                             </p>
//                         </div>
//                         <div className="afp-features-grid">
//                             <div className="afp-feature">
//                                 <div className="afp-feature-icon-container afp-feature-icon-blue">
//                                     <DashboardIcon className="afp-feature-icon"/>
//                                 </div>
//                                 <h3 className="afp-feature-title">Multiple 2D Floor Plans</h3>
//                                 <p className="afp-feature-description">
//                                     Choose from four design options, each with accurate and professional dimensions.
//                                 </p>
//                             </div>
//
//                             <div className="afp-feature">
//                                 <div className="afp-feature-icon-container afp-feature-icon-purple">
//                                     <VisibilityIcon className="afp-feature-icon"/>
//                                 </div>
//                                 <h3 className="afp-feature-title">3D Visualization</h3>
//                                 <p className="afp-feature-description">
//                                     See your floor plan come to life with realistic 3D rendering.
//                                 </p>
//                             </div>
//
//                             <div className="afp-feature">
//                                 <div className="afp-feature-icon-container afp-feature-icon-pink">
//                                     <ColorLensIcon className="afp-feature-icon"/>
//                                 </div>
//                                 <h3 className="afp-feature-title">Interior Design</h3>
//                                 <p className="afp-feature-description">
//                                     Custom interior designs in multiple styles tailored to your preferences.
//                                 </p>
//                             </div>
//
//                             <div className="afp-feature">
//                                 <div className="afp-feature-icon-container afp-feature-icon-green">
//                                     <StraightenIcon className="afp-feature-icon"/>
//                                 </div>
//                                 <h3 className="afp-feature-title">Detailed Measurements</h3>
//                                 <p className="afp-feature-description">
//                                     Comprehensive room-by-room measurements and specifications.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Footer */}
//                 <footer className="afp-footer">
//                     <p className="afp-footer-text">
//                         &copy; 2025 InfraEstateAI. All rights reserved. Powered by advanced AI technology.
//                     </p>
//                 </footer>
//             </div>
//
//             {/* Loading Overlay */}
//             {isLoading && (
//                 <div className="afp-loading-overlay">
//                     <div className="afp-loading-container">
//                         <div className="afp-loading-animation">
//                             <div className="afp-ai-house-loader">
//                                 <div className="afp-house-outline"></div>
//                                 <div className="afp-house-details"></div>
//                                 <div className="afp-house-window-1"></div>
//                                 <div className="afp-house-window-2"></div>
//                                 <div className="afp-house-door"></div>
//                                 <div className="afp-ai-circles">
//                                     <div className="afp-ai-circle-1"></div>
//                                     <div className="afp-ai-circle-2"></div>
//                                     <div className="afp-ai-circle-3"></div>
//                                 </div>
//                             </div>
//                         </div>
//                         <h3 className="afp-loading-title">
//                             {currentStep === 0
//                                 ? "Generating Floor Plan Options..."
//                                 : currentStep === 1
//                                     ? "Calculating Measurements..."
//                                     : currentStep === 2
//                                         ? "Creating 3D Visualization..."
//                                         : "Designing Interiors..."}
//                         </h3>
//                         <p className="afp-loading-description">
//                             This may take a minute. Our AI is hard at work creating your custom design.
//                         </p>
//                         <div className="afp-loading-progress">
//                             <div className="afp-loading-progress-bar"></div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {/* Notification System */}
//             <Snackbar
//                 open={notification.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseNotification}
//                 anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
//             >
//                 <Alert
//                     onClose={handleCloseNotification}
//                     severity={notification.type}
//                     className="afp-notification"
//                 >
//                     {notification.message}
//                 </Alert>
//             </Snackbar>
//         </div>
//     );
// };
//
// export default AIFloorPlanGenerator;



import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./AIFloorPlanGenerator.css";

// React MD Icons imports
import ApartmentIcon from '@mui/icons-material/Apartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StraightenIcon from '@mui/icons-material/Straighten';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {Alert, Snackbar} from '@mui/material';

const API_BASE_URL = "http://127.0.0.1:8080";

const AIFloorPlanGenerator = () => {
    const navigate = useNavigate();

    // Initial form state
    const [formData, setFormData] = useState({
        plot_size: "5 Marla",
        bedrooms: 2,
        kitchen: 1,
        living_area: 1,
        design_preference: "Modern Minimalist",
        additional_features: []
    });

    // Process state management
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        type: "success"
    });

    // Results from API calls
    const [floorPlanVariants, setFloorPlanVariants] = useState([]);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
    const [measurementData, setMeasurementData] = useState(null);
    const [threeDImage, setThreeDImage] = useState(null);
    const [interiorImages, setInteriorImages] = useState([]);

    // Process steps
    const steps = [
        {id: 0, name: "Property Details", icon: ApartmentIcon},
        {id: 1, name: "Select Floor Plan", icon: CompareArrowsIcon},
        {id: 2, name: "Measurements", icon: StraightenIcon},
        {id: 3, name: "3D Visualization", icon: VisibilityIcon},
        {id: 4, name: "Interior Design", icon: ColorLensIcon}
    ];

    // Design preferences from backend
    const designPreferences = [
        "Modern",
        "Modern Minimalist",
        "Subtle Pakistani Touch",
        "Contemporary Casual",
        "Soft Industrial",
        "Scandi-Cozy",
        "Relaxed Boho"
    ];

    // Additional features options
    const additionalFeatureOptions = [
        {id: "lawn", label: "Lawn"},
        {id: "air_conditioned", label: "Air Conditioned"},
        {id: "garage", label: "Garage"},
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === "bedrooms" || name === "kitchen" || name === "living_area"
                ? parseInt(value, 10)
                : value
        });
    };

    // Handle checkbox changes for additional features
    const handleFeatureChange = (featureId) => {
        const currentFeatures = [...formData.additional_features];

        if (currentFeatures.includes(featureId)) {
            // Remove the feature if already selected
            setFormData({
                ...formData,
                additional_features: currentFeatures.filter(id => id !== featureId)
            });
        } else {
            // Add the feature if not selected
            setFormData({
                ...formData,
                additional_features: [...currentFeatures, featureId]
            });
        }
    };

    // Close notification
    const handleCloseNotification = () => {
        setNotification({
            ...notification,
            open: false
        });
    };

    // Show notification
    const showNotification = (message, type = "success") => {
        setNotification({
            open: true,
            message,
            type
        });
    };

    // Convert file to FormData
    const fileToFormData = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("file", blob, "floorplan.png");
            return formData;
        } catch (err) {
            console.error("Error converting file to FormData:", err);
            throw err;
        }
    };

    // Step 1: Generate 2D Floor Plan Variants
    const generateFloorPlanVariants = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/ghfd/generate-floorplan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response with file paths
            const data = await response.json();

            // Create an array of variant objects with full URLs and letters
            const variants = data.files.map((path, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                const fullPath = path.startsWith('http') ? path : `${API_BASE_URL}/${path}`;
                return {
                    id: index,
                    letter,
                    path: fullPath
                };
            });

            setFloorPlanVariants(variants);
            setCurrentStep(1);
            showNotification("Floor plan variants successfully generated");
        } catch (err) {
            setError("Failed to generate floor plan variants. Please try again.");
            showNotification("Failed to generate floor plan variants", "error");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle floor plan variant selection
    const handleSelectFloorPlan = (variant, index) => {
        setSelectedFloorPlan(variant.path);
        setSelectedVariantIndex(index);
    };

    // Step 2: Generate Measurement Plan
    const generateMeasurementPlan = async () => {
        if (!selectedFloorPlan) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = await fileToFormData(selectedFloorPlan);
            const response = await fetch(`${API_BASE_URL}/ghfd/generate-measurement-plan`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // This endpoint returns JSON with text and image URL
            const data = await response.json();
            // Construct the full URL for the image
            if (data.image && !data.image.startsWith('http')) {
                data.image = `${API_BASE_URL}${data.image}`;
            }
            setMeasurementData(data);
            setCurrentStep(2);
            showNotification("Measurements successfully generated");
        } catch (err) {
            setError("Failed to generate measurements. Please try again.");
            showNotification("Failed to generate measurements", "error");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Generate 3D Plan
    const generate3DPlan = async () => {
        if (!selectedFloorPlan) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = await fileToFormData(selectedFloorPlan);
            const response = await fetch(`${API_BASE_URL}/ghfd/generate-3d-plan`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // For FileResponse endpoints, we use the response URL directly
            const imageUrl = window.URL.createObjectURL(await response.blob());
            setThreeDImage(imageUrl);
            setCurrentStep(3);
            showNotification("3D visualization successfully generated");
        } catch (err) {
            setError("Failed to generate 3D visualization. Please try again.");
            showNotification("Failed to generate 3D visualization", "error");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 4: Generate Interior Designs
    const generateInteriorDesigns = async () => {
        if (!measurementData || !measurementData.image) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = await fileToFormData(measurementData.image);
            formData.append("design_preference", formData.design_preference || "Modern Minimalist");

            const response = await fetch(`${API_BASE_URL}/ghfd/generate-design-image`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // This endpoint returns JSON with an images object containing paths
            const data = await response.json();

            // Convert the object of paths to an array with full URLs
            const imageArray = Object.entries(data.images).map(([roomId, path]) => {
                // If the path doesn't start with http, prepend the API base URL
                const fullPath = path.startsWith('http') ? path : `${API_BASE_URL}/static/${path.split('/').pop()}`;
                return {roomId, path: fullPath};
            });

            setInteriorImages(imageArray);
            setCurrentStep(4);
            showNotification("Interior designs successfully generated");
        } catch (err) {
            setError("Failed to generate interior designs. Please try again.");
            showNotification("Failed to generate interior designs", "error");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Proceed to next step
    const proceedToNextStep = async () => {
        switch (currentStep) {
            case 0:
                await generateFloorPlanVariants();
                break;
            case 1:
                if (selectedFloorPlan) {
                    await generateMeasurementPlan();
                } else {
                    showNotification("Please select a floor plan variant", "warning");
                }
                break;
            case 2:
                await generate3DPlan();
                break;
            case 3:
                await generateInteriorDesigns();
                break;
            default:
                break;
        }
    };

    // Download image
    const downloadImage = (imageUrl, filename) => {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename || 'download.png';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                showNotification(`Downloaded ${filename}`);
            })
            .catch(error => {
                console.error('Error downloading image:', error);
                showNotification('Failed to download image', 'error');
            });
    };

    // Download all results as a zip
    const downloadAllResults = () => {
        // For demonstration, we'll just notify the user
        // In a real implementation, this would use JSZip or similar to package all images
        showNotification("Preparing download package...");

        // Simulating a delay for the download preparation
        setTimeout(() => {
            showNotification("Download package ready!", "success");
        }, 1500);
    };

    // Render step icon
    const renderStepIcon = (step) => {
        const StepIcon = step.icon;
        return <StepIcon className="afp-step-icon"/>;
    };

    return (
        <div className="afp-container">
            <div className="afp-content">
                {/* Header */}
                <div className="afp-header">
                    <h1 className="afp-title">
                        <span className="afp-title-gradient">
                          AI-Powered Floor Plan Generator
                        </span>
                    </h1>
                    <p className="afp-subtitle">
                        Design your dream home with our advanced AI technology. Generate detailed floor plans, 3D
                        visualizations, and interior designs in minutes.
                    </p>
                </div>

                {/* Progress Stepper */}
                <div className="afp-stepper-container">
                    <div className="afp-stepper">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`afp-step ${
                                    currentStep >= step.id ? "afp-step-active" : ""
                                } ${step.id < currentStep ? "afp-step-completed" : ""}`}
                                onClick={() => {
                                    if (step.id < currentStep) {
                                        setCurrentStep(step.id);
                                    }
                                }}
                            >
                                <div className="afp-step-icon-container">
                                  <span
                                      className={`afp-step-icon-wrapper ${
                                          currentStep > step.id
                                              ? "afp-step-icon-completed"
                                              : currentStep === step.id
                                                  ? "afp-step-icon-current"
                                                  : "afp-step-icon-pending"
                                      }`}
                                  >
                                    {currentStep > step.id ? (
                                        <CheckCircleIcon className="afp-icon"/>
                                    ) : (
                                        renderStepIcon(step)
                                    )}
                                  </span>
                                    {step.id !== steps.length - 1 && (
                                        <div
                                            className={`afp-step-connector ${
                                                currentStep > step.id ? "afp-step-connector-completed" : ""
                                            }`}
                                        />
                                    )}
                                </div>
                                <div className="afp-step-label">
                                  <span
                                      className={`afp-step-text ${
                                          currentStep >= step.id
                                              ? "afp-step-text-active"
                                              : ""
                                      }`}
                                  >
                                    {step.name}
                                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="afp-card">
                    {/* Property Details Form */}
                    {currentStep === 0 && (
                        <div className="afp-form-container">
                            <div className="afp-form-header">
                                <h2 className="afp-form-title">Property Details</h2>
                                <p className="afp-form-subtitle">
                                    Tell us about your dream home and we'll bring it to life
                                </p>
                            </div>

                            <div className="afp-form-grid">
                                <div className="afp-form-group">
                                    <label className="afp-label">Plot Size</label>
                                    <select
                                        name="plot_size"
                                        value={formData.plot_size}
                                        onChange={handleInputChange}
                                        className="afp-select"
                                    >
                                        <option value="5 Marla">5 Marla</option>
                                        <option value="10 Marla">10 Marla</option>
                                        <option value="1 Kanal">1 Kanal</option>
                                    </select>
                                </div>

                                <div className="afp-form-group">
                                    <label className="afp-label">Number of Bedrooms</label>
                                    <select
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleInputChange}
                                        className="afp-select"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="afp-form-group">
                                    <label className="afp-label">Number of Kitchens</label>
                                    <select
                                        name="kitchen"
                                        value={formData.kitchen}
                                        onChange={handleInputChange}
                                        className="afp-select"
                                    >
                                        {[1, 2].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? "Kitchen" : "Kitchens"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="afp-form-group">
                                    <label className="afp-label">Number of Living Areas</label>
                                    <select
                                        name="living_area"
                                        value={formData.living_area}
                                        onChange={handleInputChange}
                                        className="afp-select"
                                    >
                                        {[1, 2].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? "Living Area" : "Living Areas"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="afp-form-group afp-form-group-full">
                                    <label className="afp-label">Interior Design Preference</label>
                                    <select
                                        name="design_preference"
                                        value={formData.design_preference}
                                        onChange={handleInputChange}
                                        className="afp-select"
                                    >
                                        {designPreferences.map((style) => (
                                            <option key={style} value={style}>
                                                {style}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="afp-form-group afp-form-group-full">
                                    <label className="afp-label">Additional Features</label>
                                    <div className="afp-checkbox-group">
                                        {additionalFeatureOptions.map((feature) => (
                                            <div key={feature.id} className="afp-checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id={feature.id}
                                                    checked={formData.additional_features.includes(feature.id)}
                                                    onChange={() => handleFeatureChange(feature.id)}
                                                    className="afp-checkbox"
                                                />
                                                <label htmlFor={feature.id} className="afp-checkbox-label">
                                                    {feature.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Floor Plan Variants Selection */}
                    {currentStep === 1 && (
                        <div className="afp-result-container">
                            <div className="afp-result-header">
                                <h2 className="afp-result-title">Select Your Preferred Floor Plan</h2>
                                <p className="afp-result-subtitle">
                                    Choose from these four AI-generated floor plan options
                                </p>
                            </div>

                            <div className="afp-variants-grid">
                                {floorPlanVariants.map((variant, index) => (
                                    <div
                                        key={variant.id}
                                        className={`afp-variant-container ${selectedVariantIndex === index ? 'afp-variant-selected' : ''}`}
                                        onClick={() => handleSelectFloorPlan(variant, index)}
                                    >
                                        <div className="afp-variant-letter">Option {variant.letter}</div>
                                        <img
                                            src={variant.path}
                                            alt={`Floor Plan Variant ${variant.letter}`}
                                            className="afp-variant-image"
                                        />
                                        {selectedVariantIndex === index && (
                                            <div className="afp-variant-selected-indicator">
                                                <CheckIcon/>
                                                <span>Selected</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="afp-image-description">
                                <p>
                                    These floor plans match your specifications for a {formData.plot_size} plot
                                    with {formData.bedrooms} bedrooms,{" "}
                                    {formData.kitchen} kitchen{formData.kitchen > 1 ? "s" : ""}, and{" "}
                                    {formData.living_area} living area{formData.living_area > 1 ? "s" : ""}.
                                    {formData.additional_features.length > 0 && (
                                        <>
                                            {" "}Additional features include: {formData.additional_features.map(id => {
                                            const feature = additionalFeatureOptions.find(f => f.id === id);
                                            return feature ? feature.label.toLowerCase() : id;
                                        }).join(", ")}.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Measurements Result */}
                    {currentStep === 2 && (
                        <div className="afp-result-container">
                            <div className="afp-result-header">
                                <h2 className="afp-result-title">Detailed Measurements</h2>
                                <p className="afp-result-subtitle">
                                    Precise room dimensions and measurements of your floor plan
                                </p>
                            </div>

                            <div className="afp-measurements-grid">
                                {measurementData && (
                                    <>
                                        <div className="afp-image-container afp-image-container-enhanced">
                                            <img
                                                src={measurementData.image}
                                                alt="Measurement Plan"
                                                className="afp-image"
                                            />
                                            <div className="afp-image-actions">
                                                <button
                                                    className="afp-image-action-button"
                                                    title="Download"
                                                    onClick={() => downloadImage(measurementData.image, 'measurement_plan.png')}
                                                >
                                                    <GetAppIcon className="afp-icon"/>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="afp-measurements-details">
                                            <h3 className="afp-measurements-title">Measurement Details</h3>
                                            <div className="afp-measurements-text">
                                                <pre className="afp-measurements-pre">
                                                  {measurementData.text}
                                                </pre>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3D Visualization Result */}
                    {currentStep === 3 && (
                        <div className="afp-result-container">
                            <div className="afp-result-header">
                                <h2 className="afp-result-title">3D Visualization</h2>
                                <p className="afp-result-subtitle">
                                    Explore your floor plan in three dimensions
                                </p>
                            </div>

                            <div className="afp-result-content">
                                {threeDImage && (
                                    <div className="afp-image-container afp-image-container-enhanced">
                                        <img
                                            src={threeDImage}
                                            alt="3D Visualization"
                                            className="afp-image"
                                        />
                                        <div className="afp-image-actions">
                                            <button
                                                className="afp-image-action-button"
                                                title="Download"
                                                onClick={() => downloadImage(threeDImage, '3d_visualization.png')}
                                            >
                                                <GetAppIcon className="afp-icon"/>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="afp-image-description">
                                    <p>
                                        This 3D visualization brings your floor plan to life, showing realistic walls,
                                        doors, and spatial relationships.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Interior Design Result */}
                    {currentStep === 4 && (
                        <div className="afp-result-container">
                            <div className="afp-result-header">
                                <h2 className="afp-result-title">Interior Designs</h2>
                                <p className="afp-result-subtitle">
                                    Custom interior designs in your chosen {formData.design_preference} style
                                </p>
                            </div>

                            <div className="afp-interior-designs">
                                {interiorImages.length > 0 ? (
                                    <div className="afp-interior-designs-grid">
                                        {interiorImages.map((item, index) => (
                                            <div key={index} className="afp-interior-design-item">
                                                <div className="afp-room-label">
                                                    Room {item.roomId}
                                                </div>
                                                <img
                                                    src={item.path}
                                                    alt={`Interior design for room ${item.roomId}`}
                                                    className="afp-interior-image"
                                                />
                                                <div className="afp-image-actions">
                                                    <button
                                                        className="afp-image-action-button"
                                                        title="Download"
                                                        onClick={() => downloadImage(item.path, `interior_room_${item.roomId}.png`)}
                                                    >
                                                        <GetAppIcon className="afp-icon"/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="afp-no-designs">
                                        <p>No interior designs available yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Download All Results Button */}
                            <div className="afp-download-section">
                                <button
                                    onClick={downloadAllResults}
                                    className="afp-download-button"
                                >
                                    <GetAppIcon className="afp-button-icon"/>
                                    Download Complete Package
                                </button>
                                <p className="afp-download-description">
                                    Download all floor plans, measurements, 3D views, and interior designs.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="afp-error">
                            <div className="afp-error-content">
                                <div className="afp-error-icon">
                                    <ErrorIcon/>
                                </div>
                                <div className="afp-error-message">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="afp-navigation afp-navigation-between">
                        {/* Back Button - Always visible except on first step */}
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="afp-back-button"
                            >
                                <ArrowBackIcon className="afp-button-icon"/>
                                Back
                            </button>
                        )}

                        {/* Conditional center section */}
                        {currentStep === 0 ? (
                            <div></div>
                        ) : null}

                        {/* Generate/Next Button Logic */}
                        {currentStep < 4 ? (
                            <div className="afp-actions-container">
                                {/* Generate button - only visible on steps 0-3 */}
                                <button
                                    onClick={proceedToNextStep}
                                    disabled={isLoading || (currentStep === 1 && !selectedFloorPlan)}
                                    className={`afp-action-button ${
                                        isLoading || (currentStep === 1 && !selectedFloorPlan) ? "afp-button-disabled" : ""
                                    }`}
                                >
                                    {currentStep === 0
                                        ? "Generate Floor Plan Options"
                                        : currentStep === 1
                                            ? "Generate Measurements"
                                            : currentStep === 2
                                                ? "Generate 3D View"
                                                : "Design Interiors"}
                                </button>
                            </div>
                        ) : (
                            <div>
                                {/* On final step */}
                                <button
                                    onClick={() => setCurrentStep(0)}
                                    className="afp-restart-button"
                                >
                                    <RefreshIcon className="afp-button-icon"/>
                                    Start New Design
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                {currentStep === 0 && (
                    <div className="afp-features">
                        <div className="afp-features-header">
                            <h2 className="afp-features-title">Advanced AI Architecture Features</h2>
                            <p className="afp-features-subtitle">
                                Our AI-powered system offers professional-grade architectural planning tools
                            </p>
                        </div>
                        <div className="afp-features-grid">
                            <div className="afp-feature">
                                <div className="afp-feature-icon-container afp-feature-icon-blue">
                                    <DashboardIcon className="afp-feature-icon"/>
                                </div>
                                <h3 className="afp-feature-title">Multiple 2D Floor Plans</h3>
                                <p className="afp-feature-description">
                                    Choose from four design options, each with accurate and professional dimensions.
                                </p>
                            </div>

                            <div className="afp-feature">
                                <div className="afp-feature-icon-container afp-feature-icon-purple">
                                    <VisibilityIcon className="afp-feature-icon"/>
                                </div>
                                <h3 className="afp-feature-title">3D Visualization</h3>
                                <p className="afp-feature-description">
                                    See your floor plan come to life with realistic 3D rendering.
                                </p>
                            </div>

                            <div className="afp-feature">
                                <div className="afp-feature-icon-container afp-feature-icon-pink">
                                    <ColorLensIcon className="afp-feature-icon"/>
                                </div>
                                <h3 className="afp-feature-title">Interior Design</h3>
                                <p className="afp-feature-description">
                                    Custom interior designs in multiple styles tailored to your preferences.
                                </p>
                            </div>

                            <div className="afp-feature">
                                <div className="afp-feature-icon-container afp-feature-icon-green">
                                    <StraightenIcon className="afp-feature-icon"/>
                                </div>
                                <h3 className="afp-feature-title">Detailed Measurements</h3>
                                <p className="afp-feature-description">
                                    Comprehensive room-by-room measurements and specifications.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="afp-footer">
                    <p className="afp-footer-text">
                        &copy; 2025 InfraEstateAI. All rights reserved. Powered by advanced AI technology.
                    </p>
                </footer>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="afp-loading-overlay">
                    <div className="afp-loading-container">
                        <div className="afp-loading-animation">
                            <div className="afp-ai-house-loader">
                                <div className="afp-house-outline"></div>
                                <div className="afp-house-details"></div>
                                <div className="afp-house-window-1"></div>
                                <div className="afp-house-window-2"></div>
                                <div className="afp-house-door"></div>
                                <div className="afp-ai-circles">
                                    <div className="afp-ai-circle-1"></div>
                                    <div className="afp-ai-circle-2"></div>
                                    <div className="afp-ai-circle-3"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="afp-loading-title">
                            {currentStep === 0
                                ? "Generating Floor Plan Options..."
                                : currentStep === 1
                                    ? "Calculating Measurements..."
                                    : currentStep === 2
                                        ? "Creating 3D Visualization..."
                                        : "Designing Interiors..."}
                        </h3>
                        <p className="afp-loading-description">
                            This may take a minute. Our AI is hard at work creating your custom design.
                        </p>
                        <div className="afp-loading-progress">
                            <div className="afp-loading-progress-bar"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification System */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.type}
                    className="afp-notification"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AIFloorPlanGenerator;