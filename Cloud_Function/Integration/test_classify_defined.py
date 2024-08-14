import pytest
from unittest.mock import patch, call
from pandas import DataFrame
from Data_processing_cloud.Classifications.Classifications_products import classification_defined_products

# # Setup test data frames
test_df = DataFrame({
    'Date': ['01/04/2024', '01/05/2024', '01/06/2024'],
    'Subcategory': ['Credit Card', 'Education Loan', 'Paylah!'],
    'Feedback': ['Great service', 'Too slow processing', 'App crashes frequently']
})

error_df = DataFrame({
     'Date': [None, '01/05/2024', '01/06/2024'],
    'Subcategory': [123, 'Education Loan', None],  # Non-string, valid string, and None types
    'Feedback': ['Great service', None, 'App crashes frequently']  # Valid string, None, and valid string
})

@pytest.mark.parametrize("subcategory, expected", [
    ('Credit Card', 'Cards'),
    ('Non-Existent Product', 'Others')
])
def test_match_product(subcategory, expected):
    from Data_processing_cloud.Classifications.Classifications_products import match_product
    assert match_product(subcategory) == expected

@patch('Data_processing_cloud.Classifications.Classifications_products.publish_message')
def test_error_handling(mock_publish):
    with patch('Data_processing_cloud.Classifications.Classifications_products.classification_defined_products'):
            result = classification_defined_products(error_df)
            assert result is None  # Expecting None due to error handling
            mock_publish.assert_called_with('Error - Operation could not be completed: Subcategory or Feedback contains None or empty values.', 'ERROR')


@patch('Data_processing_cloud.Classifications.Classifications_products.publish_message')
def test_normal_operations(mock_publish):
    # Not mocking
    result_df = classification_defined_products(test_df)

    # check correct DataFrame modifications
    assert 'Product' in result_df.columns
    assert 'Feedback Category' in result_df.columns
    assert 'Sentiment Score' in result_df.columns
    assert 'Sentiment' in result_df.columns

    expected_products = ['Cards', 'Unsecured Loans', 'Digital Channels']  # Expected results based on the mapping in match_product
    assert list(result_df['Product']) == expected_products, "The products are not correctly classified based on subcategories."


    # Check that messages were published
    expected_calls = [
        call('Completed Subcategory Categorisation', 'IN PROGRESS'),
        call('Completed Feedback Categorisation', "IN PROGRESS"),
        call('Completed Sentiment Analysis', "IN PROGRESS"),
    ]
    mock_publish.assert_has_calls(expected_calls, any_order=True)


@patch('Data_processing_cloud.Classifications.Classifications_products.publish_message')
def test_edge_cases(mock_publish):

    edge_case_df = DataFrame({
        'Date': ['01/04/2024', '01/05/2024', '01/06/2024'],
        'Subcategory': ['Zebra', 'Quantum', 'Unknown'],
        'Feedback': ['Never heard of this', 'Is this even real?', 'What is this?']
    })

    result_df = classification_defined_products(edge_case_df)

    # all edge cases default to 'Others' or are handled gracefully
    assert all(category == 'Others' for category in result_df['Product']), "Edge cases not classified as 'Others'"

    expected_calls = [
        call('Completed Subcategory Categorisation', 'IN PROGRESS'),
        call('Completed Feedback Categorisation', "IN PROGRESS"),
        call('Completed Sentiment Analysis', "IN PROGRESS"),
    ]
    mock_publish.assert_has_calls(expected_calls, any_order=True)