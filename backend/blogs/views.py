from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Blog, Category, Comment
from .serializers import BlogSerializer, BlogCategorySerializer, BlogCommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView



class BlogCategoryView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        categories = Category.objects.all()
        serializer = BlogCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BlogCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        blogs = Blog.objects.select_related("created_by").all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        serializer = BlogSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, **kwargs):
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            blog = Blog.objects.get(id=id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BlogSerializer(blog, data=request.data, partial=True)  # Use partial=True for PATCH
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
def activate_blog(request, blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
        blog.status = True
        blog.save(update_fields=["status"])
        return Response({"message": "Blog activated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Blog not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_blog(request, blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
        blog.status = False
        blog.save(update_fields=["status"])
        return Response({"message": "Blog deactivated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Blog not found!"}, status=status.HTTP_404_NOT_FOUND)
    
class GetSpecificBlogData(APIView):
    def get(self, request, blog_id):
        blog = get_object_or_404(Blog, id=blog_id)
        serializer = BlogSerializer(blog)  # Use your serializer directly
        return Response(serializer.data, status=status.HTTP_200_OK)