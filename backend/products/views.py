from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Category, Product, ProductImages
from .serializers import ProductCategorySerializer, ProductSerializer, ProductImageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


class ProductCategoryView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        categories = Category.objects.all()
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        products = Product.objects.select_related("created_by").all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        serializer = ProductSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, **kwargs):
        id = kwargs.get("id")
        try:
            product = Product.objects.get(id=id)
            data = request.data.copy()
            data['created_by'] = request.user.id
            
            # If SKU is not provided in the request, keep the existing SKU
            if 'sku' not in data and product.sku:
                data['sku'] = product.sku
            
            serializer = ProductSerializer(product, data=data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

class ProductImageView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get(self, request):
        images = ProductImages.objects.all()
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        product_id = request.data.get("product_id")
        images = request.data.get("images")  # List of image URLs

        if not product_id or not images:
            return Response({'error': 'product_id and images are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(images, list):
            return Response({'error': 'images should be a list of image URLs.'}, status=status.HTTP_400_BAD_REQUEST)

        # Delete existing images for the event
        ProductImages.objects.filter(product_id_id=product_id).delete()

        # Add new images
        created_images = []
        for image_url in images:
            instance = ProductImages.objects.create(product_id_id=product_id, image=image_url)
            created_images.append(ProductImageSerializer(instance).data)

        return Response({'message': 'Images updated successfully.', 'data': created_images}, status=status.HTTP_200_OK)

class GetSpecificProductImageView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get(self, request, product_id):
        try:
            images = ProductImages.objects.filter(product_id=product_id)
            serializer = ProductImageSerializer(images, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        category.status = True
        category.save(update_fields=["status"])
        return Response({"message": "Category activated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        category.status = False
        category.save(update_fields=["status"])
        return Response({"message": "Category deactivated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.status = True
        product.save(update_fields=["status"])
        return Response({"message": "Product activated successfully!"}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.status = False
        product.save(update_fields=["status"])
        return Response({"message": "Product deactivated successfully!"}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_specific_product_data(request, product_id):
    product = get_object_or_404(Product, name=product_id)
    serializer = ProductSerializer(product)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)