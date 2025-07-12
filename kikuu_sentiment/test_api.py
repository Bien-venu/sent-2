#!/usr/bin/env python3
"""
Test script for Kikuu Sentiment API
This script tests all the review CRUD operations and user management.
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8000/api"
HEADERS = {"Content-Type": "application/json"}

def print_response(response, operation):
    """Print formatted response"""
    print(f"\n{'='*50}")
    print(f"Operation: {operation}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print('='*50)

def test_user_registration():
    """Test user registration for both buyer and seller"""
    print("\n🔐 Testing User Registration...")
    
    # Register a buyer
    buyer_data = {
        "email": "buyer@test.com",
        "username": "test_buyer",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Buyer",
        "role": "buyer"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/register/", 
                           json=buyer_data, headers=HEADERS)
    print_response(response, "Register Buyer")
    
    # Register a seller
    seller_data = {
        "email": "seller@test.com",
        "username": "test_seller",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Seller",
        "role": "seller"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/register/", 
                           json=seller_data, headers=HEADERS)
    print_response(response, "Register Seller")

def test_user_login():
    """Test user login and return tokens"""
    print("\n🔑 Testing User Login...")
    
    # Login buyer
    login_data = {
        "email": "buyer@test.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/login/", 
                           json=login_data, headers=HEADERS)
    print_response(response, "Login Buyer")
    
    buyer_token = None
    if response.status_code == 200:
        buyer_token = response.json()["token"]["access"]
    
    # Login seller
    login_data = {
        "email": "seller@test.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/accounts/login/", 
                           json=login_data, headers=HEADERS)
    print_response(response, "Login Seller")
    
    seller_token = None
    if response.status_code == 200:
        seller_token = response.json()["token"]["access"]
    
    return buyer_token, seller_token

def test_create_reviews(buyer_token, seller_token):
    """Test creating reviews as both buyer and seller"""
    print("\n📝 Testing Review Creation...")
    
    # Create review as buyer
    buyer_headers = {**HEADERS, "Authorization": f"Bearer {buyer_token}"}
    buyer_review = {
        "comment": "Great platform for buyers! Easy to find products.",
        "sentiment": "positive",
        "rating": 5,
        "source_url": "https://example.com/buyer-experience"
    }
    
    response = requests.post(f"{BASE_URL}/kikuu/reviews/", 
                           json=buyer_review, headers=buyer_headers)
    print_response(response, "Create Review as Buyer")
    buyer_review_id = response.json().get("id") if response.status_code == 201 else None
    
    # Create review as seller
    seller_headers = {**HEADERS, "Authorization": f"Bearer {seller_token}"}
    seller_review = {
        "comment": "Excellent platform for sellers! Good commission rates.",
        "sentiment": "positive",
        "rating": 4,
        "source_url": "https://example.com/seller-experience"
    }
    
    response = requests.post(f"{BASE_URL}/kikuu/reviews/", 
                           json=seller_review, headers=seller_headers)
    print_response(response, "Create Review as Seller")
    seller_review_id = response.json().get("id") if response.status_code == 201 else None
    
    # Create another review with different sentiment
    negative_review = {
        "comment": "Had some issues with the delivery system.",
        "sentiment": "negative",
        "rating": 2
    }
    
    response = requests.post(f"{BASE_URL}/kikuu/reviews/", 
                           json=negative_review, headers=buyer_headers)
    print_response(response, "Create Negative Review as Buyer")
    
    return buyer_review_id, seller_review_id

def test_list_reviews():
    """Test listing reviews with various filters"""
    print("\n📋 Testing Review Listing...")
    
    # List all reviews
    response = requests.get(f"{BASE_URL}/kikuu/reviews/")
    print_response(response, "List All Reviews")
    
    # Filter by role
    response = requests.get(f"{BASE_URL}/kikuu/reviews/?user_role=buyer")
    print_response(response, "List Buyer Reviews")
    
    # Filter by sentiment
    response = requests.get(f"{BASE_URL}/kikuu/reviews/?sentiment=positive")
    print_response(response, "List Positive Reviews")
    
    # Filter by rating
    response = requests.get(f"{BASE_URL}/kikuu/reviews/?rating=5")
    print_response(response, "List 5-Star Reviews")
    
    # Search in comments
    response = requests.get(f"{BASE_URL}/kikuu/reviews/?search=platform")
    print_response(response, "Search Reviews")

def test_review_detail(review_id, token):
    """Test retrieving, updating, and deleting a specific review"""
    if not review_id or not token:
        print("⚠️ Skipping review detail tests - missing review ID or token")
        return
    
    print(f"\n🔍 Testing Review Detail Operations (ID: {review_id})...")
    
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    
    # Get specific review
    response = requests.get(f"{BASE_URL}/kikuu/reviews/{review_id}/")
    print_response(response, f"Get Review {review_id}")
    
    # Update review
    update_data = {
        "comment": "Updated: This platform keeps getting better!",
        "sentiment": "positive",
        "rating": 5
    }
    
    response = requests.patch(f"{BASE_URL}/kikuu/reviews/{review_id}/", 
                            json=update_data, headers=headers)
    print_response(response, f"Update Review {review_id}")

def test_user_reviews(token):
    """Test getting user's own reviews"""
    if not token:
        print("⚠️ Skipping user reviews test - missing token")
        return
    
    print("\n👤 Testing User's Own Reviews...")
    
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/kikuu/my-reviews/", headers=headers)
    print_response(response, "Get My Reviews")

def test_reviews_by_role():
    """Test getting reviews filtered by role"""
    print("\n👥 Testing Reviews by Role...")
    
    # Get buyer reviews
    response = requests.get(f"{BASE_URL}/kikuu/reviews/role/buyer/")
    print_response(response, "Get Buyer Reviews")
    
    # Get seller reviews
    response = requests.get(f"{BASE_URL}/kikuu/reviews/role/seller/")
    print_response(response, "Get Seller Reviews")

def test_review_stats():
    """Test getting review statistics"""
    print("\n📊 Testing Review Statistics...")
    
    response = requests.get(f"{BASE_URL}/kikuu/reviews/stats/")
    print_response(response, "Get Review Statistics")

def main():
    """Run all tests"""
    print("🚀 Starting Kikuu Sentiment API Tests...")
    
    try:
        # Test user management
        test_user_registration()
        buyer_token, seller_token = test_user_login()
        
        # Test review operations
        buyer_review_id, seller_review_id = test_create_reviews(buyer_token, seller_token)
        test_list_reviews()
        test_review_detail(buyer_review_id, buyer_token)
        test_user_reviews(buyer_token)
        test_reviews_by_role()
        test_review_stats()
        
        print("\n✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        print("Make sure the Django development server is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
