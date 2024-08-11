import pytest
from unittest.mock import patch, Mock
from Data_processing_cloud.authentification import download_file_from_bucket

#TC11
@patch('Data_processing_cloud.authentification.storage.Client')
@patch('os.makedirs')
@patch('os.path.basename')
def test_download_file_from_bucket(mock_basename, mock_makedirs, mock_storage_client):
    
    mock_storage_instance = Mock()
    mock_storage_client.return_value = mock_storage_instance
    
    mock_bucket = Mock()
    mock_storage_instance.bucket.return_value = mock_bucket
    
    mock_blob = Mock()
    mock_bucket.blob.return_value = mock_blob
    
    mock_basename.return_value = "testfile.txt"
    
    
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
    
    mock_storage_instance = Mock()
    mock_storage_client.return_value = mock_storage_instance ##Configures the storage.Client mock to return the mock storage client instance 
    
    mock_bucket = Mock()
    mock_storage_instance.bucket.return_value = mock_bucket ##Configures the mock storage client to return the mock bucket when the bucket method is called
    
    mock_blob = Mock()
    mock_bucket.blob.return_value = mock_blob
    
    mock_basename.return_value = "testfile2.txt" ##Configures the os.path.basename mock to return "testfile2.txt" when called

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
