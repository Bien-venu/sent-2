from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['id', 'created_date']

class ProductSerializer(serializers.ModelSerializer):
    seller_phone_number = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'product_name', 'description', 'price', 'image_url',
            'stock', 'is_available', 'category', 'user', 'created_date',
            'seller_phone_number'
        ]
        read_only_fields = ['user', 'created_date', 'seller_phone_number']

    def get_seller_phone_number(self, obj):
        return getattr(obj.user, 'phone_number', None)