import pytest
from Data_processing_cloud.Classifications.Classifications_products import classification_defined_products
import pandas as pd
from unittest.mock import patch, call
from pandas import DataFrame

# @pytest.fixture
# def sample_df():
#     return pd.DataFrame({
#         'Date': ['2021-01-01', '2021-01-02'],
#         'Feedback': ['Great service', 'Bad experience'],
#         'Subcategory': ['Credit Card', 'Personal Loan']
#     })

# def test_classification_defined_products(sample_df):
#     with patch('Data_processing_cloud.Classifications.Classifications_products.match_product') as mock_match_product, \
#          patch('Data_processing_cloud.Classifications.Classifications_products.feedback_categorisation') as mock_feedback, \
#          patch('Data_processing_cloud.Classifications.Classifications_products.classify_sentiment') as mock_sentiment:

#         # Setup mocks
#         mock_match_product.side_effect = lambda x: 'Financial Products' if x == 'Credit Card' else 'Loans'
#         mock_feedback.return_value = 'Positive'
#         mock_sentiment.return_value = (3.5, 'Neutral')

#         # Execute the function
#         result_df = classification_defined_products(sample_df)
        
#         # Debug output if None is returned
#         if result_df is None:
#             print("Debug Info: Function returned None")
#             print("Sample DataFrame:", sample_df)
#             return  # Exit test to avoid further NoneType errors
        
#         # Assertions to ensure correct behavior
#         assert result_df is not None, "Function returned None unexpectedly"
#         assert 'Product' in result_df.columns, "Product column should be added"
#         assert result_df['Product'].iloc[0] == 'Financial Products', "Product classification failed"

#         # Check the actual content of the DataFrame to ensure correct processing
#         assert result_df['Feedback Category'].iloc[0] == 'Positive', "Incorrect feedback categorization"
#         assert result_df['Sentiment Score'].iloc[0] == 3.5, "Sentiment scoring failed"

# # Run the test
# if __name__ == "__main__":
#     pytest.main()


data = {'Subcategory': ['Credit Card', 'Education Loan', 'Paylah!'],
        'Feedback': ['Great service', 'Too slow processing', 'App crashes frequently']}
test_df = DataFrame(data)

# Mock results for dependencies
mock_sentiment_results = [('0.8', 'Positive'), ('0.2', 'Negative'), ('0.5', 'Neutral')]

@pytest.fixture
def mock_df_apply(mocker):
    mocker.patch('pandas.DataFrame.apply', return_value=test_df)
    mocker.patch('pandas.Series.apply', return_value=mock_sentiment_results)

@patch('Data_processing_cloud.Classifications.Classifications_products.publish_message')
def test_classification_defined_products_integration(mock_publish, mock_df_apply):
    # Test the integration of the classification pipeline
    result_df = classification_defined_products(test_df)

    # Verify the DataFrame is modified as expected
    assert 'Product' in result_df.columns ### HAVE ERROR
    assert 'Feedback Category' in result_df.columns
    assert 'Sentiment Score' in result_df.columns
    assert 'Sentiment' in result_df.columns
    assert list(result_df['Product']) == ['Cards', 'Unsecured Loans', 'Digital Channels']

    # Verify that publish_message was called correctly
    expected_calls = [
        call('Completed Subcategory Categorisation', 'IN PROGRESS'),
        call('Feedback Categorisation in progress', 'IN PROGRESS'),
        call('Completed Feedback Categorisation', 'IN PROGRESS'),
        call('Sentiment Analysis in progress', 'IN PROGRESS'),
        call('Completed Sentiment Analysis', 'IN PROGRESS')
    ]
    mock_publish.assert_has_calls(expected_calls, any_order=True)

    # Ensure correct handling of errors
    with patch('your_module.classification_defined_products', side_effect=Exception("Test Error")):
        result = classification_defined_products(test_df)
        assert result is None
        mock_publish.assert_called_with("Error - Operation could not be completed: Test Error", 'ERROR')

@pytest.mark.parametrize("subcategory, expected", [
    ('Credit Card', 'Cards'),
    ('Non-Existent Product', 'Others')
])
def test_match_product(subcategory, expected):
    from Data_processing_cloud.Classifications.Classifications_products import match_product
    assert match_product(subcategory) == expected