import pytest
import pandas as pd 
from unittest.mock import patch
from Data_processing_cloud.Gemini_Models.Subcategory_Classification_Gemini_model import classify_subcategory
from Data_processing_cloud.Gemini_Models.Sentiment_Score_Category_model import classify_sentiment
from Data_processing_cloud.Classifications.Classifications_products import classification_defined_products


   

@pytest.fixture
def mock_dependencies():
    with patch('Data_processing_cloud.Classifications.Classifications_products.feedback_categorisation') as mock_categorisation, \
         patch('Data_processing_cloud.Classifications.Classifications_products.classify_sentiment') as mock_sentiment, \
         patch('Data_processing_cloud.Classifications.Classifications_products.match_product') as mock_match_product, \
         patch('Data_processing_cloud.Classifications.Classifications_products.publish_message') as mock_publish:
        yield mock_categorisation, mock_sentiment, mock_match_product, mock_publish

def test_classification_defined_products_normal_case(mock_dependencies):
    mock_categorisation, mock_sentiment, mock_match_product, mock_publish = mock_dependencies
    
    mock_categorisation.return_value = 'Positive Feedback'
    mock_sentiment.return_value = ('0.9', 'Positive')
    mock_match_product.return_value = 'Cards'
    
    test_df = pd.DataFrame({
        'Feedback': ['This card is great'],
        'Date': ['2021-01-01'],
        'Subcategory': ['Credit Card']
    })
    
    result_df = classification_defined_products(test_df)
    
    assert 'Product' in result_df.columns
    assert 'Feedback Category' in result_df.columns
    assert 'Sentiment Score' in result_df.columns
    assert 'Sentiment' in result_df.columns
    assert all(result_df['Product'] == 'Cards')
    assert all(result_df['Feedback Category'] == 'Positive Feedback')
    assert all(result_df['Sentiment Score'] == '0.9')
    assert all(result_df['Sentiment'] == 'Positive')

def test_classification_defined_products_empty_dataframe(mock_dependencies):
    mock_categorisation, mock_sentiment, mock_match_product, mock_publish = mock_dependencies
    
    test_df = pd.DataFrame()
    
    result_df = classification_defined_products(test_df)
    
    assert result_df is not None
    assert result_df.empty
    assert list(result_df.columns) == ['Feedback', 'Date', 'Subcategory', 'Product', 'Feedback Category', 'Sentiment Score', 'Sentiment']

def test_classification_defined_products_missing_columns(mock_dependencies):
    mock_categorisation, mock_sentiment, mock_match_product, mock_publish = mock_dependencies
    
    test_df = pd.DataFrame({
        'Feedback': ['This card is great'],
        'Date': ['2021-01-01']
    })

    with pytest.raises(ValueError, match="Missing required columns: Subcategory"):
        classification_defined_products(test_df)

def test_classification_defined_products_error_handling(mock_dependencies):
    mock_categorisation, mock_sentiment, mock_match_product, mock_publish = mock_dependencies
    
    mock_categorisation.side_effect = Exception("Categorisation error")
    
    test_df = pd.DataFrame({
        'Feedback': ['This card is great'],
        'Date': ['2021-01-01'],
        'Subcategory': ['Credit Card']
    })
    result_df = classification_defined_products(test_df)
    
    
    assert result_df is None, "The function should return None when an exception occurs"
    

def test_classification_defined_products_non_string_inputs(mock_dependencies):
    mock_categorisation, mock_sentiment, mock_match_product, mock_publish = mock_dependencies
    
    mock_categorisation.return_value = 'Neutral Feedback'
    mock_sentiment.return_value = ('0.5', 'Neutral')
    mock_match_product.return_value = 'Others'
    
    test_df = pd.DataFrame({
        'Feedback': [123, None, ''],
        'Date': ['2021-01-01', '2021-01-02', '2021-01-03'],
        'Subcategory': ['Credit Card', 'Personal Loan', 'DigiBank App']
    })
    
    result_df = classification_defined_products(test_df)
    result_df = classification_defined_products(test_df)
    
    # The function should return None because of invalid input types
    assert result_df is None
    mock_publish.assert_called_with("Error - Operation could not be completed: Subcategory or Feedback contains None or empty values.", 'ERROR')
    #assert all(result_df['Product'] == 'Others')

def test_classification_defined_products_long_feedback(mock_dependencies):
    mock_categorisation, mock_sentiment, mock_match_product, mock_publish = mock_dependencies
    
    long_feedback = "This is a very long feedback " * 100
    mock_categorisation.return_value = 'Positive Feedback'
    mock_sentiment.return_value = ('0.8', 'Positive')
    mock_match_product.return_value = 'Cards'
    
    test_df = pd.DataFrame({
        'Feedback': [long_feedback],
        'Date': ['2021-01-01'],
        'Subcategory': ['Credit Card']
    })
    
    result_df = classification_defined_products(test_df)
    
    assert result_df['Feedback Category'].iloc[0] == 'Positive Feedback'
    assert result_df['Sentiment Score'].iloc[0] == '0.8'

def test_classification_defined_products_edge_case_sentiment_scores(mock_dependencies):
    mock_categorisation, mock_sentiment, mock_match_product, mock_publish = mock_dependencies
    
    mock_categorisation.return_value = 'Neutral Feedback'
    mock_sentiment.side_effect = [('0.0', 'Negative'), ('0.5', 'Neutral'), ('1.0', 'Positive')]
    mock_match_product.return_value = 'Cards'
    
    test_df = pd.DataFrame({
        'Feedback': ['Bad', 'Okay', 'Great'],
        'Date': ['2021-01-01', '2021-01-02', '2021-01-03'],
        'Subcategory': ['Credit Card', 'Credit Card', 'Credit Card']
    })
    
    result_df = classification_defined_products(test_df)
    
    assert list(result_df['Sentiment Score']) == ['0.0', '0.5', '1.0']
    assert list(result_df['Sentiment']) == ['Negative', 'Neutral', 'Positive']

if __name__ == "__main__":
    pytest.main()
