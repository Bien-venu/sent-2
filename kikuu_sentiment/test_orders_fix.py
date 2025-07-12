#!/usr/bin/env python3
"""
Quick test to verify orders endpoint is working after migration
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health/", timeout=5)
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_orders_without_auth():
    """Test orders endpoint without authentication (should return 401)"""
    try:
        response = requests.get(f"{BASE_URL}/api/orders/orders/", timeout=5)
        print(f"Orders without auth: {response.status_code}")
        if response.status_code == 401:
            print("✅ Orders endpoint is working (correctly requires authentication)")
            return True
        else:
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"Orders test failed: {e}")
        return False

def test_register_and_orders():
    """Test complete flow: register, login, test orders"""
    try:
        # Register user
        user_data = {
            "email": "test_orders@example.com",
            "username": "test_orders",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Orders",
            "role": "buyer"
        }
        
        response = requests.post(f"{BASE_URL}/api/accounts/register/", 
                               json=user_data, timeout=5)
        print(f"Registration: {response.status_code}")
        
        # Login
        login_data = {
            "email": "test_orders@example.com",
            "password": "testpass123"
        }
        
        response = requests.post(f"{BASE_URL}/api/accounts/login/", 
                               json=login_data, timeout=5)
        print(f"Login: {response.status_code}")
        
        if response.status_code == 200:
            token = response.json()["token"]["access"]
            
            # Test orders with authentication
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/api/orders/orders/", 
                                  headers=headers, timeout=5)
            print(f"Orders with auth: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Orders endpoint is working correctly!")
                print(f"Response: {response.json()}")
                return True
            else:
                print(f"Orders error: {response.text}")
                return False
        
        return False
        
    except Exception as e:
        print(f"Complete test failed: {e}")
        return False

def main():
    print("🧪 Testing Orders API after migration fix...")
    
    # Test 1: Health check
    if not test_health():
        print("❌ Server is not responding")
        return
    
    # Test 2: Orders without auth
    if not test_orders_without_auth():
        print("❌ Orders endpoint has issues")
        return
    
    # Test 3: Complete flow
    if test_register_and_orders():
        print("🎉 All tests passed! Orders API is working correctly.")
    else:
        print("❌ Complete flow test failed")

if __name__ == "__main__":
    main()
