import urllib.request

try:
    print("Sending request to local server to trigger database initialization...")
    response = urllib.request.urlopen("http://localhost:3000/shop", timeout=10)
    print(f"Response code: {response.getcode()}")
except Exception as e:
    print(f"Request error (this is normal if server is booting): {e}")
