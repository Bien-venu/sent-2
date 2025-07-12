from rest_framework import serializers
from .models import Review
from django.contrib.auth import get_user_model

User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_role = serializers.CharField(read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'username', 'user_email', 'user_role', 'comment',
            'sentiment', 'rating', 'source_url', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_email', 'user_role', 'username', 'is_verified', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_sentiment(self, value):
        valid_sentiments = ['positive', 'negative', 'neutral']
        if value not in valid_sentiments:
            raise serializers.ValidationError(f"Sentiment must be one of: {', '.join(valid_sentiments)}")
        return value

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['comment', 'sentiment', 'rating', 'source_url']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_sentiment(self, value):
        valid_sentiments = ['positive', 'negative', 'neutral']
        if value not in valid_sentiments:
            raise serializers.ValidationError(f"Sentiment must be one of: {', '.join(valid_sentiments)}")
        return value

class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['comment', 'sentiment', 'rating', 'source_url']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_sentiment(self, value):
        valid_sentiments = ['positive', 'negative', 'neutral']
        if value not in valid_sentiments:
            raise serializers.ValidationError(f"Sentiment must be one of: {', '.join(valid_sentiments)}")
        return value
