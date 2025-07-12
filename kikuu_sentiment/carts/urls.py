from django.urls import path
from .views import CartItemListView, AddCartItemView, RemoveCartItemView, UpdateCartItemQuantityView

urlpatterns = [
    path('items/', CartItemListView.as_view(), name='cart-items'),
    path('items/add/', AddCartItemView.as_view(), name='add-cart-item'),
    path('items/remove/<int:pk>/', RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('items/update-quantity/', UpdateCartItemQuantityView.as_view(), name='update-cart-item-quantity'),
]
