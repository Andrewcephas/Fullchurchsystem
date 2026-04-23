import urllib.request
import json

# Test login with CSRF token handling
print("=== Testing Login API ===\n")

# Step 1: Get CSRF token by making a GET request first
print("1. Fetching CSRF token...")
req = urllib.request.Request('http://localhost:8000/api/auth/user/')
try:
    with urllib.request.urlopen(req) as response:
        # Django sets csrftoken cookie on any authenticated or unauthenticated request
        cookies = response.headers.get_all('Set-Cookie')
        csrf_token = None
        for cookie in cookies:
            if 'csrftoken' in cookie:
                # Extract token value
                parts = cookie.split(';')
                for part in parts:
                    if 'csrftoken=' in part:
                        csrf_token = part.split('=')[1].strip()
                        break
                if csrf_token:
                    break
        if csrf_token:
            print(f"   CSRF Token: {csrf_token[:20]}...")
        else:
            print("   No CSRF token in response, trying to get from cookie store...")
except Exception as e:
    print(f"   Error: {e}")

# Step 2: Try login without token (should work since csrf_exempt)
print("\n2. Testing login (CSRF-exempt endpoint)...")
login_data = json.dumps({'username': 'superadmin', 'password': 'test1234'}).encode('utf-8')
req2 = urllib.request.Request(
    'http://localhost:8000/api/auth/login/',
    data=login_data,
    method='POST',
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req2) as response:
        result = json.loads(response.read())
        print(f"   Status: {response.status}")
        print(f"   User: {result.get('user', {}).get('username')}")
        print(f"   Message: {result.get('message')}")
except urllib.error.HTTPError as e:
    print(f"   HTTP Error {e.code}: {e.read().decode()}")
except Exception as e:
    print(f"   Error: {e}")
