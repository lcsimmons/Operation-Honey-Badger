import pytest
from app import app
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    """Create a test client for the app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture(autouse=True)
def mock_gemini():
    with patch('app.init_gemini') as mock_init:
        mock_client = MagicMock()
        mock_init.return_value = mock_client
        yield mock_client

def test_api_test_endpoint(client):
    """Test that the /api/test endpoint returns the expected message."""
    response = client.get('/api/test')
    
    # Check status code
    assert response.status_code == 200
    
    # Check response data
    json_data = response.get_json()
    assert "message" in json_data
    assert json_data["message"] == "Successfully communicated with Flask Backend!"