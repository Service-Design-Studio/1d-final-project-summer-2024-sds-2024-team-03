import pytest
from unittest.mock import patch, Mock
import json
import logging
from Data_processing_cloud.Gemini_Models.Sentiment_Score_Category_model import classify_sentiment



def test_classify_sentiment_successful_response():
    # Mock response
    mock_response = Mock()
    mock_response.text = '{"sentiment_score": 3.7, "sentiment_category": "Satisfied", "sentiment_description": "The customer expresses a higher satisfaction with DBS due to more ATMs and easier usability compared to [Field-Competitor_Bank]."}'

    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.return_value = mock_response

        score, category = classify_sentiment("Why are you MORE satisfied with DBS local payment and transfer services than [Field-Competitor_Bank]'s?: More ATMs, very easy to use (payment/transfer)")
        assert score == 3.7
        assert category == "Satisfied"

def test_classify_sentiment_unexpected_keys():
    # Mock response
    mock_response = Mock()
    mock_response.text = '{"unexpected_key": "value"}'

    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.return_value = mock_response

        score, category = classify_sentiment("Some feedback text")
        assert score is None
        assert category is None

def test_classify_sentiment_exception_handling():
    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.side_effect = Exception("Test exception")

        score, category = classify_sentiment("Some feedback text")
        assert score is None
        assert category is None

def test_classify_sentiment_retry_logic():
    # Mock response with exception
    mock_response = Mock()
    mock_response.text = '{"sentiment_score": 2.6, "sentiment_category": "Neutral", "sentiment_description": "The customer has no comments and hence is neutral."}'

    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        # Raise exception on the first call, return mock response on the second call
        mock_model_instance.generate_content.side_effect = [Exception("Temporary error"), mock_response]

        score, category = classify_sentiment("Meh")
        assert score == 2.6
        assert category == "Neutral"


def test_classify_sentiment_empty_text():
    mock_response = Mock()
    mock_response.text = '{"sentiment_score": 2.6, "sentiment_category": "Neutral", "sentiment_description": "The customer has no comments and hence is neutral."}'

    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.return_value = mock_response

        score, category = classify_sentiment("")
        assert score == 2.6
        assert category == "Neutral"


def test_classify_sentiment_very_long_text():
    long_text = "A" * 10000
    mock_response = Mock()
    mock_response.text = '{"sentiment_score": 2.6, "sentiment_category": "Neutral", "sentiment_description": "The customer has mixed feelings about the long text."}'

    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.return_value = mock_response

        score, category = classify_sentiment(long_text)
        assert score == 2.6
        assert category == "Neutral"


def test_classify_sentiment_invalid_json():
    mock_response = Mock()
    mock_response.text = '{"sentiment_score": 3.7, "sentiment_category": "Satisfied", "sentiment_description": "The customer is satisfied with the service."'

    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.return_value = mock_response

        score, category = classify_sentiment("Some feedback text")
        assert score is None
        assert category is None


def test_classify_sentiment_generation_exception():
    with patch('vertexai.generative_models.GenerativeModel') as mock_model:
        mock_model_instance = Mock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.side_effect = Exception("Generation error")

        score, category = classify_sentiment("Some feedback text")
        assert score is None
        assert category is None
