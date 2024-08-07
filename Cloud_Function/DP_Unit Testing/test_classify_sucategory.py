import pytest
from unittest.mock import patch, MagicMock
from Data_processing_cloud.matching_subproduct import find_best_match
from Data_processing_cloud.pubsub_helper import publish_message
from Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model import classify_subcategory  

@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.GenerativeModel')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.find_best_match')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.publish_message')
def test_classify_subcategory_success(mock_publish_message, mock_find_best_match, MockGenerativeModel):
    # Setup mock response
    mock_model_instance = MockGenerativeModel.return_value
    mock_chat_instance = mock_model_instance.start_chat.return_value
    mock_chat_instance.send_message.return_value.text = 'DBS Deposit Account'
    
    # Mock the find_best_match function
    mock_find_best_match.return_value = 'DBS Deposit Account'

    # Call function
    result = classify_subcategory('My account has low interest rates.')

    # Assert result
    assert result == 'DBS Deposit Account'

@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.GenerativeModel')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.find_best_match')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.publish_message')
def test_classify_subcategory_timeout(mock_publish_message, mock_find_best_match, MockGenerativeModel):
    # Setup mock response to raise an exception
    MockGenerativeModel.side_effect = Exception("Model response timed out")

    # Call function
    result = classify_subcategory('Some text')

    # Assert result
    assert result == 'Timeout - Operation could not be completed'

@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.GenerativeModel')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.find_best_match')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.publish_message')
def test_classify_subcategory_invalid_response(mock_publish_message, mock_find_best_match, MockGenerativeModel):
    # Setup mock response
    mock_model_instance = MockGenerativeModel.return_value
    mock_chat_instance = mock_model_instance.start_chat.return_value
    mock_chat_instance.send_message.return_value.text = 'Coint Deposit Machine'

    # Call function
    result = classify_subcategory('Coin deposit issue')

    # Assert result
    assert result == 'Coin Deposit Machine'

@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.GenerativeModel')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.find_best_match')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.publish_message')
def test_classify_subcategory_invalid_format(mock_publish_message, mock_find_best_match, MockGenerativeModel):
    # Setup mock response
    mock_model_instance = MockGenerativeModel.return_value
    mock_chat_instance = mock_model_instance.start_chat.return_value
    mock_chat_instance.send_message.side_effect = Exception("Format Error")

    # Call function
    result = classify_subcategory('Invalid input')

    # Assert result
    assert result == "Timeout - Operation could not be completed"
    mock_publish_message.assert_called_once_with("Model response timed out: Format Error", "ERROR")

@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.GenerativeModel')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.find_best_match')
@patch('Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model.publish_message')
def test_classify_subcategory_empty_input(mock_publish_message, mock_find_best_match, MockGenerativeModel):
    # Setup mock response
    mock_model_instance = MockGenerativeModel.return_value
    mock_chat_instance = mock_model_instance.start_chat.return_value
    mock_chat_instance.send_message.return_value.text = 'Others'

    mock_find_best_match.return_value = "Others"

    # Call function
    result = classify_subcategory('')

    # Assert result
    assert result == 'Others'