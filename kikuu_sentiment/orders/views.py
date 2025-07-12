from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from .models import Order, OrderProduct, Payment
from .serializers import (
    OrderSerializer, OrderCreateSerializer, OrderUpdateSerializer,
    OrderProductSerializer, PaymentSerializer
)
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

class OrderListCreateAPIView(generics.ListCreateAPIView):
    """
    List user's orders or create a new order.
    Only authenticated users can access.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.filter(user=user)

        # Filter by status if specified
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset.order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        logger.info(f"Creating order for user: {self.request.user.email}")
        order = serializer.save()
        logger.info(f"Order created successfully: {order.order_number}")

class OrderDetailAPIView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a specific order.
    Users can only access their own orders.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return OrderUpdateSerializer
        return OrderSerializer

class UserOrderHistoryAPIView(generics.ListAPIView):
    """
    Get complete order history for the authenticated user.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user,
            is_ordered=True
        ).order_by('-created_at')

class SellerOrdersAPIView(generics.ListAPIView):
    """
    Get orders containing products from the authenticated seller.
    Only accessible by sellers.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Check if user is a seller
        if not hasattr(user, 'role') or user.role != 'seller':
            raise PermissionDenied("Only sellers can access this endpoint.")

        # Get orders containing products from this seller
        return Order.objects.filter(
            orderproduct__product__user=user,
            is_ordered=True
        ).distinct().order_by('-created_at')

class OrderStatsAPIView(generics.GenericAPIView):
    """
    Get order statistics for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Basic order stats
        total_orders = Order.objects.filter(user=user).count()
        completed_orders = Order.objects.filter(user=user, status='completed').count()
        pending_orders = Order.objects.filter(user=user, status='pending').count()

        # Calculate total spent
        completed_order_totals = Order.objects.filter(
            user=user,
            status='completed'
        ).values_list('order_total', flat=True)
        total_spent = sum(completed_order_totals) if completed_order_totals else 0

        stats = {
            'total_orders': total_orders,
            'completed_orders': completed_orders,
            'pending_orders': pending_orders,
            'total_spent': float(total_spent),
            'average_order_value': float(total_spent / completed_orders) if completed_orders > 0 else 0
        }

        # If user is a seller, add seller-specific stats
        if hasattr(user, 'role') and user.role == 'seller':
            from django.db import models

            seller_orders = Order.objects.filter(
                orderproduct__product__user=user,
                is_ordered=True
            ).distinct()

            seller_revenue = sum([
                order.orderproduct_set.filter(product__user=user).aggregate(
                    total=models.Sum(models.F('quantity') * models.F('product_price'))
                )['total'] or Decimal('0.00')
                for order in seller_orders
            ])

            stats['seller_stats'] = {
                'orders_with_my_products': seller_orders.count(),
                'total_revenue': float(seller_revenue)
            }

        return Response(stats)
