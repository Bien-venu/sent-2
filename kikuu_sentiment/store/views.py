from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.exceptions import PermissionDenied
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        user = request.user

        # Allow only users with role 'seller' to create
        if not hasattr(user, 'role') or user.role != 'seller':
            return Response(
                {"error": "Only sellers can create categories."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": "Category created successfully.",
                "category": serializer.data
            },
            status=status.HTTP_201_CREATED
        )



class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Category retrieved successfully.",
            "category": serializer.data
        })

    def update(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'role') or user.role != 'seller':
            return Response(
                {"error": "Only sellers can update categories."},
                status=status.HTTP_403_FORBIDDEN
            )
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Category updated successfully.",
            "category": serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'role') or user.role != 'seller':
            return Response(
                {"error": "Only sellers can delete categories."},
                status=status.HTTP_403_FORBIDDEN
            )
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            "message": "Category deleted successfully."
        }, status=status.HTTP_204_NO_CONTENT)



class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'role'):
            raise PermissionDenied("User role not found. Please contact support.")
        if user.role != 'seller':
            raise PermissionDenied(f"Only sellers can create products. Your current role is '{user.role}'. Please contact support to upgrade to a seller account.")
        serializer.save(user=user)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return Response({
                "message": "Product created successfully.",
                "product": response.data
            }, status=status.HTTP_201_CREATED)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Product retrieved successfully.",
            "product": serializer.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        user = request.user

        if not hasattr(user, 'role') or user.role != 'seller':
            return Response({"error": "Only sellers can update products."}, status=status.HTTP_403_FORBIDDEN)

        if product.user != user:
            return Response({"error": "You can only update your own products."}, status=status.HTTP_403_FORBIDDEN)

        response = super().update(request, *args, **kwargs)
        return Response({
            "message": "Product updated successfully.",
            "product": response.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        user = request.user

        if not hasattr(user, 'role') or user.role != 'seller':
            return Response({"error": "Only sellers can delete products."}, status=status.HTTP_403_FORBIDDEN)

        if product.user != user:
            return Response({"error": "You can only delete your own products."}, status=status.HTTP_403_FORBIDDEN)

        super().destroy(request, *args, **kwargs)
        return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
