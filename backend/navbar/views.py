from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import NavbarItem, NavbarCustomization
from .serializers import NavbarItemSerializer, NavbarCustomizationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

class Navbar(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        items = NavbarItem.objects.all().order_by("id")
        serializer = NavbarItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



    def post(self, request):
        serializer = NavbarItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Navbar item created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
    def patch(self, request, **kwargs):
        id = kwargs.get("id")
        data = request.data.copy()
        try:
            navbar_item = NavbarItem.objects.get(id=id)
            if "dropdown_parent" in data:
                if data["dropdown_parent"] == "":
                    data["dropdown_parent"] = None  # Convert empty string to null
                else:
                    try:
                        data["dropdown_parent"] = int(data["dropdown_parent"])  # Convert to integer
                    except ValueError:
                        return Response({"error": "Invalid dropdown_parent ID"}, status=status.HTTP_400_BAD_REQUEST)
        except NavbarItem.DoesNotExist:
            return Response({"error": "Navbar item not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = NavbarItemSerializer(navbar_item, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_navbar_item(request, navbaritem_id):
    try:
        navbar_item = NavbarItem.objects.get(id=navbaritem_id)
        navbar_item.status = True
        navbar_item.save(update_fields=["status"])
        return Response({"message": "Item activated successfully!"}, status=status.HTTP_200_OK)
    except NavbarItem.DoesNotExist:
        return Response({"error": "Item not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_navbar_item(request, navbaritem_id):
    try:
        navbar_item = NavbarItem.objects.get(id=navbaritem_id)
        navbar_item.status = False
        navbar_item.save(update_fields=["status"])
        return Response({"message": "Item deactivated successfully!"}, status=status.HTTP_200_OK)
    except NavbarItem.DoesNotExist:
        return Response({"error": "Item not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_navbar_item(request, navbaritem_id):
    navbar_item = get_object_or_404(NavbarItem, id=navbaritem_id)
    serializer = NavbarItemSerializer(navbar_item)  # Serialize the object
    return Response(serializer.data, status=status.HTTP_200_OK)
