import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./ConstructionBudgetEstimator.css";

// Material UI Icons
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CalculateIcon from '@mui/icons-material/Calculate';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import HistoryIcon from '@mui/icons-material/History';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import PrintIcon from '@mui/icons-material/Print';
import ErrorIcon from '@mui/icons-material/Error';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LayersIcon from '@mui/icons-material/Layers';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TableChartIcon from '@mui/icons-material/TableChart';
import {
    Alert,
    FormControl,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs
} from '@mui/material';

// Import chart libraries
import {Bar, Pie} from 'react-chartjs-2';
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API_BASE_URL = "http://127.0.0.1:8080";

const ConstructionBudgetEstimator = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        area: 5,
        unit: "Marla",
        floors: 1,
        rooms: 3,
        include_hvac: false,
        include_solar: false,
        solar_capacity: 0,
        model_type: "hybrid"
    });

    // Suggestion form state
// Suggestion form state
    const [suggestionForm, setSuggestionForm] = useState({
        area: 5,
        unit: "Marla",
        budget: 10000000,
        max_floors: 1
    });

// Add a new state for the detailed report
    const [detailedReport, setDetailedReport] = useState("");

    // Current rates
    const [rates, setRates] = useState({
        grey_structure_rate: 0,
        finishing_rate: 0,
        electrical_rate: 0,
        plumbing_rate: 0,
        hvac_rate: 0,
        solar_panel_cost_per_watt: 0,
        fixed_solar_equipment_cost: 0
    });

    // Results
    const [calculationResults, setCalculationResults] = useState(null);
    const [calculationHistory, setCalculationHistory] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [activeChart, setActiveChart] = useState('pie'); // 'pie' or 'bar'
    const [suggestions, setSuggestions] = useState([]);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestionError, setSuggestionError] = useState(null);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        type: "success"
    });
    const [showHistory, setShowHistory] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Available units
    const units = ["Marla", "Square Feet", "Square Meters", "Kanal"];

    // Model types
    const modelTypes = [
        {value: "parametric", label: "Parametric"},
        {value: "ml", label: "Machine Learning"},
        {value: "hybrid", label: "Hybrid (Recommended)"}
    ];

    // Colors for charts
    const chartColors = [
        'rgba(79, 70, 229, 0.8)',  // Primary - Indigo
        'rgba(147, 51, 234, 0.8)',  // Secondary - Purple
        'rgba(16, 185, 129, 0.8)',  // Success - Green
        'rgba(239, 68, 68, 0.8)',   // Error - Red
        'rgba(245, 158, 11, 0.8)',  // Warning - Amber
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(236, 72, 153, 0.8)'   // Pink
    ];

    // Fetch rates when component mounts
    useEffect(() => {
        fetchRates();
    }, []);

    // Get auth token from localStorage and verify it's valid
    const getAuthToken = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            // Show error notification if token doesn't exist
            showNotification("Please log in to use this feature", "error");
            return null;
        }
        // Basic check to see if token is in expected format
        if (!token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/)) {
            showNotification("Authentication token is invalid. Please log in again.", "error");
            return null;
        }
        return token;
    };

    // Fetch current construction rates
    const fetchRates = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                return; // Exit if no valid token
            }

            const response = await fetch(`${API_BASE_URL}/construction/rates`, {
                // headers: {
                //     "Authorization": `Bearer ${token}`
                // }
            });

            if (response.status === 401 || response.status === 403) {
                showNotification("Your session has expired. Please log in again.", "error");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setRates(data);
        } catch (err) {
            setError("Failed to fetch construction rates. Please try again.");
            showNotification("Failed to fetch construction rates", "error");
            console.error(err);
        }
    };

    // Fetch calculation history
    const fetchCalculationHistory = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                return; // Exit if no valid token
            }

            const response = await fetch(`${API_BASE_URL}/construction/calculations`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                showNotification("Your session has expired. Please log in again.", "error");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Calculation history data:", data);

            // Transform the data structure to match our component needs
            const formattedData = data.map(calc => {
                // Extract parameters and results from the calculation data
                const {_id, timestamp, input_parameters, results} = calc;

                return {
                    id: _id,
                    timestamp: timestamp,
                    area: input_parameters.area,
                    unit: input_parameters.unit,
                    floors: input_parameters.floors || 1,
                    rooms: input_parameters.rooms || 1,
                    include_hvac: input_parameters.include_hvac,
                    include_solar: input_parameters.include_solar,
                    solar_capacity: input_parameters.solar_capacity,
                    model_type: input_parameters.model_type || "hybrid",
                    total_cost: results.total_project_cost,
                    converted_area: results.area_sqft
                };
            });

            console.log("Formatted calculation history:", formattedData);
            setCalculationHistory(formattedData);
        } catch (err) {
            console.error("Failed to fetch calculation history:", err);
            showNotification("Failed to fetch calculation history", "error");
        }
    };

    // Handle form input changes for calculator
    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked :
                (type === 'number' ? parseFloat(value) : value)
        });
    };

    // Handle form input changes for suggestion form
    const handleSuggestionInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setSuggestionForm({
            ...suggestionForm,
            [name]: type === 'checkbox' ? checked :
                (type === 'number' ? parseFloat(value) : value)
        });
    };

    // Handle radio change for model type
    const handleModelTypeChange = (e) => {
        setFormData({
            ...formData,
            model_type: e.target.value
        });
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Apply suggestion to calculator
    const applySuggestion = (suggestion) => {
        setFormData({
            ...formData,
            floors: suggestion.floors,
            rooms: suggestion.rooms
        });
        setActiveTab(0); // Switch to calculator tab
        showNotification("Suggestion applied to calculator");
    };

    // Submit form to calculate construction budget
    const calculateBudget = async () => {
        setIsLoading(true);
        setError(null);

        // First show the loader for 2 seconds before making the API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const token = getAuthToken();
            if (!token) {
                setIsLoading(false);
                return; // Exit if no valid token
            }

            // Prepare the request payload according to the updated ConstructionInput model
            const payload = {
                area: formData.area,
                unit: formData.unit,
                floors: formData.floors,
                rooms: formData.rooms,
                include_hvac: formData.include_hvac,
                include_solar: formData.include_solar,
                solar_capacity: formData.include_solar ? formData.solar_capacity : 0,
                model_type: formData.model_type
            };

            console.log("Sending payload:", payload);

            const response = await fetch(`${API_BASE_URL}/construction/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 401 || response.status === 403) {
                setIsLoading(false);
                showNotification("Your session has expired. Please log in again.", "error");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Received calculation result:", result);

            // Set the results
            setCalculationResults({
                ...result,
                area: formData.area,
                unit: formData.unit,
                floors: formData.floors,
                rooms: formData.rooms,
                include_hvac: formData.include_hvac,
                include_solar: formData.include_solar,
                solar_capacity: formData.solar_capacity,
                model_type: formData.model_type,
                converted_area: result.area_sqft,
                total_cost: result.total_project_cost
            });

            // Prepare chart data
            prepareChartData(result);

            showNotification("Budget calculation completed successfully");

            // Refresh calculation history
            fetchCalculationHistory();
        } catch (err) {
            setError("Failed to calculate budget. Please try again.");
            showNotification("Failed to calculate budget", "error");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Submit suggestion form to get layout suggestions
    const getLayoutSuggestions = async () => {
        setIsSuggestionLoading(true);
        setSuggestionError(null);
        setSuggestions([]);
        setDetailedReport(""); // Reset detailed report

        try {
            const token = getAuthToken();
            if (!token) {
                setIsSuggestionLoading(false);
                return; // Exit if no valid token
            }

            // Prepare the request payload according to the updated SuggestionInput model
            const payload = {
                area: suggestionForm.area,
                unit: suggestionForm.unit,
                budget: suggestionForm.budget,
                max_floors: suggestionForm.max_floors
            };

            console.log("Sending suggestion payload:", payload);

            const response = await fetch(`${API_BASE_URL}/construction/suggest-layout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 401 || response.status === 403) {
                setIsSuggestionLoading(false);
                showNotification("Your session has expired. Please log in again.", "error");
                return;
            }

            if (response.status === 404) {
                // Handle case where no suggestions are found
                setSuggestionError("No layout combinations found within the given budget. Try increasing your budget or reducing requirements.");
                showNotification("No suggestions found for your budget", "warning");
                setIsSuggestionLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Received suggestions:", result);

            setSuggestions(result.suggestions);
            setDetailedReport(result.suggestion_report);
            showNotification("Layout suggestions generated successfully");
        } catch (err) {
            setSuggestionError("Failed to generate layout suggestions. Please try again.");
            showNotification("Failed to generate suggestions", "error");
            console.error(err);
        } finally {
            setIsSuggestionLoading(false);
        }
    };

    // Prepare chart data from calculation results
    const prepareChartData = (results) => {
        if (!results || !results.pie_chart_data) return;

        console.log("Preparing chart data from:", results);

        // Create deep copy of chart data
        const pieLabels = [...results.pie_chart_data.labels];
        const pieValues = [...results.pie_chart_data.values];
        const barLabels = [...results.bar_chart_data.labels];
        const barValues = [...results.bar_chart_data.values];

        // Add solar to charts if it exists in the results but not in the charts
        if (results.cost_solar && results.cost_solar > 0) {
            // Check if 'Solar' is already in the labels
            const solarIndex = pieLabels.findIndex(label => label === 'Solar');

            if (solarIndex === -1) {
                // Solar not found, add it to charts
                pieLabels.push('Solar');
                pieValues.push(results.cost_solar);
                barLabels.push('Solar');
                barValues.push(results.cost_solar);

                console.log("Added Solar to chart data");
            } else {
                // Update existing solar value
                pieValues[solarIndex] = results.cost_solar;
                barValues[solarIndex] = results.cost_solar;
            }
        }

        const pieData = {
            labels: pieLabels,
            datasets: [
                {
                    data: pieValues,
                    backgroundColor: chartColors.slice(0, pieValues.length),
                    borderColor: chartColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 1,
                },
            ],
        };

        const barData = {
            labels: barLabels,
            datasets: [
                {
                    label: 'Cost (PKR)',
                    data: barValues,
                    backgroundColor: chartColors.slice(0, barValues.length),
                    borderColor: chartColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 1,
                },
            ],
        };

        console.log("Final chart data:", {pie: pieData, bar: barData});
        setChartData({pie: pieData, bar: barData});
    };

    // Get a specific calculation's details
    const viewCalculationDetails = async (calculationId) => {
        setIsLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                setIsLoading(false);
                return; // Exit if no valid token
            }

            const response = await fetch(`${API_BASE_URL}/construction/chart-data/${calculationId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                setIsLoading(false);
                showNotification("Your session has expired. Please log in again.", "error");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const chartData = await response.json();

            // Find the calculation from history
            const calculation = calculationHistory.find(calc => calc.id === calculationId);

            if (calculation) {
                // Map the data structure to match our component's expected format
                setCalculationResults({
                    ...calculation,
                    pie_chart_data: chartData.pie_chart,
                    bar_chart_data: chartData.bar_chart,
                    total_cost: calculation.total_cost
                });

                prepareChartData({
                    pie_chart_data: chartData.pie_chart,
                    bar_chart_data: chartData.bar_chart
                });

                setShowHistory(false);
            }
        } catch (err) {
            setError("Failed to fetch calculation details. Please try again.");
            showNotification("Failed to fetch calculation details", "error");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Format currency (PKR)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0
        }).format(amount);
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

    // Print/download report
    const printReport = () => {
        if (!calculationResults) return;

        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Construction Budget Estimate</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 30px; }
                        h1 { color: #4f46e5; text-align: center; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .summary { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                        .breakdown { margin-top: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
                        th { background-color: #f9fafb; font-weight: bold; }
                        .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; text-align: right; }
                        .footer { margin-top: 50px; text-align: center; font-size: 0.8em; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Construction Budget Estimate</h1>
                        <p>Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div class="summary">
                        <h2>Project Summary</h2>
                        <p>Area: ${calculationResults.area} ${calculationResults.unit}</p>
                        <p>Floors: ${calculationResults.floors}</p>
                        <p>Rooms: ${calculationResults.rooms}</p>
                        <p>HVAC Included: ${calculationResults.include_hvac ? 'Yes' : 'No'}</p>
                        <p>Solar System: ${calculationResults.include_solar ? `Yes (${calculationResults.solar_capacity} kW)` : 'No'}</p>
                        <p>Estimation Model: ${calculationResults.model_type ? calculationResults.model_type.charAt(0).toUpperCase() + calculationResults.model_type.slice(1) : 'Hybrid'}</p>
                    </div>
                    
                    <div class="breakdown">
                        <h2>Cost Breakdown</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Amount (PKR)</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
        `);

        const totalCost = calculationResults.total_cost;

        if (calculationResults.pie_chart_data && calculationResults.pie_chart_data.labels) {
            calculationResults.pie_chart_data.labels.forEach((label, index) => {
                const value = calculationResults.pie_chart_data.values[index];
                const percentage = ((value / totalCost) * 100).toFixed(1);

                printWindow.document.write(`
                    <tr>
                        <td>${label}</td>
                        <td>${formatCurrency(value)}</td>
                        <td>${percentage}%</td>
                    </tr>
                `);
            });
        }

        printWindow.document.write(`
                            </tbody>
                        </table>
                        
                        <div class="total">
                            Total Estimated Cost: ${formatCurrency(totalCost)}
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>This estimate is based on current construction rates in Pakistan.</p>
                        <p>Powered by InfraEstateAI - Construction Budget Estimator</p>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    // Reset form and results
    const resetCalculator = () => {
        setFormData({
            area: 5,
            unit: "Marla",
            floors: 1,
            rooms: 1,
            include_hvac: false,
            include_solar: false,
            solar_capacity: 0,
            model_type: "hybrid"
        });
        setCalculationResults(null);
        setChartData(null);
        showNotification("Calculator reset");
    };

    // Reset suggestion form
    const resetSuggestions = () => {
        setSuggestionForm({
            area: 5,
            unit: "Marla",
            budget: 5000000,
            include_hvac: false,
            include_solar: false,
            solar_capacity: 0,
            max_floors: 3
        });
        setSuggestions([]);
        setSuggestionError(null);
        showNotification("Suggestion form reset");
    };

    return (
        <div className="cbe-container">
            <div className="cbe-content">
                {/* Header */}
                <div className="cbe-header">
                    <h1 className="cbe-title">
                        <span className="cbe-title-gradient">Construction Budget Estimator</span>
                    </h1>
                    <p className="cbe-subtitle">
                        Calculate accurate construction costs for residential buildings in Pakistan with detailed
                        breakdowns and visualizations
                    </p>
                </div>

                {/* Tabs */}
                <div className="cbe-tabs">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        className="cbe-tabs-container"
                        variant="fullWidth"
                    >
                        <Tab icon={<CalculateIcon/>} label="Budget Calculator"/>
                        <Tab icon={<LightbulbIcon/>} label="Layout Suggestions"/>
                    </Tabs>
                </div>

                {/* Main Content */}
                <div className="cbe-main">
                    {/* Calculator Tab */}
                    {activeTab === 0 && (
                        <>
                            {/* Input Panel */}
                            <div className="cbe-panel cbe-input-panel">
                                <div className="cbe-panel-header">
                                    <CalculateIcon className="cbe-panel-icon"/>
                                    <h2 className="cbe-panel-title">Cost Parameters</h2>
                                </div>

                                <div className="cbe-form">
                                    {/* Area */}
                                    <div className="cbe-form-group">
                                        <label className="cbe-label">
                                            <SquareFootIcon className="cbe-input-icon"/>
                                            Area Size
                                        </label>
                                        <div className="cbe-input-with-unit">
                                            <input
                                                type="number"
                                                name="area"
                                                value={formData.area}
                                                onChange={handleInputChange}
                                                min="1"
                                                step="0.5"
                                                className="cbe-input"
                                            />
                                            <select
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleInputChange}
                                                className="cbe-select cbe-unit-select"
                                            >
                                                {units.map((unit) => (
                                                    <option key={unit} value={unit}>
                                                        {unit}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Floors and Rooms */}
                                    <div className="cbe-form-row">
                                        <div className="cbe-form-group">
                                            <label className="cbe-label">
                                                <LayersIcon className="cbe-input-icon"/>
                                                Number of Floors
                                            </label>
                                            <input
                                                type="number"
                                                name="floors"
                                                value={formData.floors}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="5"
                                                className="cbe-input"
                                            />
                                        </div>
                                        <div className="cbe-form-group">
                                            <label className="cbe-label">
                                                <MeetingRoomIcon className="cbe-input-icon"/>
                                                Number of Rooms
                                            </label>
                                            <input
                                                type="number"
                                                name="rooms"
                                                value={formData.rooms}
                                                onChange={handleInputChange}
                                                min="1"
                                                className="cbe-input"
                                            />
                                        </div>
                                    </div>

                                    {/* HVAC and Solar Switches */}
                                    <div className="cbe-form-row">
                                        <div className="cbe-form-group cbe-form-group-switch">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formData.include_hvac}
                                                        onChange={handleInputChange}
                                                        name="include_hvac"
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <div className="cbe-switch-label">
                                                        <AcUnitIcon className="cbe-input-icon"/>
                                                        Include HVAC
                                                    </div>
                                                }
                                            />
                                        </div>

                                        <div className="cbe-form-group cbe-form-group-switch">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formData.include_solar}
                                                        onChange={handleInputChange}
                                                        name="include_solar"
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <div className="cbe-switch-label">
                                                        <WbSunnyIcon className="cbe-input-icon"/>
                                                        Include Solar
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Solar Capacity (conditional) */}
                                    {formData.include_solar && (
                                        <div className="cbe-form-group">
                                            <label className="cbe-label">
                                                <ElectricalServicesIcon className="cbe-input-icon"/>
                                                Solar Capacity (kW)
                                            </label>
                                            <input
                                                type="number"
                                                name="solar_capacity"
                                                value={formData.solar_capacity}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="15"
                                                step="1"
                                                className="cbe-input"
                                            />
                                        </div>
                                    )}

                                    {/* Model Type Selection */}
                                    <div className="cbe-form-group">
                                        <label className="cbe-label">
                                            <SmartToyIcon className="cbe-input-icon"/>
                                            Estimation Model
                                        </label>
                                        <div className="cbe-model-type-selector">
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    row
                                                    name="model_type"
                                                    value={formData.model_type}
                                                    onChange={handleModelTypeChange}
                                                >
                                                    {modelTypes.map((type) => (
                                                        <FormControlLabel
                                                            key={type.value}
                                                            value={type.value}
                                                            control={<Radio color="primary"/>}
                                                            label={type.label}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                    </div>

                                    <div className="cbe-form-buttons">
                                        <button
                                            onClick={calculateBudget}
                                            disabled={isLoading}
                                            className="cbe-button cbe-primary-button"
                                        >
                                            <CalculateIcon className="cbe-button-icon"/>
                                            Calculate Budget
                                        </button>
                                        <button
                                            onClick={resetCalculator}
                                            className="cbe-button cbe-secondary-button"
                                        >
                                            <RefreshIcon className="cbe-button-icon"/>
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                <div className="cbe-rate-info">
                                    <h3 className="cbe-rate-title">Current Construction Rates</h3>
                                    <div className="cbe-rates-grid">
                                        <div className="cbe-rate-item">
                                            <span className="cbe-rate-label">Grey Structure</span>
                                            <span
                                                className="cbe-rate-value">{formatCurrency(rates.grey_structure_rate)}/sqft</span>
                                        </div>
                                        <div className="cbe-rate-item">
                                            <span className="cbe-rate-label">Finishing</span>
                                            <span
                                                className="cbe-rate-value">{formatCurrency(rates.finishing_rate)}/sqft</span>
                                        </div>
                                        <div className="cbe-rate-item">
                                            <span className="cbe-rate-label">Electrical</span>
                                            <span
                                                className="cbe-rate-value">{formatCurrency(rates.electrical_rate)}/sqft</span>
                                        </div>
                                        <div className="cbe-rate-item">
                                            <span className="cbe-rate-label">Plumbing</span>
                                            <span
                                                className="cbe-rate-value">{formatCurrency(rates.plumbing_rate)}/sqft</span>
                                        </div>
                                        <div className="cbe-rate-item">
                                            <span className="cbe-rate-label">HVAC</span>
                                            <span
                                                className="cbe-rate-value">{formatCurrency(rates.hvac_rate)}/sqft</span>
                                        </div>
                                        <div className="cbe-rate-item">
                                            <span className="cbe-rate-label">Solar Panel</span>
                                            <span
                                                className="cbe-rate-value">{formatCurrency(rates.solar_panel_cost_per_watt)}/watt</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="cbe-history-toggle">
                                    <button
                                        className="cbe-button cbe-text-button"
                                        onClick={() => {
                                            setShowHistory(!showHistory);
                                            if (!showHistory) {
                                                // Reload history data when showing history panel
                                                fetchCalculationHistory();
                                            }
                                        }}
                                    >
                                        <HistoryIcon className="cbe-button-icon"/>
                                        {showHistory ? 'Hide Calculation History' : 'View Calculation History'}
                                    </button>
                                </div>
                            </div>

                            {/* Results Panel */}
                            {calculationResults ? (
                                <div className="cbe-panel cbe-results-panel">
                                    <div className="cbe-panel-header">
                                        <CurrencyRupeeIcon className="cbe-panel-icon"/>
                                        <h2 className="cbe-panel-title">Budget Estimate</h2>
                                    </div>

                                    <div className="cbe-results-summary">
                                        <div className="cbe-total-cost">
                                            <span className="cbe-total-label">Total Estimated Cost</span>
                                            <span
                                                className="cbe-total-value">{formatCurrency(calculationResults.total_cost || calculationResults.total_project_cost)}</span>
                                        </div>
                                        <div className="cbe-project-details">
                                            <div className="cbe-detail-item">
                                                <span className="cbe-detail-label">Area</span>
                                                <span
                                                    className="cbe-detail-value">{calculationResults.area} {calculationResults.unit}</span>
                                            </div>
                                            <div className="cbe-detail-item">
                                                <span className="cbe-detail-label">Floors</span>
                                                <span className="cbe-detail-value">{calculationResults.floors}</span>
                                            </div>
                                            <div className="cbe-detail-item">
                                                <span className="cbe-detail-label">Rooms</span>
                                                <span className="cbe-detail-value">{calculationResults.rooms}</span>
                                            </div>
                                            <div className="cbe-detail-item">
                                                <span className="cbe-detail-label">HVAC</span>
                                                <span
                                                    className="cbe-detail-value">{calculationResults.include_hvac ? 'Included' : 'Not Included'}</span>
                                            </div>
                                            <div className="cbe-detail-item">
                                                <span className="cbe-detail-label">Solar System</span>
                                                <span className="cbe-detail-value">
                                                {calculationResults.include_solar
                                                    ? `${calculationResults.solar_capacity} kW`
                                                    : 'Not Included'}
                                            </span>
                                            </div>
                                            <div className="cbe-detail-item">
                                                <span className="cbe-detail-label">Model Type</span>
                                                <span className="cbe-detail-value">
                                                {calculationResults.model_type
                                                    ? calculationResults.model_type.charAt(0).toUpperCase() + calculationResults.model_type.slice(1)
                                                    : 'Hybrid'}
                                            </span>
                                            </div>
                                            <div className="cbe-detail-item">
                                                <span className="cbe-detail-label">Square Footage</span>
                                                <span className="cbe-detail-value">
                                                {calculationResults.converted_area.toLocaleString()} sq ft
                                            </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cbe-chart-container">
                                        <div className="cbe-chart-header">
                                            <h3 className="cbe-chart-title">Cost Breakdown</h3>
                                            <div className="cbe-chart-toggle">
                                                <button
                                                    className={`cbe-chart-toggle-button ${activeChart === 'pie' ? 'cbe-active' : ''}`}
                                                    onClick={() => setActiveChart('pie')}
                                                >
                                                    <PieChartIcon className="cbe-button-icon"/>
                                                    Pie Chart
                                                </button>
                                                <button
                                                    className={`cbe-chart-toggle-button ${activeChart === 'bar' ? 'cbe-active' : ''}`}
                                                    onClick={() => setActiveChart('bar')}
                                                >
                                                    <BarChartIcon className="cbe-button-icon"/>
                                                    Bar Chart
                                                </button>
                                            </div>
                                        </div>

                                        <div className="cbe-chart">
                                            {chartData && (
                                                <>
                                                    <div
                                                        className={`cbe-pie-chart ${activeChart === 'pie' ? 'cbe-chart-visible' : ''}`}>
                                                        <Pie
                                                            data={chartData.pie}
                                                            options={{
                                                                plugins: {
                                                                    legend: {
                                                                        position: 'right',
                                                                        labels: {
                                                                            boxWidth: 15,
                                                                            padding: 15,
                                                                            font: {
                                                                                size: 12
                                                                            }
                                                                        }
                                                                    },
                                                                    tooltip: {
                                                                        callbacks: {
                                                                            label: function (context) {
                                                                                const label = context.label || '';
                                                                                const value = context.raw || 0;
                                                                                const percentage = ((value / calculationResults.total_cost) * 100).toFixed(1);
                                                                                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                maintainAspectRatio: false
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={`cbe-bar-chart ${activeChart === 'bar' ? 'cbe-chart-visible' : ''}`}>
                                                        <Bar
                                                            data={chartData.bar}
                                                            options={{
                                                                plugins: {
                                                                    legend: {
                                                                        display: false
                                                                    },
                                                                    tooltip: {
                                                                        callbacks: {
                                                                            label: function (context) {
                                                                                const label = context.dataset.label || '';
                                                                                const value = context.raw || 0;
                                                                                return `${label}: ${formatCurrency(value)}`;
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                scales: {
                                                                    y: {
                                                                        beginAtZero: true,
                                                                        ticks: {
                                                                            callback: function (value) {
                                                                                if (value >= 1000000) {
                                                                                    return (value / 1000000).toFixed(1) + 'M';
                                                                                } else if (value >= 1000) {
                                                                                    return (value / 1000).toFixed(0) + 'K';
                                                                                }
                                                                                return value;
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                maintainAspectRatio: false
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="cbe-cost-breakdown">
                                            <h3 className="cbe-breakdown-title">Detailed Breakdown</h3>
                                            <div className="cbe-breakdown-table">
                                                <div className="cbe-breakdown-header">
                                                    <span className="cbe-breakdown-cell">Component</span>
                                                    <span className="cbe-breakdown-cell">Cost</span>
                                                    <span className="cbe-breakdown-cell">Percentage</span>
                                                </div>
                                                {calculationResults.pie_chart_data && calculationResults.pie_chart_data.labels &&
                                                    calculationResults.pie_chart_data.labels.map((label, index) => {
                                                        const value = calculationResults.pie_chart_data.values[index];
                                                        const percentage = ((value / calculationResults.total_cost) * 100).toFixed(1);
                                                        return (
                                                            <div key={index} className="cbe-breakdown-row">
                                                            <span className="cbe-breakdown-cell">
                                                                <span
                                                                    className="cbe-color-indicator"
                                                                    style={{backgroundColor: chartColors[index]}}
                                                                ></span>
                                                                {label}
                                                            </span>
                                                                <span
                                                                    className="cbe-breakdown-cell cbe-breakdown-value">
                                                                {formatCurrency(value)}
                                                            </span>
                                                                <span
                                                                    className="cbe-breakdown-cell cbe-breakdown-percent">
                                                                {percentage}%
                                                            </span>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <div className="cbe-breakdown-row cbe-breakdown-total">
                                                    <span className="cbe-breakdown-cell">Total</span>
                                                    <span className="cbe-breakdown-cell cbe-breakdown-value">
                                                    {formatCurrency(calculationResults.total_cost || calculationResults.total_project_cost)}
                                                </span>
                                                    <span
                                                        className="cbe-breakdown-cell cbe-breakdown-percent">100%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cbe-actions">
                                        <button
                                            className="cbe-button cbe-primary-button"
                                            onClick={printReport}
                                        >
                                            <PrintIcon className="cbe-button-icon"/>
                                            Print Report
                                        </button>
                                        <button
                                            className="cbe-button cbe-secondary-button"
                                            onClick={resetCalculator}
                                        >
                                            <RefreshIcon className="cbe-button-icon"/>
                                            New Calculation
                                        </button>
                                    </div>
                                </div>
                            ) : showHistory ? (
                                <div className="cbe-panel cbe-history-panel">
                                    <div className="cbe-panel-header">
                                        <HistoryIcon className="cbe-panel-icon"/>
                                        <h2 className="cbe-panel-title">Calculation History</h2>
                                    </div>

                                    {calculationHistory.length > 0 ? (
                                        <div className="cbe-history-list">
                                            {calculationHistory.map((calc, index) => (
                                                <div key={calc.id || index} className="cbe-history-item">
                                                    <div className="cbe-history-details">
                                                        <div className="cbe-history-main">
                                                        <span className="cbe-history-date">
                                                            {new Date(calc.timestamp).toLocaleDateString()}
                                                        </span>
                                                            <span className="cbe-history-cost">
                                                            {formatCurrency(calc.total_cost)}
                                                        </span>
                                                        </div>
                                                        <div className="cbe-history-specs">
                                                        <span className="cbe-history-spec">
                                                            {calc.area} {calc.unit}
                                                        </span>
                                                            <span className="cbe-history-spec">
                                                            <LayersIcon fontSize="small"/> {calc.floors} Floor(s)
                                                        </span>
                                                            <span className="cbe-history-spec">
                                                            <MeetingRoomIcon fontSize="small"/> {calc.rooms} Room(s)
                                                        </span>
                                                            {calc.include_hvac && (
                                                                <span className="cbe-history-spec">
                                                                <AcUnitIcon fontSize="small"/> HVAC
                                                            </span>
                                                            )}
                                                            {calc.include_solar && (
                                                                <span className="cbe-history-spec">
                                                                <WbSunnyIcon fontSize="small"/> {calc.solar_capacity} kW
                                                            </span>
                                                            )}
                                                            <span className="cbe-history-spec">
                                                            <SmartToyIcon
                                                                fontSize="small"/> {calc.model_type ? calc.model_type.charAt(0).toUpperCase() + calc.model_type.slice(1) : 'Hybrid'}
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="cbe-button cbe-small-button"
                                                        onClick={() => viewCalculationDetails(calc.id)}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="cbe-no-history">
                                            <p>No calculation history found.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="cbe-panel cbe-empty-panel">
                                    <div className="cbe-empty-content">
                                        <HomeIcon className="cbe-empty-icon"/>
                                        <h3 className="cbe-empty-title">Calculate Your Construction Budget</h3>
                                        <p className="cbe-empty-text">
                                            Enter your construction parameters and press "Calculate Budget" to see a
                                            detailed
                                            breakdown of estimated costs.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Layout Suggestions Tab */}
                    {activeTab === 1 && (
                        <>
                            {/* Suggestion Input Panel */}
                            <div className="cbe-panel cbe-input-panel">
                                <div className="cbe-panel-header">
                                    <LightbulbIcon className="cbe-panel-icon"/>
                                    <h2 className="cbe-panel-title">Layout Suggestions</h2>
                                </div>

                                <div className="cbe-form">
                                    <div className="cbe-suggestion-intro">
                                        <p>Enter your budget and property details to get recommendations for the best
                                            layout options that fit within your budget.</p>
                                    </div>

                                    {/* Area */}
                                    <div className="cbe-form-group">
                                        <label className="cbe-label">
                                            <SquareFootIcon className="cbe-input-icon"/>
                                            Area Size
                                        </label>
                                        <div className="cbe-input-with-unit">
                                            <input
                                                type="number"
                                                name="area"
                                                value={suggestionForm.area}
                                                onChange={handleSuggestionInputChange}
                                                min="1"
                                                step="0.5"
                                                className="cbe-input"
                                            />
                                            <select
                                                name="unit"
                                                value={suggestionForm.unit}
                                                onChange={handleSuggestionInputChange}
                                                className="cbe-select cbe-unit-select"
                                            >
                                                {units.map((unit) => (
                                                    <option key={unit} value={unit}>
                                                        {unit}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div className="cbe-form-group">
                                        <label className="cbe-label">
                                            <CurrencyRupeeIcon className="cbe-input-icon"/>
                                            Maximum Budget (PKR)
                                        </label>
                                        <input
                                            type="number"
                                            name="budget"
                                            value={suggestionForm.budget}
                                            onChange={handleSuggestionInputChange}
                                            min="1000000"
                                            step="100000"
                                            className="cbe-input"
                                        />
                                    </div>

                                    {/* Max Floors */}
                                    <div className="cbe-form-group">
                                        <label className="cbe-label">
                                            <LayersIcon className="cbe-input-icon"/>
                                            Maximum Floors to Consider
                                        </label>
                                        <input
                                            type="number"
                                            name="max_floors"
                                            value={suggestionForm.max_floors}
                                            onChange={handleSuggestionInputChange}
                                            min="1"
                                            max="5"
                                            className="cbe-input"
                                        />
                                    </div>

                                    {/* HVAC and Solar Switches */}
                                    <div className="cbe-form-row">
                                        <div className="cbe-form-group cbe-form-group-switch">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={suggestionForm.include_hvac}
                                                        onChange={handleSuggestionInputChange}
                                                        name="include_hvac"
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <div className="cbe-switch-label">
                                                        <AcUnitIcon className="cbe-input-icon"/>
                                                        Include HVAC
                                                    </div>
                                                }
                                            />
                                        </div>

                                        <div className="cbe-form-group cbe-form-group-switch">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={suggestionForm.include_solar}
                                                        onChange={handleSuggestionInputChange}
                                                        name="include_solar"
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <div className="cbe-switch-label">
                                                        <WbSunnyIcon className="cbe-input-icon"/>
                                                        Include Solar
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Solar Capacity (conditional) */}
                                    {suggestionForm.include_solar && (
                                        <div className="cbe-form-group">
                                            <label className="cbe-label">
                                                <ElectricalServicesIcon className="cbe-input-icon"/>
                                                Solar Capacity (kW)
                                            </label>
                                            <input
                                                type="number"
                                                name="solar_capacity"
                                                value={suggestionForm.solar_capacity}
                                                onChange={handleSuggestionInputChange}
                                                min="0"
                                                max="15"
                                                step="1"
                                                className="cbe-input"
                                            />
                                        </div>
                                    )}

                                    <div className="cbe-form-buttons">
                                        <button
                                            onClick={getLayoutSuggestions}
                                            disabled={isSuggestionLoading}
                                            className="cbe-button cbe-primary-button"
                                        >
                                            <LightbulbIcon className="cbe-button-icon"/>
                                            Get Suggestions
                                        </button>
                                        <button
                                            onClick={resetSuggestions}
                                            className="cbe-button cbe-secondary-button"
                                        >
                                            <RefreshIcon className="cbe-button-icon"/>
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions Results Panel */}
                            {/* Suggestions Results Panel */}
                            <div className="cbe-panel cbe-results-panel">
                                <div className="cbe-panel-header">
                                    <TableChartIcon className="cbe-panel-icon"/>
                                    <h2 className="cbe-panel-title">Layout Suggestions</h2>
                                </div>

                                {isSuggestionLoading ? (
                                    <div className="cbe-suggestion-loading">
                                        <div className="cbe-suggestion-loading-animation">
                                            <LightbulbIcon className="cbe-suggestion-loading-icon"/>
                                        </div>
                                        <p>Analyzing possible layouts...</p>
                                    </div>
                                ) : suggestionError ? (
                                    <div className="cbe-suggestion-error">
                                        <ErrorIcon className="cbe-suggestion-error-icon"/>
                                        <p>{suggestionError}</p>
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <div className="cbe-suggestions-container">
                                        <div className="cbe-suggestions-intro">
                                            <p>Here are the best layout options that fit within your budget
                                                of {formatCurrency(suggestionForm.budget)}:</p>
                                        </div>

                                        <TableContainer component={Paper} className="cbe-suggestions-table">
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Floors</TableCell>
                                                        <TableCell>Rooms</TableCell>
                                                        <TableCell>Estimated Cost</TableCell>
                                                        <TableCell>Under Budget By</TableCell>
                                                        <TableCell>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {suggestions.map((suggestion, index) => {
                                                        const budgetDifference = suggestionForm.budget - suggestion.total_project_cost;
                                                        const budgetPercentage = ((budgetDifference / suggestionForm.budget) * 100).toFixed(1);

                                                        return (
                                                            <TableRow key={index} className="cbe-suggestion-row">
                                                                <TableCell>{suggestion.floors}</TableCell>
                                                                <TableCell>{suggestion.rooms}</TableCell>
                                                                <TableCell>{formatCurrency(suggestion.total_project_cost)}</TableCell>
                                                                <TableCell>
                                                                    {formatCurrency(budgetDifference)} ({budgetPercentage}%)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <button
                                                                        className="cbe-button cbe-small-button"
                                                                        onClick={() => applySuggestion(suggestion)}
                                                                    >
                                                                        <CheckCircleIcon fontSize="small"
                                                                                         className="cbe-button-icon"/>
                                                                        Apply
                                                                    </button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {/* Display detailed report */}
                                        {detailedReport && (
                                            <div className="cbe-detailed-report">
                                                <h3 className="cbe-report-title">Expert Recommendation Report</h3>
                                                <div className="cbe-report-content">
                                                    {detailedReport.split('\n').map((paragraph, idx) => (
                                                        paragraph.trim() ?
                                                            paragraph.startsWith('- ') ?
                                                                <li key={idx}>{paragraph.substring(2)}</li> :
                                                                paragraph.startsWith('#') ?
                                                                    <h4 key={idx}>{paragraph.replace(/^#+\s/, '')}</h4> :
                                                                    <p key={idx}>{paragraph}</p>
                                                            : <br key={idx}/>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="cbe-suggestions-help">
                                            <p>Click "Apply" to use a suggestion in the Budget Calculator.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cbe-empty-suggestions">
                                        <LightbulbIcon className="cbe-empty-icon"/>
                                        <h3 className="cbe-empty-title">Get Layout Recommendations</h3>
                                        <p className="cbe-empty-text">
                                            Enter your budget and property details on the left to get recommendations
                                            for the best layout options that fit within your budget.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <footer className="cbe-footer">
                    <p className="cbe-footer-text">
                        &copy; 2025 InfraEstateAI. All rights reserved. Construction rates are based on current market
                        prices in Pakistan.
                    </p>
                </footer>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="cbe-loading-overlay">
                    <div className="cbe-loading-container">
                        <div className="cbe-loading-animation">
                            <div className="cbe-building-loader">
                                <div className="cbe-building-base"></div>
                                <div className="cbe-building-floor cbe-floor-1"></div>
                                <div className="cbe-building-floor cbe-floor-2"></div>
                                <div className="cbe-building-floor cbe-floor-3"></div>
                                <div className="cbe-building-roof"></div>
                                <div className="cbe-building-crane">
                                    <div className="cbe-crane-arm"></div>
                                    <div className="cbe-crane-weight"></div>
                                    <div className="cbe-crane-cabin"></div>
                                    <div className="cbe-crane-cable"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="cbe-loading-title">
                            Calculating Budget...
                        </h3>
                        <p className="cbe-loading-description">
                            Analyzing construction parameters and current market rates.
                        </p>
                        <div className="cbe-loading-progress">
                            <div className="cbe-loading-progress-bar"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="cbe-error">
                    <div className="cbe-error-content">
                        <div className="cbe-error-icon">
                            <ErrorIcon/>
                        </div>
                        <div className="cbe-error-message">
                            <p>{error}</p>
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
                    className="cbe-notification"
                >{notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ConstructionBudgetEstimator;