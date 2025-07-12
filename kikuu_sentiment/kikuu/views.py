from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, generics
from rest_framework.exceptions import PermissionDenied, NotFound
from django.db.models import Q
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer, ReviewUpdateSerializer

class ReviewPermission(permissions.BasePermission):
    """
    Custom permission to only allow sellers and buyers to access reviews.
    Only owners of a review can edit/delete it.
    """

    def has_permission(self, request, view):
        # Allow read access to anyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # For write operations, user must be authenticated
        if not request.user.is_authenticated:
            return False

        # Check if user has valid role (seller or buyer)
        if hasattr(request.user, 'role') and request.user.role in ['seller', 'buyer']:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only to the owner of the review
        return obj.user == request.user

class ReviewListCreateAPIView(generics.ListCreateAPIView):
    """
    List all reviews or create a new review.
    GET: Anyone can view reviews
    POST: Only authenticated sellers and buyers can create reviews
    """
    serializer_class = ReviewSerializer
    permission_classes = [ReviewPermission]

    def get_queryset(self):
        queryset = Review.objects.all()

        # Filter by user role if specified
        user_role = self.request.query_params.get('user_role', None)
        if user_role in ['seller', 'buyer']:
            queryset = queryset.filter(user_role=user_role)

        # Filter by sentiment if specified
        sentiment = self.request.query_params.get('sentiment', None)
        if sentiment in ['positive', 'negative', 'neutral']:
            queryset = queryset.filter(sentiment=sentiment)

        # Filter by rating if specified
        rating = self.request.query_params.get('rating', None)
        if rating and rating.isdigit() and 1 <= int(rating) <= 5:
            queryset = queryset.filter(rating=int(rating))

        # Search in comments
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(comment__icontains=search) | Q(username__icontains=search)
            )

        return queryset.order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        user = self.request.user

        # Ensure user has a valid role
        if not hasattr(user, 'role') or user.role not in ['seller', 'buyer']:
            raise PermissionDenied("Only sellers and buyers can create reviews.")

        serializer.save(
            user=user,
            username=user.username,
            user_role=user.role
        )

class ReviewDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a review instance.
    GET: Anyone can view a specific review
    PUT/PATCH: Only the owner can update their review
    DELETE: Only the owner can delete their review
    """
    queryset = Review.objects.all()
    permission_classes = [ReviewPermission]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ReviewUpdateSerializer
        return ReviewSerializer

    def get_object(self):
        try:
            return super().get_object()
        except Review.DoesNotExist:
            raise NotFound("Review not found.")

class UserReviewsAPIView(generics.ListAPIView):
    """
    List all reviews by the authenticated user.
    Only accessible by authenticated users.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).order_by('-created_at')

class ReviewsByRoleAPIView(generics.ListAPIView):
    """
    List reviews filtered by user role (seller or buyer).
    Anyone can access this endpoint.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        role = self.kwargs.get('role')
        if role not in ['seller', 'buyer']:
            return Review.objects.none()

        queryset = Review.objects.filter(user_role=role)

        # Additional filtering
        sentiment = self.request.query_params.get('sentiment', None)
        if sentiment in ['positive', 'negative', 'neutral']:
            queryset = queryset.filter(sentiment=sentiment)

        rating = self.request.query_params.get('rating', None)
        if rating and rating.isdigit() and 1 <= int(rating) <= 5:
            queryset = queryset.filter(rating=int(rating))

        return queryset.order_by('-created_at')

class ReviewStatsAPIView(APIView):
    """
    Get statistics about reviews.
    Anyone can access this endpoint.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from django.db.models import Count, Avg

        total_reviews = Review.objects.count()

        # Count by sentiment
        sentiment_stats = Review.objects.values('sentiment').annotate(
            count=Count('sentiment')
        ).order_by('sentiment')

        # Count by user role
        role_stats = Review.objects.values('user_role').annotate(
            count=Count('user_role')
        ).order_by('user_role')

        # Average rating
        avg_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating']

        # Rating distribution
        rating_stats = Review.objects.values('rating').annotate(
            count=Count('rating')
        ).order_by('rating')

        return Response({
            'total_reviews': total_reviews,
            'average_rating': round(avg_rating, 2) if avg_rating else 0,
            'sentiment_distribution': list(sentiment_stats),
            'role_distribution': list(role_stats),
            'rating_distribution': list(rating_stats)
        })