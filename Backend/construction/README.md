# Construction Budget Calculator API

This module adds a construction budget calculator to the Infra Estate AI platform. It allows users to calculate construction costs for residential buildings in Pakistan with detailed breakdowns and visualization data.

## Setup Instructions

1. Place the following files in your project structure:

```
project_root/
├── dependencies.py                 # Authentication and shared dependencies
├── construction/
    ├── __init__.py                # Package initialization
    ├── models.py                  # Data models
    ├── utils.py                   # Calculation utilities
    └── router.py                  # API endpoints
```

2. Add the construction router to your main app.py (already done in your code):

```python
from construction import router as construction_router
app.include_router(construction_router)
```

3. Initialize the construction_rates collection in your database setup (already done in your code):

```python
# Setup construction collections if they don't exist
if "construction_rates" not in db.list_collection_names():
    # Initialize with default rates
    from construction.models import ConstructionRates
    default_rates = ConstructionRates().dict()
    db.construction_rates.insert_one(default_rates)
```

## API Endpoints

### User Endpoints

- `GET /construction/rates` - Get current construction rates
- `POST /construction/calculate` - Calculate construction costs based on input parameters
- `GET /construction/chart-data/{calculation_id}` - Get chart data for a specific calculation
- `GET /construction/calculations` - Get all calculations done by the current user

### Admin Endpoints

- `POST /construction/rates` - Update construction rates (admin only)
- `GET /construction/admin/calculations` - View all calculations (admin only)

## Data Models

### ConstructionInput
```json
{
  "area": 5.0,
  "unit": "Marla",
  "include_hvac": false,
  "include_solar": true,
  "solar_capacity": 5
}
```

### ConstructionRates
```json
{
  "grey_structure_rate": 2700,
  "finishing_rate": 1500,
  "electrical_rate": 400,
  "plumbing_rate": 400, 
  "hvac_rate": 300,
  "solar_panel_cost_per_watt": 33,
  "fixed_solar_equipment_cost": 500000
}
```

### UpdateRatesRequest
```json
{
  "grey_structure_rate": 3000,
  "finishing_rate": 1700
}
```

## Usage Examples

### Calculate Construction Costs

```javascript
// Frontend example
const response = await fetch('/construction/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    area: 5,
    unit: 'Marla',
    include_hvac: false,
    include_solar: true,
    solar_capacity: 5
  })
});

const result = await response.json();
// Use result.pie_chart_data and result.bar_chart_data for charts
```

### Update Construction Rates (Admin)

```javascript
// Admin frontend example
const response = await fetch('/construction/rates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    grey_structure_rate: 3000,
    finishing_rate: 1700
    // Only include rates you want to update
  })
});
```

## Chart Data Format

The API returns data ready to use with charting libraries:

```json
{
  "pie_chart": {
    "labels": ["Grey Structure", "Finishing", "Electrical", "Plumbing", "HVAC"],
    "values": [3678750, 1021875, 272500, 272500, 204375]
  },
  "bar_chart": {
    "labels": ["Grey Structure", "Finishing", "Electrical", "Plumbing", "HVAC"],
    "values": [3678750, 1021875, 272500, 272500, 204375]
  }
}
```

## Database Collections

- `construction_rates` - Stores the current construction rates
- `construction_calculations` - Logs all calculations