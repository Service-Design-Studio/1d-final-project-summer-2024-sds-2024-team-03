import pytest
from unittest.mock import patch, Mock
import psycopg2
from Data_processing_cloud.check_logs import get_latest_log_status

#TC1
@patch('psycopg2.connect')
def test_get_latest_log_status_success(mock_connect):
    mock_cursor = Mock()
    mock_cursor.fetchone.return_value = ['SUCCESS']
    mock_connect.return_value.cursor.return_value = mock_cursor

    status = get_latest_log_status('user', 'password', 'host', 'dbname')
    assert status == 'SUCCESS'

#TC2
@patch('psycopg2.connect')
def test_get_latest_log_status_no_logs(mock_connect):
    mock_cursor = Mock()
    mock_cursor.fetchone.return_value = None
    mock_connect.return_value.cursor.return_value = mock_cursor

    status = get_latest_log_status('user', 'password', 'host', 'dbname')
    assert status is None

#TC4
@patch('psycopg2.connect')
def test_get_latest_log_status_error_logs(mock_connect):
    mock_cursor = Mock()
    mock_cursor.fetchone.return_value = ['ERROR']
    mock_connect.return_value.cursor.return_value = mock_cursor

    status = get_latest_log_status('user', 'password', 'host', 'dbname')
    assert status == 'ERROR'

#TC3
@patch('psycopg2.connect', side_effect=psycopg2.DatabaseError("DB error"))
@patch('Data_processing_cloud.check_logs.publish_message')
def test_database_error_exit(mock_publish_message, mock_connect):
    with pytest.raises(SystemExit) as excinfo:
        get_latest_log_status('user', 'password', 'host', 'dbname')

    assert excinfo.value.code == 1
    mock_publish_message.assert_called_once_with("Database error: DB error", 'ERROR')

#TC5
@patch('psycopg2.connect', side_effect=Exception("Unexpected error"))
@patch('Data_processing_cloud.check_logs.publish_message')
def test_unexpected_error_exit(mock_publish_message, mock_connect):
    with pytest.raises(SystemExit) as excinfo:
        get_latest_log_status('user', 'password', 'host', 'dbname')

    assert excinfo.value.code == 1
    mock_publish_message.assert_called_once_with("An unexpected error occurred: Unexpected error", 'ERROR')

@patch('psycopg2.connect')
def test_get_latest_log_status_empty_result(mock_connect):
    mock_cursor = Mock()
    mock_cursor.fetchone.return_value = None
    mock_connect.return_value.cursor.return_value = mock_cursor

    status = get_latest_log_status('user', 'password', 'host', 'dbname')
    assert status is None


@patch('psycopg2.connect', side_effect=psycopg2.OperationalError("Connection timeout"))
@patch('Data_processing_cloud.check_logs.publish_message')
def test_connection_timeout_error(mock_publish_message, mock_connect):
    with pytest.raises(SystemExit) as excinfo:
        get_latest_log_status('user', 'password', 'host', 'dbname')

    assert excinfo.value.code == 1
    mock_publish_message.assert_called_once_with("Database error: Connection timeout", 'ERROR')


@patch('psycopg2.connect')
def test_get_latest_log_status_empty_result(mock_connect):
    mock_cursor = Mock()
    mock_cursor.fetchone.return_value = None
    mock_connect.return_value.cursor.return_value = mock_cursor

    status = get_latest_log_status('user', 'password', 'host', 'dbname')
    assert status is None


    