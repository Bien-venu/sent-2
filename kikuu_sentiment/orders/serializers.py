from rest_framework import serializers
from .models import Order, OrderProduct, Payment
from store.models import Product
from accounts.models import User
from decimal import Decimal

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_id', 'payment_method', 'amount_paid', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

class OrderProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_image = serializers.URLField(source='product.image_url', read_only=True)
    
    class Meta:
        model = OrderProduct
        fields = [
            'id', 'product', 'product_name', 'product_image', 
            'quantity', 'product_price', 'ordered', 'created_at'
        ]
        read_only_fields = ['id', 'product_name', 'product_image', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    order_products = OrderProductSerializer(many=True, read_only=True, source='orderproduct_set')
    payment_details = PaymentSerializer(read_only=True, source='payment')
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user_email', 'first_name', 'last_name', 'email', 'phone',
            'district', 'sector', 'cell', 'order_total', 'tax', 'status',
            'order_number', 'is_ordered', 'created_at', 'updated_at',
            'order_products', 'payment_details'
        ]
        read_only_fields = [
            'id', 'user_email', 'order_number', 'created_at', 'updated_at',
            'order_products', 'payment_details'
        ]

class OrderCreateSerializer(serializers.ModelSerializer):
    order_items = serializers.ListField(
        child=serializers.DictField(), write_only=True,
        help_text="List of items: [{'product_id': 1, 'quantity': 2}, ...]"
    )
    
    class Meta:
        model = Order
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'district', 'sector', 'cell', 'order_items'
        ]
    
    def validate_order_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Each item must have 'product_id' and 'quantity'.")
            
            try:
                product = Product.objects.get(id=item['product_id'])
                if not product.is_available:
                    raise serializers.ValidationError(f"Product '{product.product_name}' is not available.")
                if product.stock < item['quantity']:
                    raise serializers.ValidationError(f"Insufficient stock for '{product.product_name}'.")
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {item['product_id']} does not exist.")
        
        return value
    
    def create(self, validated_data):
        order_items = validated_data.pop('order_items')
        user = self.context['request'].user
        
        # Calculate order total
        total = Decimal('0.00')
        for item in order_items:
            product = Product.objects.get(id=item['product_id'])
            total += product.price * item['quantity']

        # Calculate tax (10%)
        tax = total * Decimal('0.10')
        order_total = total + tax
        
        # Create order
        order = Order.objects.create(
            user=user,
            order_total=order_total,
            tax=tax,
            ip=self.context['request'].META.get('REMOTE_ADDR', ''),
            **validated_data
        )
        
        # Generate order number
        order.order_number = f"ORD-{order.id:06d}"
        order.save()
        
        # Create order products
        for item in order_items:
            product = Product.objects.get(id=item['product_id'])
            OrderProduct.objects.create(
                order=order,
                user=user,
                product=product,
                quantity=item['quantity'],
                product_price=product.price
            )
            
            # Update product stock
            product.stock -= item['quantity']
            if product.stock <= 0:
                product.is_available = False
            product.save()
        
        return order

class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
    
    def validate_status(self, value):
        valid_statuses = ['pending', 'processed', 'shipped', 'completed', 'canceled']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of: {', '.join(valid_statuses)}")
        return value
