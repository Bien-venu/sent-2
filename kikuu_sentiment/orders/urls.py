from django.urls import path
from .views import (
    OrderListCreateAPIView,
    OrderDetailAPIView,
    UserOrderHistoryAPIView,
    SellerOrdersAPIView,
    OrderStatsAPIView
)

urlpatterns = [
    # Order CRUD operations
    path('orders/', OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
    
    # User-specific order views
    path('my-orders/', UserOrderHistoryAPIView.as_view(), name='user-order-history'),
    path('seller-orders/', SellerOrdersAPIView.as_view(), name='seller-orders'),
    
    # Order statistics
    path('orders/stats/', OrderStatsAPIView.as_view(), name='order-stats'),
]
