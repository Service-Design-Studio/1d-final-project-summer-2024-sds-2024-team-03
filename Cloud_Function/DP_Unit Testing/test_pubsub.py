import pytest
from unittest.mock import patch, Mock, call
import psycopg2
import psycopg2.extras
from google.cloud import secretmanager
from Data_processing_cloud.pubsub_helper import publish_message

@patch('Data_processing_cloud.pubsub_helper.access_secret_version')
@patch('psycopg2.connect')
@patch('psycopg2.extras.execute_values')
def test_publish_message_success(mock_execute_values, mock_connect, mock_access_secret_version):
    # Setup the mock objects
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_connect.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_access_secret_version.side_effect = ['mock_user', 'mock_password']

    # Call the function
    publish_message("Test message", "INFO")

    # Verify the calls
    mock_access_secret_version.assert_has_calls([call('DB_USER', '903333611831'), call('DB_PASS', '903333611831')])
    mock_connect.assert_called_once_with(dbname='feedback_db', user='mock_user', password='mock_password', host='34.124.203.237', port='5432')
    mock_conn.cursor.assert_called_once()
    mock_execute_values.assert_called_once_with(mock_cursor, 'INSERT INTO logs (log_message,status) VALUES %s', [("Test message", "INFO")])
    mock_conn.commit.assert_called_once()
    mock_cursor.close.assert_called_once()
    mock_conn.close.assert_called_once()

@patch('Data_processing_cloud.pubsub_helper.access_secret_version')
@patch('psycopg2.connect', side_effect=psycopg2.DatabaseError("DB error"))
def test_publish_message_db_error(mock_connect, mock_access_secret_version):
    # Setup the mock objects
    mock_access_secret_version.side_effect = ['mock_user', 'mock_password']

    # Call the function
    publish_message("Test message", "INFO")

    # Verify the calls
    mock_access_secret_version.assert_has_calls([call('DB_USER', '903333611831'), call('DB_PASS', '903333611831')])
    mock_connect.assert_called_once_with(dbname='feedback_db', user='mock_user', password='mock_password', host='34.124.203.237', port='5432')

@patch('Data_processing_cloud.pubsub_helper.access_secret_version')
@patch('psycopg2.connect')
@patch('psycopg2.extras.execute_values', side_effect=Exception("Unexpected error"))
def test_publish_message_unexpected_error(mock_execute_values, mock_connect, mock_access_secret_version):
    # Setup the mock objects
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_connect.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_access_secret_version.side_effect = ['mock_user', 'mock_password']

    # Call the function
    publish_message("Test message", "INFO")

    # Verify the calls
    mock_access_secret_version.assert_has_calls([call('DB_USER', '903333611831'), call('DB_PASS', '903333611831')])
    mock_connect.assert_called_once_with(dbname='feedback_db', user='mock_user', password='mock_password', host='34.124.203.237', port='5432')
    mock_conn.cursor.assert_called_once()
    mock_execute_values.assert_called_once_with(mock_cursor, 'INSERT INTO logs (log_message,status) VALUES %s', [("Test message", "INFO")])
    mock_conn.rollback.assert_called_once()
    mock_cursor.close.assert_called_once()
    mock_conn.close.assert_called_once()
