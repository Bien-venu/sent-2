
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import LoginSerializer, RegisterSerializer
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')

        # Check if email or username already exists
        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            return Response(
                {"detail": "An account with this email or username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate and save the new user
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Account created successfully.", "user": serializer.data},
                status=status.HTTP_201_CREATED
            )

        # Return any serializer validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            tokens = get_tokens_for_user(user)
            return Response({
                "detail": "Login successful.",
                "token": tokens,
                "user": {
                    "email": user.email,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role
                }
            }, status=status.HTTP_200_OK)
        
        # Add detail message on error
        return Response({
            "detail": "Invalid email or password.",
            "errors": serializer.errors  
        }, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]