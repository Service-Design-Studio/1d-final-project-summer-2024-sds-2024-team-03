import pytest
from unittest.mock import patch
from Data_processing_cloud.main import parse_filename

#TC6
@patch('Data_processing_cloud.main.publish_message')
def test_parse_filename_valid_social_media(mock_publish_message):
    file_path = "/Users/phonavitra/Desktop/term 5/Service Studio/Test/Others__Social Media__smalltest.csv"
    product, source = parse_filename(file_path)
    assert product == "Others"
    assert source == "Social Media"
    mock_publish_message.assert_not_called()

#TC7
@patch('Data_processing_cloud.main.publish_message')
def test_parse_filename_valid_car_loan(mock_publish_message):
    file_path = "/Users/phonavitra/Desktop/term 5/Service Studio/Test/Car Loan__CSS__smalltest.csv"
    product, source = parse_filename(file_path)
    assert product == "Car Loan"
    assert source == "CSS"
    mock_publish_message.assert_not_called()

#TC8
@patch('Data_processing_cloud.main.publish_message')
def test_parse_filename_invalid_format(mock_publish_message):
    file_path = "/Users/phonavitra/Desktop/term 5/Service Studio/Test/smalltest.csv"
    with pytest.raises(ValueError):
        parse_filename(file_path)
    mock_publish_message.assert_called_once_with("Error: Filename format is incorrect. Expected format: 'product__source__fname'", "ERROR")


@patch('Data_processing_cloud.main.publish_message')
def test_parse_filename_invalid_format_extra_separators(mock_publish_message):
    file_path = "/Users/phonavitra/Desktop/term 5/Service Studio/Test/Product__Source__Extra__Filename.csv"
    product, source = parse_filename(file_path)
    assert product == "Product"
    assert source == "Source"
    mock_publish_message.assert_not_called()


@patch('Data_processing_cloud.main.publish_message')
def test_parse_filename_empty_filename(mock_publish_message):
    file_path = "/Users/phonavitra/Desktop/term 5/Service Studio/Test/___.csv"
    with pytest.raises(ValueError):
        parse_filename(file_path)
    mock_publish_message.assert_called_once_with("Error: Filename format is incorrect. Expected format: 'product__source__fname'", "ERROR")
