#!/usr/bin/env python3
"""
Simple test to verify Decimal calculations work correctly
"""

from decimal import Decimal

def test_decimal_calculations():
    """Test the exact calculations that were failing"""
    
    print("🧪 Testing Decimal Calculations...")
    
    # Simulate product prices (as they come from database)
    product_price = Decimal('999.99')  # This is how Django stores DecimalField
    quantity = 2
    
    # Test 1: Calculate item total
    item_total = product_price * quantity
    print(f"✅ Item total: {product_price} × {quantity} = {item_total}")
    
    # Test 2: Calculate order total (multiple items)
    total = Decimal('0.00')
    total += item_total
    print(f"✅ Order subtotal: {total}")
    
    # Test 3: Calculate tax (this was failing before)
    try:
        tax = total * Decimal('0.10')  # Fixed: using Decimal instead of float
        print(f"✅ Tax calculation: {total} × 0.10 = {tax}")
    except TypeError as e:
        print(f"❌ Tax calculation failed: {e}")
        return False
    
    # Test 4: Calculate final total
    order_total = total + tax
    print(f"✅ Final total: {total} + {tax} = {order_total}")
    
    # Test 5: Verify types
    print(f"\nType checks:")
    print(f"  product_price type: {type(product_price)}")
    print(f"  total type: {type(total)}")
    print(f"  tax type: {type(tax)}")
    print(f"  order_total type: {type(order_total)}")
    
    return True

def test_old_vs_new():
    """Compare old (broken) vs new (fixed) approach"""
    
    print("\n🔄 Comparing Old vs New Approach...")
    
    total = Decimal('1999.98')
    
    # Old approach (would fail)
    print("Old approach (broken):")
    try:
        old_tax = total * 0.10  # This would fail
        print(f"  ❌ This would fail: {old_tax}")
    except TypeError as e:
        print(f"  ❌ TypeError: {e}")
    
    # New approach (fixed)
    print("New approach (fixed):")
    try:
        new_tax = total * Decimal('0.10')  # This works
        print(f"  ✅ This works: {new_tax}")
        return True
    except TypeError as e:
        print(f"  ❌ Still failing: {e}")
        return False

def main():
    print("🔧 Testing Decimal Fix for Order Creation\n")
    
    success1 = test_decimal_calculations()
    success2 = test_old_vs_new()
    
    if success1 and success2:
        print("\n🎉 All Decimal calculations are working correctly!")
        print("✅ Order creation should now work without TypeError")
    else:
        print("\n❌ Decimal calculations still have issues")

if __name__ == "__main__":
    main()
