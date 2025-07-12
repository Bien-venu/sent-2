from rest_framework import serializers
from .models import Cart, CartItem
from store.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'product_name', 'price', 'image_url']

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_image = serializers.SerializerMethodField()
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    money = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_name', 'product_id', 'product_image', 'quantity', 'money']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image_url:
            return obj.product.image_url
        return None

    def get_money(self, obj):
        return str(obj.sub_total)

class AddCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product', 'quantity']
