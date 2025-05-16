# run_tests.py
import unittest
import sys
from io import StringIO
import datetime


def run_test_suite(test_module_name):
    # Import the test module
    __import__(test_module_name)

    # Create a test suite from the module
    suite = unittest.defaultTestLoader.loadTestsFromName(test_module_name)

    # Redirect stdout to capture the output
    stdout_backup = sys.stdout
    result_stream = StringIO()
    sys.stdout = result_stream

    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # Restore stdout
    sys.stdout = stdout_backup

    # Get the test results
    output = result_stream.getvalue()

    # Add summary of test results
    summary = f"\n{'=' * 80}\n"
    summary += f"TEST SUMMARY FOR {test_module_name}\n"
    summary += f"Run at: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    summary += f"Ran {result.testsRun} tests\n"
    summary += f"Failures: {len(result.failures)}\n"
    summary += f"Errors: {len(result.errors)}\n"
    summary += f"Skipped: {len(result.skipped)}\n"

    return output + summary


if __name__ == "__main__":
    # Test modules to run
    test_modules = ['test_parametric', 'test_hybrid_estimator']

    for module in test_modules:
        # Run the tests
        results = run_test_suite(module)

        # Save the results to a file
        filename = f"{module}_results.txt"
        with open(filename, 'w') as f:
            f.write(results)

        print(f"Test results for {module} saved to {filename}")