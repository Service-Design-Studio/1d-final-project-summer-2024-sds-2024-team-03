import pytest
import pandas as pd
from unittest.mock import patch, MagicMock

# Make sure this import is correct
from Data_processing_cloud.Functions.social_media import process_social_media_data  # Replace 'your_module' with the actual module name
from Data_processing_cloud.Functions.is_english import is_english
from Data_processing_cloud.Functions.valid_feedback import is_valid_feedback
@pytest.fixture
def sample_data():
    return pd.DataFrame({
        'date': ['2023/01/01', '2023/01/02', '2023/01/03'],
        'feedback': ['Great product so amazing!', 'Could be better', 'Love it please keep it up!'],
    })

@pytest.fixture
def mock_dependencies():
    with patch('Data_processing_cloud.Functions.social_media.pd.read_csv') as mock_read_csv, \
         patch('Data_processing_cloud.Functions.social_media.pd.read_excel') as mock_read_excel, \
         patch('Data_processing_cloud.Functions.social_media.publish_message') as mock_publish_message, \
         patch('Data_processing_cloud.Functions.social_media.find_best_match') as mock_find_best_match, \
         patch('Data_processing_cloud.Functions.social_media.classification_defined_products') as mock_defined_products, \
         patch('Data_processing_cloud.Functions.social_media.classification_undefined_products') as mock_undefined_products, \
         patch('Data_processing_cloud.Functions.social_media.format_date', side_effect=lambda x: x.replace('/', '-')) as mock_format_date:
        #  patch('Data_processing_cloud.Functions.social_media.is_valid_feedback', return_value=True) as mock_is_valid_feedback:
 
        mock_read_csv.return_value = pd.DataFrame({
            'date': ['2023/01/01', '2023/01/02', '2023/01/03'],
            'feedback': ['Great product so amazing!', 'Could be better', 'Love it please keep it up!'],
        })
        mock_read_excel.return_value = mock_read_csv.return_value
        mock_find_best_match.return_value = 'TestSubproduct'
        mock_defined_products.side_effect = lambda df: df
        mock_undefined_products.side_effect = lambda df: df

        yield {
            'read_csv': mock_read_csv,
            'read_excel': mock_read_excel,
            'publish_message': mock_publish_message,
            'find_best_match': mock_find_best_match,
            'classification_defined_products': mock_defined_products,
            'classification_undefined_products': mock_undefined_products,
            #'is_english': mock_is_english,
            'format_date': mock_format_date,
            #'is_valid_feedback': mock_is_valid_feedback
        }

def test_process_social_media_data_integration_defined_product(sample_data, mock_dependencies, tmp_path):
    file_path = tmp_path / "test_data.csv"
    sample_data.to_csv(file_path, index=False)
    print(f"File contents:\n{file_path.read_text()}")

    print(f"File path: {file_path}")
    print(f"File exists: {file_path.exists()}")
    # Read the raw contents of the file to see exactly what's written
    with open(file_path, 'r') as file:
        contents = file.read()
        print(contents)

    
    try:
        result = process_social_media_data(file_path, "TestProduct", "TestSource")
        print(f"Result: {result}")
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise

    assert isinstance(result, pd.DataFrame)
    assert list(result.columns) == ['Date', 'Feedback', 'Product', 'Subcategory', 'Feedback Category', 'Sentiment', 'Sentiment Score', 'Source']
    assert len(result) == len(sample_data)
    assert all(result['Date'].apply(lambda x: isinstance(x, str) and '-' in x))
    assert all(result['Source'] == "TestSource")
    
    mock_dependencies['find_best_match'].assert_called_once_with("TestProduct")
    mock_dependencies['classification_defined_products'].assert_called_once()
    mock_dependencies['classification_undefined_products'].assert_not_called()

def test_process_social_media_data_empty_input(mock_dependencies, tmp_path):
    file_path = tmp_path / "empty_data.csv"
    pd.DataFrame().to_csv(file_path, index=False) 
    with patch('Data_processing_cloud.Functions.social_media.pd.read_csv', return_value=pd.DataFrame()), \
         patch('Data_processing_cloud.Functions.social_media.pd.read_excel', return_value=pd.DataFrame()):
        # Other mocks as necessary
        #result = process_social_media_data(file_path, "TestProduct", "TestSource")

     # Create an empty CSV

    #result = process_social_media_data(file_path, "TestProduct", "TestSource")

        with pytest.raises(ValueError, match="Date column is needed for processing"):
            result = process_social_media_data(file_path, "TestProduct", "TestSource")


def test_feedback_with_valid_input():
    assert is_valid_feedback("This is valid feedback.") == True, "Should return True for valid feedback"

def test_feedback_with_empty_string():
    assert is_valid_feedback("") == False, "Should return False for an empty string"

def test_feedback_with_na():
    assert is_valid_feedback(pd.NA) == False, "Should return False for pd.NA"

def test_feedback_with_nan():
    assert is_valid_feedback(pd.np.nan) == False, "Should return False for NaN"

def test_feedback_with_one_word():
    assert is_valid_feedback("Word.") == False, "Should return False for single-word feedback"

def test_feedback_with_two_words():
    assert is_valid_feedback("Two words.") == False, "Should return False for two-word feedback"

def test_feedback_with_three_words():
    assert is_valid_feedback("This is valid.") == True, "Should return True for feedback with more than two words"

def test_feedback_with_one_character():
    assert is_valid_feedback("a") == False, "Should return False for single-character feedback"

def test_feedback_with_non_string_input():
    assert is_valid_feedback(123) == False, "Should return False for non-string input"
    assert is_valid_feedback([]) == False, "Should return False for non-string input"
    assert is_valid_feedback({}) == False, "Should return False for non-string input"

