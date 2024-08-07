import pytest
from unittest.mock import patch, Mock
from Data_processing_cloud.main import download_file_from_bucket

#TC11
@patch('Data_processing_cloud.authentification.storage.Client')
@patch('os.makedirs')
@patch('os.path.basename')
def test_download_file_from_bucket(mock_basename, mock_makedirs, mock_storage_client):
    # Setup the mock objects
    mock_storage_instance = Mock()
    mock_storage_client.return_value = mock_storage_instance
    
    mock_bucket = Mock()
    mock_storage_instance.bucket.return_value = mock_bucket
    
    mock_blob = Mock()
    mock_bucket.blob.return_value = mock_blob
    
    mock_basename.return_value = "testfile.txt"
    
    # Call the download_file_from_bucket function
    local_path = download_file_from_bucket("test-bucket", "testfile.txt")
    
    # Verify the calls and returned path
    mock_storage_client.assert_called_once()
    mock_storage_instance.bucket.assert_called_once_with("test-bucket")
    mock_bucket.blob.assert_called_once_with("testfile.txt")
    mock_blob.download_to_filename.assert_called_once_with("/tmp/uploads/testfile.txt")
    mock_makedirs.assert_called_once_with("/tmp/uploads", exist_ok=True)
    
    assert local_path == "/tmp/uploads/testfile.txt"

#TC12
@patch('Data_processing_cloud.authentification.storage.Client')
@patch('os.makedirs')
@patch('os.path.basename')
def test_download_file_from_bucket_different_filename(mock_basename, mock_makedirs, mock_storage_client):
    # Setup the mock objects
    mock_storage_instance = Mock()
    mock_storage_client.return_value = mock_storage_instance ##Configures the storage.Client mock to return the mock storage client instance when called
    
    mock_bucket = Mock()
    mock_storage_instance.bucket.return_value = mock_bucket ##Configures the mock storage client to return the mock bucket when the bucket method is called with the bucket name.
    
    mock_blob = Mock()
    mock_bucket.blob.return_value = mock_blob
    
    mock_basename.return_value = "testfile2.txt" ##Configures the os.path.basename mock to return "testfile2.txt" when called
    
    # Call the download_file_from_bucket function
    local_path = download_file_from_bucket("test-bucket", "testfile2.txt")
    
    # Verify the calls and returned path
    mock_storage_client.assert_called_once() ##called once
    mock_storage_instance.bucket.assert_called_once_with("test-bucket")
    mock_bucket.blob.assert_called_once_with("testfile2.txt") ##Verifies that the blob method of the mock bucket was called once with the argument "testfile2.txt"
    mock_blob.download_to_filename.assert_called_once_with("/tmp/uploads/testfile2.txt")
    mock_makedirs.assert_called_once_with("/tmp/uploads", exist_ok=True) ##Verifies that the os.makedirs function was called once with the specified directory
    
    assert local_path == "/tmp/uploads/testfile2.txt"


@patch('Data_processing_cloud.authentification.storage.Client')
@patch('os.makedirs')
@patch('os.path.basename')
def test_download_file_from_bucket_download_failure(mock_basename, mock_makedirs, mock_storage_client):
    # Setup the mock objects
    mock_storage_instance = Mock()
    mock_storage_client.return_value = mock_storage_instance
    
    mock_bucket = Mock()
    mock_storage_instance.bucket.return_value = mock_bucket
    
    mock_blob = Mock()
    mock_bucket.blob.return_value = mock_blob
    
    # Simulate download failure
    mock_blob.download_to_filename.side_effect = Exception("Download error")
    
    with pytest.raises(Exception) as excinfo:
        download_file_from_bucket("test-bucket", "testfile.txt")
    
    assert str(excinfo.value) == "Download error"

# TC14: Handle invalid filename
@patch('Data_processing_cloud.authentification.storage.Client')
@patch('os.makedirs')
@patch('os.path.basename')
def test_download_file_from_bucket_invalid_filename(mock_basename, mock_makedirs, mock_storage_client):
    # Setup the mock objects
    mock_storage_instance = Mock()
    mock_storage_client.return_value = mock_storage_instance
    
    mock_bucket = Mock()
    mock_storage_instance.bucket.return_value = mock_bucket
    
    mock_blob = Mock()
    mock_bucket.blob.return_value = mock_blob
    
    mock_basename.return_value = "invalid_file_*.txt"  # Invalid filename

    # Add validation to check for invalid filenames in your function
    with pytest.raises(ValueError) as excinfo:
        download_file_from_bucket("test-bucket", "invalid_file_*.txt")
    
    assert str(excinfo.value) == "Invalid filename: invalid_file_*.txt"

    # Verify that no download was attempted
    mock_storage_client.assert_called_once()
    mock_storage_instance.bucket.assert_not_called()
    mock_bucket.blob.assert_not_called()
    mock_blob.download_to_filename.assert_not_called()
    mock_makedirs.assert_not_called()


@patch('Data_processing_cloud.authentification.storage.Client')
@patch('os.makedirs')
@patch('os.path.basename')
def test_download_file_from_bucket_invalid_bucket_name(mock_basename, mock_makedirs, mock_storage_client):
    # Setup the mock objects
    mock_storage_instance = Mock()
    mock_storage_client.return_value = mock_storage_instance
    
    # Simulate bucket not found by raising a specific error when accessing the bucket
    mock_bucket = Mock()
    mock_storage_instance.bucket.side_effect = Exception("Bucket not found")
    
    mock_basename.return_value = "testfile.txt"
    
    # Call the function and check for error handling
    with pytest.raises(Exception) as excinfo:
        download_file_from_bucket("invalid-bucket-name", "testfile.txt")
    
    assert str(excinfo.value) == "Bucket not found"
    
    # Ensure that the os.makedirs function was still called (since it is expected to be called before the error)
    mock_makedirs.assert_called_once_with("/tmp/uploads", exist_ok=True)
    
    # Verify that the other methods were not called due to the exception
    mock_storage_client.assert_called_once()
    mock_storage_instance.bucket.assert_called_once_with("invalid-bucket-name")
    mock_storage_instance.bucket.assert_not_called()  # Ensure no further calls were made after the exception

    # Check that the blob download method was not called
    mock_blob = Mock()
    mock_storage_instance.bucket.return_value = mock_bucket
    mock_bucket.blob.return_value = mock_blob
    mock_blob.download_to_filename.assert_not_called()