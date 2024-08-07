import pytest
from unittest.mock import patch
from langdetect.lang_detect_exception import LangDetectException
from Data_processing_cloud.Functions.is_english import is_english 

def test_is_english_valid():
    with patch('Data_processing_cloud.Functions.is_english.detect') as mock_detect:
        mock_detect.return_value = 'en'
        assert is_english("This is an English text.") == True
        mock_detect.assert_called_once_with("This is an English text.")

def test_is_english_invalid():
    with patch('Data_processing_cloud.Functions.is_english.detect') as mock_detect:
        mock_detect.return_value = 'fr'
        assert is_english("Ceci est un texte en français.") == False
        mock_detect.assert_called_once_with("Ceci est un texte en français.")

def test_is_english_exception():
    with patch('Data_processing_cloud.Functions.is_english.detect', side_effect=LangDetectException(code="Error", message="Error occurred")):
        assert is_english(None) == False
        assert is_english("") == False
        assert is_english(" ") == False
        assert is_english(12345) == False  # Non-string input
        assert is_english("!!!") == False  # Nonsensical input
        assert is_english("Lorem ipsum dolor sit amet, consectetur adipiscing elit.") == False

def test_is_english_special_characters():
    with patch('Data_processing_cloud.Functions.is_english.detect') as mock_detect:
        mock_detect.return_value = 'und'  # 'und' for undefined
        assert is_english("!@#$$%^&*()_+") == False
        mock_detect.assert_called_once_with("!@#$$%^&*()_+")

def test_is_english_numbers():
    with patch('Data_processing_cloud.Functions.is_english.detect') as mock_detect:
        mock_detect.return_value = 'und'  # 'und' for undefined
        assert is_english("1234567890") == False
        mock_detect.assert_called_once_with("1234567890")

def test_is_english_mixed_input():
    with patch('Data_processing_cloud.Functions.is_english.detect') as mock_detect:
        mock_detect.return_value = 'en'
        assert is_english("This is a text with numbers 123 and symbols @#!") == True
        mock_detect.assert_called_once_with("This is a text with numbers 123 and symbols @#!")

def test_is_english_non_ascii():
    with patch('Data_processing_cloud.Functions.is_english.detect') as mock_detect:
        mock_detect.return_value = 'zh-cn'  # Chinese language code
        assert is_english("这是中文文本。") == False  # Chinese text
        mock_detect.assert_called_once_with("这是中文文本。")

def test_is_english_emoji():
    with patch('Data_processing_cloud.Functions.is_english.detect') as mock_detect:
        mock_detect.return_value = 'und'  # 'und' for undefined
        assert is_english("😊👍💯") == False  # Emoji input
        mock_detect.assert_called_once_with("😊👍💯")

if __name__ == "__main__":
    pytest.main()