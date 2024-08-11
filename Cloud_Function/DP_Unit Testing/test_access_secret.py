import pytest
from unittest.mock import patch, Mock
from google.cloud import secretmanager
from Data_processing_cloud.authentification import access_secret_version


def create_mock_response(secret_value):
    mock_response = Mock()
    mock_response.payload.data.decode.return_value = secret_value
    return mock_response

@patch('google.cloud.secretmanager.SecretManagerServiceClient')
def test_access_secret_version_success(mock_secret_manager_client):
    # Setup mock client
    mock_client_instance = Mock()
    mock_secret_manager_client.return_value = mock_client_instance

    # Test different secret values
    secret_values = ["mock_secret_value", "another_secret_value", "12345"]
    
    for secret_value in secret_values:
        mock_response = create_mock_response(secret_value)
        mock_client_instance.access_secret_version.return_value = mock_response

        result = access_secret_version("test-secret-id", "test-project-id")
        assert result == secret_value

        mock_client_instance.access_secret_version.assert_called_with(
            name="projects/test-project-id/secrets/test-secret-id/versions/latest"
        )

@patch('google.cloud.secretmanager.SecretManagerServiceClient')
def test_access_secret_version_error(mock_secret_manager_client):
    # Setup the mock client to raise an error
    mock_client_instance = Mock()
    mock_secret_manager_client.return_value = mock_client_instance
    mock_client_instance.access_secret_version.side_effect = Exception("Secret Manager error")

    with pytest.raises(Exception) as excinfo:
        access_secret_version("test-secret-id", "test-project-id")
    
    assert "Secret Manager error" in str(excinfo.value)

# Running all tests
if __name__ == "__main__":
    pytest.main([__file__])
