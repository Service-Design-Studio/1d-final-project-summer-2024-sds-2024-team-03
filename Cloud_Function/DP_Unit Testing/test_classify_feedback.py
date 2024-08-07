import pytest
from unittest.mock import patch
import re
from Data_processing_cloud.Gemini_Models.Feedback_Categorisation import feedback_categorisation

@pytest.fixture
def mock_generate_content():
    with patch('Data_processing_cloud.Gemini_Models.Feedback_Categorisation.GenerativeModel') as MockGenerativeModel:
        yield MockGenerativeModel.return_value

@pytest.mark.parametrize("text, product, expected", [
    # Basic functionality
    ("Unable to update my mail addresses because system doesn't allow me to key in numbers. So how am I suppose to key in house numbers or postcode??", "Digibank App", "Technical/System Related"),
    ("so many ads blocking the screen.", "PayLah!", "Advertisement"),
    ("Wrong card delivered to me", "Credit Card", "Card Delivery"),
    ("System kept logging me out randomly", "Internet Banking(iBanking)", "Lag/Intermittent Logout"),
    # Edge cases
    ("Some feedback text", "", "Others"),
    ("Some feedback text", "Unknown Product", "Others"),
    ("", "Test Product", "Others"),
    ("Very long feedback " * 100, "Test Product", "Technical/System Related"),
    ("Feedback with special chars *&^%$", "Test Product", "Technical/System Related"),
    ("Test multiple feedbacks: feedback1. feedback2.", "Test Product", "Technical/System Related"),
    # Additional robust cases
    ("Feedback on verification process was frustrating.", "Phone Banking", "Verification Process"),
    ("The UI/UX of the app is really bad.", "Digibank App", "UI/UX"),
    ("The IVR system is difficult to navigate.", "Phone Banking", "IVR"),
    ("The IVR menu options are confusing.", "Phone Banking", "IVR Menu"),
    ("The rate for the insurance is too high.", "General Insurance", "Rate/Policy"),
    ("Having trouble with digital token setup.", "Digibank App", "Digital Token"),
    ("ATM retained my card during transaction.", "ATM", "Card/Cash Retain Issues"),
    ("CNY promotions are great!", "PayLah!", "CNY"),
    ("The hardware of the ATM is not working.", "ATM", "Hardware"),
    ("Just a general feedback.", "General Product", "Others"),
])
def test_feedback_categorisation(mock_generate_content, text, product, expected):
    # Mock the model response dynamically based on the expected output
    mock_generate_content.generate_content.return_value.text = f"{product}: {expected}"
    
    result = feedback_categorisation(text, product)
    pattern = r"[\*\'\"]"
    cleaned_expected = re.sub(pattern, "", expected)
    assert result == cleaned_expected

# def test_handle_invalid_json_response(mock_generate_content):
#     mock_generate_content.generate_content.return_value.text = "Invalid JSON Response"
    
#     result = feedback_categorisation("Test feedback with invalid JSON response", "Test Product")
#     assert result == "Others"

def test_handle_exceptions_gracefully(mock_generate_content):
    mock_generate_content.generate_content.side_effect = Exception("Test Exception")
    
    result = feedback_categorisation("Test feedback with exception", "Test Product")
    assert result == "Others"
