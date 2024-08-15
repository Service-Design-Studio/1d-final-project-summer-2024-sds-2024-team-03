import pytest
from unittest.mock import patch
import sys
from Data_processing_cloud.clear_logs import clear_logs
import os



@patch('Data_processing_cloud.clear_logs.execute_postgres_query')
def test_clear_logs_success(mock_execute_postgres_query):
    
    clear_logs('user', 'password', 'host', 'dbname')
    
    # Ensure execute_postgres_query was called with the correct arguments
    mock_execute_postgres_query.assert_called_once_with('user', 'password', 'dbname', 'host', 'DELETE FROM logs')


@patch('Data_processing_cloud.clear_logs.execute_postgres_query', side_effect=Exception("Query execution error"))
@patch('Data_processing_cloud.clear_logs.publish_message')
def test_clear_logs_failure(mock_publish_message, mock_execute_postgres_query):
    # Check that sys.exit is called
    with pytest.raises(SystemExit) as excinfo:
        clear_logs('user', 'password', 'host', 'dbname')
    
    assert excinfo.value.code == 1
    mock_publish_message.assert_called_once_with("Failed to clear logs: Query execution error", 'ERROR')
    mock_execute_postgres_query.assert_called_once_with('user', 'password', 'dbname', 'host', 'DELETE FROM logs')

# Test clear_logs with empty database parameters
@patch('Data_processing_cloud.clear_logs.execute_postgres_query', side_effect=Exception("Query execution error"))
@patch('Data_processing_cloud.clear_logs.publish_message')
def test_clear_logs_empty_params(mock_publish_message, mock_execute_postgres_query):
    with patch('builtins.print') as mock_print:
        with pytest.raises(SystemExit) as excinfo:
            clear_logs('', '', '', '')
        
        assert excinfo.value.code == 1
        mock_publish_message.assert_called_once_with("Failed to clear logs: Query execution error", 'ERROR')
        mock_execute_postgres_query.assert_called_once_with('', '', '', '', 'DELETE FROM logs')
        
        # Check if the error message is printed
        mock_print.assert_any_call("Failed to clear logs: Query execution error")
        mock_print.assert_any_call("Database transaction rolled back due to an error.")
