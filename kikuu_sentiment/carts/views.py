from rest_framework import generics, status
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartItemSerializer, AddCartItemSerializer
from store.models import Product
from django.shortcuts import get_object_or_404

def get_or_create_cart_id(request):
    cart_id = request.session.get('cart_id')
    if not cart_id:
        cart = Cart.objects.create()
        request.session['cart_id'] = cart.id
        return cart.id
    return cart_id

class CartItemListView(generics.ListAPIView):
    serializer_class = CartItemSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CartItem.objects.filter(user=self.request.user, is_active=True)
        cart_id = get_or_create_cart_id(self.request)
        return CartItem.objects.filter(cart_id=cart_id, is_active=True)

class AddCartItemView(generics.CreateAPIView):
    serializer_class = AddCartItemSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        product = get_object_or_404(Product, id=data.get("product"))
        quantity = int(data.get("quantity", 1))

        cart_id = get_or_create_cart_id(request)
        cart = get_object_or_404(Cart, id=cart_id)

        if request.user.is_authenticated:
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user, cart=cart, product=product, defaults={"quantity": quantity}
            )
        else:
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart, product=product, defaults={"quantity": quantity}
            )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response({
            "message": "Item added to cart",
            "item": {
                "id": cart_item.id,
                "product_name": cart_item.product.product_name,
                "product_id": cart_item.product.id,
                "product_image": cart_item.product.image_url if hasattr(cart_item.product, 'image_url') else None,
                "quantity": cart_item.quantity
            }
        }, status=status.HTTP_201_CREATED)

class RemoveCartItemView(generics.DestroyAPIView):
    def delete(self, request, *args, **kwargs):
        item_id = kwargs.get('pk')
        try:
            cart_item = CartItem.objects.get(id=item_id)
            if request.user.is_authenticated and cart_item.user == request.user:
                cart_item.delete()
            elif not request.user.is_authenticated:
                cart_id = get_or_create_cart_id(request)
                if cart_item.cart_id == int(cart_id):
                    cart_item.delete()
            else:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Item removed"}, status=status.HTTP_200_OK)

class UpdateCartItemQuantityView(generics.GenericAPIView):
    serializer_class = AddCartItemSerializer 

    def post(self, request, *args, **kwargs):
        data = request.data
        product = get_object_or_404(Product, id=data.get("product"))
        action = data.get("action", "add").lower()
        quantity_change = int(data.get("quantity", 1))

        if quantity_change < 1:
            quantity_change = 1 

        cart_id = get_or_create_cart_id(request)
        cart = get_object_or_404(Cart, id=cart_id)

        if request.user.is_authenticated:
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user, cart=cart, product=product, defaults={"quantity": 0}
            )
        else:
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart, product=product, defaults={"quantity": 0}
            )

        if action == "add":
            cart_item.quantity += quantity_change
            cart_item.save()
            message = "Item quantity increased."
        elif action == "remove":
            cart_item.quantity -= quantity_change
            if cart_item.quantity <= 0:
                cart_item.delete()
                return Response({"message": "Item removed from cart because quantity reached zero."}, status=status.HTTP_200_OK)
            else:
                cart_item.save()
                message = "Item quantity decreased."
        else:
            return Response({"error": "Invalid action. Use 'add' or 'remove'."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": message,
            "item": {
                "id": cart_item.id,
                "product_name": cart_item.product.product_name,
                "product_id": cart_item.product.id,
                "product_image": cart_item.product.image_url if hasattr(cart_item.product, 'image_url') else None,
                "quantity": cart_item.quantity
            }
        }, status=status.HTTP_200_OK)
