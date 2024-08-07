import pytest
from unittest.mock import patch, Mock
import psycopg2
from Data_processing_cloud.authentification import execute_postgres_query

#TC13
@patch('psycopg2.connect')
@patch('Data_processing_cloud.authentification.publish_message')
def test_execute_postgres_query_success(mock_publish_message, mock_connect):
    # Setup the mock objects
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_connect.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    # Call the function
    execute_postgres_query('user', 'password', 'dbname', 'host', 'SELECT 1')

    # Verify the calls
    mock_connect.assert_called_once_with(dbname='dbname', user='user', password='password', host='34.124.203.237', port='5432')
    mock_conn.cursor.assert_called_once()
    mock_cursor.execute.assert_called_once_with('SELECT 1')
    mock_conn.commit.assert_called_once()
    mock_cursor.close.assert_called_once()
    mock_conn.close.assert_called_once()
    mock_publish_message.assert_not_called()

#TC14
@patch('psycopg2.connect', side_effect=psycopg2.DatabaseError("DB error"))
@patch('Data_processing_cloud.authentification.publish_message')
def test_execute_postgres_query_DB_error(mock_publish_message, mock_connect):
    # Setup the mock objects
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_connect.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    # Call the function and check for unexpected error handling
    with pytest.raises(SystemExit) as excinfo:
        execute_postgres_query('user', 'password', 'dbname', 'host', 'SELECT 1')

    assert excinfo.value.code == 1
    mock_publish_message.assert_called_once_with("Database transaction rolled back due to an error.", 'ERROR')

    # Verify the rollback and close calls
    mock_conn.rollback.assert_called_once()
    mock_cursor.close.assert_called_once()
    mock_conn.close.assert_called_once()

#TC15
@patch('Data_processing_cloud.authentification.psycopg2.connect')
@patch('Data_processing_cloud.authentification.publish_message')
def test_execute_postgres_query_unexpected_error(mock_publish_message, mock_connect):
    # Setup the mock objects
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_connect.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.execute.side_effect = Exception("Unexpected error")

    # Call the function and check for unexpected error handling
    with pytest.raises(SystemExit) as excinfo:
        execute_postgres_query('user', 'password', 'dbname', 'host', 'SELECT 1')

    assert excinfo.value.code == 1
    mock_publish_message.assert_called_once_with("An unexpected error occurred: Unexpected error", 'ERROR')

    # Verify the rollback and close calls
    mock_cursor.close.assert_called_once()
    mock_conn.close.assert_called_once()

#TC16
@patch('Data_processing_cloud.authentification.psycopg2.extras.execute_values')
@patch('Data_processing_cloud.authentification.psycopg2.connect')
@patch('Data_processing_cloud.authentification.publish_message')
def test_execute_postgres_query_with_data(mock_publish_message, mock_connect, mock_execute_values):
    # Setup the mock objects
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_connect.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    data = [("value1", "value2"), ("value3", "value4")]

    # Call the function with data
    execute_postgres_query('user', 'password', 'dbname', 'host', 'INSERT INTO table VALUES %s', data)

    # Verify the calls
    mock_connect.assert_called_once_with(dbname='dbname', user='user', password='password', host='34.124.203.237', port='5432')
    mock_conn.cursor.assert_called_once()
    mock_execute_values.assert_called_once_with(mock_cursor, 'INSERT INTO table VALUES %s', data)
    mock_conn.commit.assert_called_once()
    mock_cursor.close.assert_called_once()
    mock_conn.close.assert_called_once()
    mock_publish_message.assert_not_called()