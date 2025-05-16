import unittest
from unittest.mock import patch, MagicMock
import numpy as np
from core.hybrid_estimator import predict
from core.parametric import Breakdown


class TestHybridEstimator(unittest.TestCase):

    @patch('core.hybrid_estimator._model')
    @patch('core.hybrid_estimator.estimate')
    def test_parametric_only(self, mock_estimate, mock_model):
        """Test predict function with 'parametric' method."""
        # Setup mock
        mock_breakdown = MagicMock(spec=Breakdown)
        mock_breakdown.grey = 2000000
        mock_breakdown.finish = 1800000
        mock_breakdown.elec = 600000
        mock_breakdown.plumb = 600000
        mock_breakdown.hvac = 300000
        mock_breakdown.solar = 700000
        mock_breakdown.total_construction.return_value = 5300000
        mock_breakdown.total_project.return_value = 6000000

        mock_estimate.return_value = mock_breakdown

        # Call the function with parametric method
        result = predict(
            area_sqft=2000,
            floors=2,
            rooms=6,
            include_hvac=True,
            include_solar=True,
            solar_capacity=5,
            method="parametric"
        )

        # Verify estimate was called with correct parameters
        mock_estimate.assert_called_once_with(2000, 2, 6, True, True, 5)

        # Verify result contains correct values
        self.assertEqual(result["grey"], 2000000)
        self.assertEqual(result["finish"], 1800000)
        self.assertEqual(result["elec"], 600000)
        self.assertEqual(result["plumb"], 600000)
        self.assertEqual(result["hvac"], 300000)
        self.assertEqual(result["solar"], 700000)
        self.assertEqual(result["total_construction_cost"], 5300000)
        self.assertEqual(result["total_project_cost"], 6000000)
        self.assertEqual(result["method"], "parametric")

    @patch('core.hybrid_estimator._model')
    @patch('core.hybrid_estimator.estimate')
    def test_ml_only(self, mock_estimate, mock_model):
        """Test predict function with 'ml' method."""
        # Setup mocks
        mock_breakdown = MagicMock(spec=Breakdown)
        mock_breakdown.grey = 2000000
        mock_breakdown.finish = 1800000
        mock_breakdown.elec = 600000
        mock_breakdown.plumb = 600000
        mock_breakdown.hvac = 300000
        mock_breakdown.solar = 700000
        mock_breakdown.total_construction.return_value = 5300000
        mock_breakdown.total_project.return_value = 6000000

        mock_estimate.return_value = mock_breakdown

        # ML model predicts a higher cost
        mock_model.predict.return_value = np.array([7000000])

        # Call the function with ml method
        result = predict(
            area_sqft=2000,
            floors=2,
            rooms=6,
            include_hvac=True,
            include_solar=True,
            solar_capacity=5,
            method="ml"
        )

        # Verify ML model was called with correct features
        mock_model.predict.assert_called_once()
        features = mock_model.predict.call_args[0][0]
        self.assertEqual(features, [[2000, 2, 6, 1, 1, 5]])  # Removed tolist()


    @patch('core.hybrid_estimator._model')
    @patch('core.hybrid_estimator.estimate')
    def test_hybrid_approach(self, mock_estimate, mock_model):
        """Test predict function with 'hybrid' method (default)."""
        # Setup mocks
        mock_breakdown = MagicMock(spec=Breakdown)
        mock_breakdown.grey = 2000000
        mock_breakdown.finish = 1800000
        mock_breakdown.elec = 600000
        mock_breakdown.plumb = 600000
        mock_breakdown.hvac = 300000
        mock_breakdown.solar = 700000
        mock_breakdown.total_construction.return_value = 5300000
        mock_breakdown.total_project.return_value = 6000000

        mock_estimate.return_value = mock_breakdown

        # ML model predicts a higher cost
        mock_model.predict.return_value = np.array([7000000])

        # Call the function with default hybrid method
        result = predict(
            area_sqft=2000,
            floors=2,
            rooms=6,
            include_hvac=True,
            include_solar=True,
            solar_capacity=5
        )

        # Expected hybrid total (ML_WEIGHT = 0.7)
        expected_total = 0.7 * 7000000 + 0.3 * 6000000  # 6700000

        # Verify result contains correct values
        # Scale factor should be 6700000 / 6000000 = 1.1167
        scale_factor = expected_total / 6000000

        self.assertAlmostEqual(result["total_project_cost"], expected_total)
        self.assertEqual(result["method"], "hybrid")

    @patch('core.hybrid_estimator._model', None)
    @patch('core.hybrid_estimator.estimate')
    def test_no_model_fallback(self, mock_estimate):
        """Test predict function falls back to parametric when model is None."""
        # Setup mock
        mock_breakdown = MagicMock(spec=Breakdown)
        mock_breakdown.grey = 2000000
        mock_breakdown.finish = 1800000
        mock_breakdown.elec = 600000
        mock_breakdown.plumb = 600000
        mock_breakdown.hvac = 300000
        mock_breakdown.solar = 700000
        mock_breakdown.total_construction.return_value = 5300000
        mock_breakdown.total_project.return_value = 6000000

        mock_estimate.return_value = mock_breakdown

        # Call the function with ml method (should fall back)
        result = predict(
            area_sqft=2000,
            floors=2,
            rooms=6,
            include_hvac=True,
            include_solar=True,
            solar_capacity=5,
            method="ml"  # Even though we request ML
        )

        # Should still get parametric result
        self.assertEqual(result["method"], "parametric")
        self.assertEqual(result["total_project_cost"], 6000000)


if __name__ == "__main__":
    unittest.main()