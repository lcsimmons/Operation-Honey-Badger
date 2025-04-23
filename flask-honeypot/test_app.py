import pytest
import json
import requests
from unittest.mock import patch, MagicMock
from flask import Flask, request
from app import app, parse_user_agent, extract_attacker_info, handle_port_6969_connection


@pytest.fixture
def client():
    """Create a test client for the app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_parse_user_agent_with_valid_input():
    """Test parsing a valid user agent string."""
    test_ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    result = parse_user_agent(test_ua)
    
    assert result["browser"] == "Chrome"
    # Fix for the browser version format
    assert "91" in result["browser_version"]
    assert "Windows" in result["os"]
    assert result["is_pc"] is True
    assert result["is_mobile"] is False
    assert result["is_bot"] is False
    assert result["raw"] == test_ua


def test_parse_user_agent_with_empty_input():
    """Test parsing an empty user agent string."""
    result = parse_user_agent("")
    
    assert result["browser"] == "Unknown"
    assert result["browser_version"] == "Unknown"
    assert result["os"] == "Unknown"
    assert result["device"] == "Unknown"
    assert result["is_pc"] is False
    assert result["is_mobile"] is False
    assert result["raw"] == ""


def test_parse_user_agent_with_bot():
    """Test parsing a bot user agent string."""
    test_ua = "Googlebot/2.1 (+http://www.google.com/bot.html)"
    result = parse_user_agent(test_ua)
    
    assert result["is_bot"] is True
    assert result["raw"] == test_ua


def test_extract_attacker_info_direct_ip(client):
    """Test extracting attacker info with direct IP."""
    with app.test_request_context(
        '/',
        environ_base={
            'REMOTE_ADDR': '192.168.1.1',
        },
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate'
        }
    ):
        # Call the function within request context
        result = extract_attacker_info()
        
        # Verify results
        assert result["ip_address"] == "192.168.1.1"
        assert "Chrome" in json.loads(result["user_agent"])["browser"]
        assert result["payload"] == "Port 6969"
        assert "Port Scanning" in json.loads(result["ioc"])


def test_extract_attacker_info_proxied_ip(client):
    """Test extracting attacker info with proxied IP."""
    with app.test_request_context(
        '/',
        environ_base={
            'REMOTE_ADDR': '10.0.0.1',
        },
        headers={
            'X-Forwarded-For': '203.0.113.195, 70.41.3.18',
            'User-Agent': 'curl/7.64.1',
            'Accept-Language': 'en-US',
            'Accept-Encoding': 'gzip'
        }
    ):
        # Call the function within request context
        result = extract_attacker_info()
        
        # Verify results
        assert result["ip_address"] == "203.0.113.195"
        assert "curl" in json.loads(result["user_agent"])["raw"].lower()
        assert "Suspicious User-Agent" in json.loads(result["ioc"])


def test_extract_attacker_info_with_bot(client):
    """Test extracting attacker info from a bot."""
    with app.test_request_context(
        '/',
        environ_base={
            'REMOTE_ADDR': '8.8.8.8',
        },
        headers={
            'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
            'Accept-Language': 'en-US',
            'Accept-Encoding': 'gzip'
        }
    ):
        # Call the function within request context
        result = extract_attacker_info()
        
        # Verify results
        assert "Bot detected" in json.loads(result["ioc"])
        assert json.loads(result["user_agent"])["is_bot"] is True


@patch('app.requests.post')
@patch('app.extract_attacker_info')
@patch('os.environ.get')
def test_handle_port_6969_connection_success(mock_env_get, mock_extract_info, mock_post):
    """Test successful handling of port 6969 connection."""
    # Mock os.environ.get to return test URL when called with 'BACKEND_API_URL'
    def mock_env_get_side_effect(key, default=None):
        if key == 'BACKEND_API_URL':
            return 'http://127.0.0.1:5000/api/log/security_misconfiguration'
        return default
    
    mock_env_get.side_effect = mock_env_get_side_effect
    
    # Setup mocks
    mock_extract_info.return_value = {
        "ip_address": "192.168.1.1",
        "user_agent": json.dumps({"browser": "Chrome"}),
        "device_fingerprint": "abc123",
        "payload": "Port 6969"
    }
    
    # Mock successful response
    mock_post.return_value = MagicMock(status_code=200)
    
    # Call the function
    result = handle_port_6969_connection()
    
    # Verify the results
    assert result is True
    mock_post.assert_called_once()
    # Verify it was called with the right URL
    args, kwargs = mock_post.call_args
    assert args[0] == "http://127.0.0.1:5000/api/log/security_misconfiguration"


@patch('app.requests.post')
@patch('app.extract_attacker_info')
@patch('os.environ.get')
def test_handle_port_6969_connection_failure(mock_env_get, mock_extract_info, mock_post):
    """Test failed handling of port 6969 connection."""
    # Mock os.environ.get to return test URL when called with 'BACKEND_API_URL'
    def mock_env_get_side_effect(key, default=None):
        if key == 'BACKEND_API_URL':
            return 'http://127.0.0.1:5000/api/log/security_misconfiguration'
        return default
    
    mock_env_get.side_effect = mock_env_get_side_effect
    
    # Setup mocks
    mock_extract_info.return_value = {
        "ip_address": "192.168.1.1",
        "user_agent": json.dumps({"browser": "Chrome"}),
        "device_fingerprint": "abc123",
        "payload": "Port 6969"
    }
    
    # Mock failed response
    mock_post.return_value = MagicMock(status_code=500, text="Internal Server Error")
    
    # Call the function
    result = handle_port_6969_connection()
    
    # Verify the results
    assert result is False
    mock_post.assert_called_once()


@patch('app.handle_port_6969_connection')
def test_catch_all_route(mock_handle, client):
    """Test the catch-all route."""
    # Setup mock
    mock_handle.return_value = True
    
    # Make a request to the route
    response = client.get('/')
    
    # Verify the response
    assert response.status_code == 403
    data = json.loads(response.data)
    assert "Access denied" in data["error"]
    mock_handle.assert_called_once()


@patch('app.handle_port_6969_connection')
def test_catch_all_route_with_path(mock_handle, client):
    """Test the catch-all route with a specific path."""
    # Setup mock
    mock_handle.return_value = True
    
    # Make a request to the route with a path
    response = client.get('/api/some/endpoint')
    
    # Verify the response
    assert response.status_code == 403
    data = json.loads(response.data)
    assert "Access denied" in data["error"]
    mock_handle.assert_called_once()


@patch('app.handle_port_6969_connection')
def test_catch_all_route_other_methods(mock_handle, client):
    """Test the catch-all route with different HTTP methods."""
    # Setup mock
    mock_handle.return_value = True
    
    # Test with POST
    response = client.post('/', json={"test": "data"})
    assert response.status_code == 403
    
    # Test with PUT
    response = client.put('/', json={"test": "update"})
    assert response.status_code == 403
    
    # Test with DELETE
    response = client.delete('/')
    assert response.status_code == 403
    
    # Verify handle_port_6969_connection was called for each request
    assert mock_handle.call_count == 3


@patch('app.extract_attacker_info')
def test_exception_handling_in_port_handler(mock_extract_info, client):
    """Test exception handling in port 6969 connection handler."""
    # Setup mock to raise an exception
    mock_extract_info.side_effect = Exception("Test exception")
    
    # Make a request to the route
    response = client.get('/')
    
    # Verify the response still returns correctly despite the exception
    assert response.status_code == 403
    data = json.loads(response.data)
    assert "Access denied" in data["error"]


@patch('ipinfo.getHandler')
@patch('os.environ.get')
def test_geolocation_lookup(mock_env_get, mock_get_handler, client):
    """Test geolocation lookup functionality."""
    # Setup Flask test request context
    with app.test_request_context(
        '/',
        environ_base={
            'REMOTE_ADDR': '8.8.8.8',
        },
        headers={
            'User-Agent': 'Test/1.0'
        }
    ):
        # Mock environment and ipinfo
        mock_env_get.return_value = "test_token"
        mock_handler = MagicMock()
        mock_get_handler.return_value = mock_handler
        mock_details = MagicMock()
        mock_details.all = {"country": "US", "city": "Mountain View"}
        mock_handler.getDetails.return_value = mock_details
        
        # Call the function within the request context
        result = extract_attacker_info()
        
        # Verify geolocation was retrieved
        assert result["geolocation"] == {"country": "US", "city": "Mountain View"}
        mock_handler.getDetails.assert_called_once_with("8.8.8.8")

import pytest
import json
from unittest.mock import patch, MagicMock
from flask import Flask, request
from app import app, parse_user_agent, extract_attacker_info, handle_port_6969_connection

# Keep existing fixtures and tests

# Add these new test cases:

def test_parse_user_agent_with_mobile_device():
    """Test parsing a mobile device user agent string."""
    test_ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1"
    result = parse_user_agent(test_ua)
    
    assert result["browser"] == "Mobile Safari"
    assert "iOS" in result["os"]
    assert result["is_mobile"] is True
    assert result["is_pc"] is False
    assert result["is_bot"] is False
    assert result["raw"] == test_ua


def test_parse_user_agent_with_tablet_device():
    """Test parsing a tablet device user agent string."""
    test_ua = "Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
    result = parse_user_agent(test_ua)
    
    assert result["device"] == "iPad"
    assert result["is_tablet"] is True
    assert result["is_mobile"] is False
    assert result["is_pc"] is False
    assert result["raw"] == test_ua


def test_parse_user_agent_with_error():
    """Test parsing behavior when an exception occurs."""
    # Using a patch to force an exception during parsing
    with patch('user_agents.parse', side_effect=Exception("Test parsing error")):
        test_ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        result = parse_user_agent(test_ua)
        
        # Check the general structure without assuming an error key
        assert "browser" in result
        assert "browser_version" in result
        assert "raw" in result
        assert result["raw"] == test_ua
        
        # Your implementation seems to use "Other" as the browser value on error
        assert result["browser"] == "Other"
        
        # Check for empty browser version which might indicate an error case
        assert result["browser_version"] == ""


def test_extract_attacker_info_missing_headers(client):
    """Test extracting attacker info with minimal headers."""
    with app.test_request_context(
        '/',
        environ_base={
            'REMOTE_ADDR': '192.168.1.1',
        },
        # No headers provided
    ):
        # Call the function within request context
        result = extract_attacker_info()
        
        # Verify results even with missing headers
        assert result["ip_address"] == "192.168.1.1"
        assert result["user_agent"] is not None
        assert result["device_fingerprint"] is not None
        assert result["payload"] == "Port 6969"


@patch('ipinfo.getHandler')
@patch('os.environ.get')
def test_extract_attacker_info_geolocation_error(mock_env_get, mock_get_handler, client):
    """Test extracting attacker info when geolocation lookup fails."""
    # Setup Flask test request context
    with app.test_request_context(
        '/',
        environ_base={
            'REMOTE_ADDR': '8.8.8.8',
        },
        headers={
            'User-Agent': 'Test/1.0'
        }
    ):
        # Mock environment
        mock_env_get.return_value = "test_token"
        
        # Mock ipinfo handler to raise exception
        mock_handler = MagicMock()
        mock_get_handler.return_value = mock_handler
        mock_handler.getDetails.side_effect = Exception("Geolocation lookup failed")
        
        # Call the function within the request context
        result = extract_attacker_info()
        
        # Verify function still completes despite geolocation error
        assert result["ip_address"] == "8.8.8.8"
        assert "country" in result["geolocation"]
        assert "Unknown" in result["geolocation"].values()


@patch('os.path.exists')
@patch('app.load_dotenv')
@patch('requests.post')
def test_handle_port_6969_connection_with_env_local(mock_post, mock_load_dotenv, mock_path_exists):
    """Test port 6969 connection with .env.local file."""
    # Mock file existence check
    mock_path_exists.return_value = True
    
    # Mock successful response
    mock_post.return_value = MagicMock(status_code=200)
    
    # Setup attacker_info extraction
    with patch('app.extract_attacker_info') as mock_extract:
        mock_extract.return_value = {
            "ip_address": "192.168.1.1",
            "user_agent": json.dumps({"browser": "Firefox"}),
            "device_fingerprint": "xyz789",
            "payload": "Port 6969"
        }
        
        # Set backend URL
        with patch('os.environ.get') as mock_env:
            mock_env.return_value = "http://localhost:5000/api/log/security_misconfiguration"
            
            # Call the function
            result = handle_port_6969_connection()
            
            # Verify results
            assert result is True
            mock_load_dotenv.assert_called_once()
            mock_post.assert_called_once()


@patch('app.extract_attacker_info')
@patch('os.environ.get')
@patch('requests.post')
def test_handle_port_6969_connection_request_exception(mock_post, mock_env_get, mock_extract_info):
    """Test handling of request exception in port 6969 connection."""
    # Mock extraction
    mock_extract_info.return_value = {"ip_address": "192.168.1.1"}
    
    # Mock environment
    mock_env_get.return_value = "http://example.com/api"
    
    # Mock requests.post to raise exception
    mock_post.side_effect = requests.exceptions.RequestException("Connection refused")
    
    # Call the function
    result = handle_port_6969_connection()
    
    # Verify it handled the exception gracefully
    assert result is False


def test_catch_all_route_options_method(client):
    """Test the catch-all route with OPTIONS method."""
    # Make an OPTIONS request
    response = client.options('/')
    
    # Verify the response
    assert response.status_code == 403
    data = json.loads(response.data)
    assert "Access denied" in data["error"]


def test_catch_all_nested_path(client):
    """Test the catch-all route with a deeply nested path."""
    with patch('app.handle_port_6969_connection') as mock_handle:
        mock_handle.return_value = True
        
        # Make a request to a deeply nested path
        response = client.get('/api/v1/users/123/profiles/details')
        
        # Verify the response
        assert response.status_code == 403
        data = json.loads(response.data)
        assert "Access denied" in data["error"]
        mock_handle.assert_called_once()


def test_catch_all_with_query_params(client):
    """Test the catch-all route with query parameters."""
    with patch('app.handle_port_6969_connection') as mock_handle:
        mock_handle.return_value = True
        
        # Make a request with query parameters
        response = client.get('/api/search?query=test&page=1')
        
        # Verify the response
        assert response.status_code == 403
        data = json.loads(response.data)
        assert "Access denied" in data["error"]
        mock_handle.assert_called_once()


def test_catch_all_with_post_data(client):
    """Test the catch-all route with POST data."""
    with patch('app.handle_port_6969_connection') as mock_handle:
        mock_handle.return_value = True
        
        # Make a POST request with JSON data
        response = client.post(
            '/api/login',
            data=json.dumps({'username': 'test', 'password': 'password123'}),
            content_type='application/json'
        )
        
        # Verify the response
        assert response.status_code == 403
        data = json.loads(response.data)
        assert "Access denied" in data["error"]
        mock_handle.assert_called_once()


@patch('app.extract_attacker_info')
def test_device_fingerprint_creation(mock_extract_info, client):
    """Test the creation of device fingerprint hash."""
    # We'll call the real extract_attacker_info but in a controlled context
    mock_extract_info.side_effect = extract_attacker_info
    
    with app.test_request_context(
        '/',
        environ_base={
            'REMOTE_ADDR': '192.168.1.1',
        },
        headers={
            'User-Agent': 'TestAgent/1.0',
            'Accept-Language': 'en-US',
            'Accept-Encoding': 'gzip'
        }
    ):
        # First request
        result1 = extract_attacker_info()
        fingerprint1 = result1["device_fingerprint"]
        
        # Make request with same data - should get same fingerprint
        result2 = extract_attacker_info()
        fingerprint2 = result2["device_fingerprint"]
        
        # Verify fingerprints match
        assert fingerprint1 == fingerprint2
        assert len(fingerprint1) == 64  # SHA-256 hash is 64 hex characters
        
        # Now change something to get a different fingerprint
        with app.test_request_context(
            '/',
            environ_base={
                'REMOTE_ADDR': '192.168.1.1',
            },
            headers={
                'User-Agent': 'DifferentAgent/2.0',  # Different agent
                'Accept-Language': 'en-US',
                'Accept-Encoding': 'gzip'
            }
        ):
            result3 = extract_attacker_info()
            fingerprint3 = result3["device_fingerprint"]
            
            # Verify fingerprint is different
            assert fingerprint1 != fingerprint3