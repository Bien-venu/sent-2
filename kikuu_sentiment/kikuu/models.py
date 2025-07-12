from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Review(models.Model):
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]

    USER_ROLE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    username = models.CharField(max_length=100)
    user_role = models.CharField(max_length=10, choices=USER_ROLE_CHOICES, default='buyer')
    comment = models.TextField()
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES, default='neutral')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars",
        default=3
    )
    source_url = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False, help_text="Whether this review is verified")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sentiment']),
            models.Index(fields=['user_role']),
            models.Index(fields=['rating']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.username} ({self.user_role}) - {self.sentiment} - {self.rating}★"

    def save(self, *args, **kwargs):
        # Automatically set user_role based on the user's role
        if self.user and hasattr(self.user, 'role'):
            self.user_role = self.user.role
        # Set username from user if not provided
        if self.user and not self.username:
            self.username = self.user.username
        super().save(*args, **kwargs)
