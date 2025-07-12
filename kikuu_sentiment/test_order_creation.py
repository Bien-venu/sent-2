#!/usr/bin/env python3
"""
Test order creation after fixing Decimal issue
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_complete_order_flow():
    """Test complete order creation flow"""
    
    print("🧪 Testing Order Creation Flow...")
    
    # Step 1: Register a buyer
    buyer_data = {
        "email": "buyer_test@example.com",
        "username": "buyer_test",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Buyer",
        "role": "buyer"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/register/", json=buyer_data)
    print(f"1. Buyer Registration: {response.status_code}")
    
    # Step 2: Register a seller
    seller_data = {
        "email": "seller_test@example.com",
        "username": "seller_test",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Seller",
        "role": "seller"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/register/", json=seller_data)
    print(f"2. Seller Registration: {response.status_code}")
    
    # Step 3: Login seller
    login_data = {
        "email": "seller_test@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/login/", json=login_data)
    print(f"3. Seller Login: {response.status_code}")
    
    if response.status_code != 200:
        print("❌ Seller login failed")
        return False
    
    seller_token = response.json()["token"]["access"]
    seller_headers = {"Authorization": f"Bearer {seller_token}"}
    
    # Step 4: Create a category
    category_data = {
        "category_name": "Test Electronics",
        "description": "Test category for electronics",
        "cat_image_url": "https://example.com/electronics.jpg"
    }
    
    response = requests.post(f"{BASE_URL}/store/categories/", 
                           json=category_data, headers=seller_headers)
    print(f"4. Category Creation: {response.status_code}")
    
    if response.status_code != 201:
        print("❌ Category creation failed")
        return False
    
    category_id = response.json()["id"]
    
    # Step 5: Create a product
    product_data = {
        "product_name": "Test iPhone",
        "description": "Test iPhone for order testing",
        "price": "999.99",
        "image_url": "https://example.com/iphone.jpg",
        "stock": 10,
        "is_available": True,
        "category": category_id
    }
    
    response = requests.post(f"{BASE_URL}/store/products/", 
                           json=product_data, headers=seller_headers)
    print(f"5. Product Creation: {response.status_code}")
    
    if response.status_code != 201:
        print(f"❌ Product creation failed: {response.text}")
        return False
    
    product_id = response.json()["id"]
    print(f"   Created product ID: {product_id}")
    
    # Step 6: Login buyer
    login_data = {
        "email": "buyer_test@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/login/", json=login_data)
    print(f"6. Buyer Login: {response.status_code}")
    
    if response.status_code != 200:
        print("❌ Buyer login failed")
        return False
    
    buyer_token = response.json()["token"]["access"]
    buyer_headers = {"Authorization": f"Bearer {buyer_token}"}
    
    # Step 7: Create order (this was failing before)
    order_data = {
        "first_name": "Test",
        "last_name": "Buyer",
        "email": "buyer_test@example.com",
        "phone": "+1234567890",
        "district": "Kigali",
        "sector": "Nyarugenge",
        "cell": "Muhima",
        "order_items": [
            {
                "product_id": product_id,
                "quantity": 2
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/orders/orders/", 
                           json=order_data, headers=buyer_headers)
    print(f"7. Order Creation: {response.status_code}")
    
    if response.status_code == 201:
        order_response = response.json()
        print(f"✅ Order created successfully!")
        print(f"   Order Number: {order_response['order_number']}")
        print(f"   Order Total: ${order_response['order_total']}")
        print(f"   Tax: ${order_response['tax']}")
        return True
    else:
        print(f"❌ Order creation failed: {response.text}")
        return False

def main():
    try:
        if test_complete_order_flow():
            print("\n🎉 All tests passed! Order creation is working correctly.")
        else:
            print("\n❌ Order creation test failed.")
    except Exception as e:
        print(f"\n❌ Test failed with exception: {e}")

if __name__ == "__main__":
    main()
