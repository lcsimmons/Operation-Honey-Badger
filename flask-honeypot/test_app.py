import pytest
import json
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