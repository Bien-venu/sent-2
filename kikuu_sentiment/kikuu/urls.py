from django.urls import path
from .views import (
    ReviewListCreateAPIView,
    ReviewDetailAPIView,
    UserReviewsAPIView,
    ReviewsByRoleAPIView,
    ReviewStatsAPIView
)

urlpatterns = [
    # CRUD operations for reviews
    path('reviews/', ReviewListCreateAPIView.as_view(), name='review-list-create'),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view(), name='review-detail'),

    # User-specific reviews
    path('my-reviews/', UserReviewsAPIView.as_view(), name='user-reviews'),

    # Reviews filtered by role
    path('reviews/role/<str:role>/', ReviewsByRoleAPIView.as_view(), name='reviews-by-role'),

    # Review statistics
    path('reviews/stats/', ReviewStatsAPIView.as_view(), name='review-stats'),
]
