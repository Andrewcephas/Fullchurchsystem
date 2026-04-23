import urllib.request
import json

# Test CORS preflight OPTIONS request
req = urllib.request.Request(
    'http://localhost:8000/api/auth/login/',
    method='OPTIONS',
    headers={
        'Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, X-CSRFToken'
    }
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print("Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
except Exception as e:
    print(f"Error: {e}")

# Also test GET with Origin header
print("\n--- GET with Origin header ---")
req2 = urllib.request.Request(
    'http://localhost:8000/api/auth/user/',
    method='GET',
    headers={'Origin': 'http://localhost:8080'}
)
try:
    with urllib.request.urlopen(req2) as response:
        print(f"Status: {response.status}")
        print("Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        print("\nBody:", response.read().decode())
except Exception as e:
    print(f"Error: {e}")
