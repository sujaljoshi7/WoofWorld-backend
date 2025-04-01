from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Hero, PartnerCompany
from .serializers import HeroSerializer, PartnerCompanySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


class HeroView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        hero = Hero.objects.all()
        serializer = HeroSerializer(hero, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self,request):
        serializer = HeroSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, **kwargs):
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            hero = Hero.objects.get(id=id)
        except Hero.DoesNotExist:
            return Response({"error": "Hero not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = HeroSerializer(hero, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_hero(request, hero_id):
    try:
        hero = Hero.objects.get(id=hero_id)
        hero.status = True
        hero.save(update_fields=["status"])
        return Response({"message": "Hero activated successfully!"}, status=status.HTTP_200_OK)
    except Hero.DoesNotExist:
        return Response({"error": "Hero not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_hero(request, hero_id):
    try:
        hero = Hero.objects.get(id=hero_id)
        hero.status = False
        hero.save(update_fields=["status"])
        return Response({"message": "Hero deactivated successfully!"}, status=status.HTTP_200_OK)
    except Hero.DoesNotExist:
        return Response({"error": "Hero not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_specific_hero_data(request, hero_id):
    hero = get_object_or_404(Hero, id=hero_id)
    serializer = HeroSerializer(hero)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)


# Partner Companies


class PartnerCompanyView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        partnercompanies = PartnerCompany.objects.all()
        serializer = PartnerCompanySerializer(partnercompanies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PartnerCompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id=None):
        if not id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            partnercompany = PartnerCompany.objects.get(id=id)
        except PartnerCompany.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PartnerCompanySerializer(partnercompany, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_partnercompany(request, company_id):
    try:
        partnercompany = PartnerCompany.objects.get(id=company_id)
        partnercompany.status = True
        partnercompany.save(update_fields=["status"])
        return Response({"message": "Company activated successfully!"}, status=status.HTTP_200_OK)
    except PartnerCompany.DoesNotExist:
        return Response({"error": "Company not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_partnercompany(request, company_id):
    try:
        partnercompany = PartnerCompany.objects.get(id=company_id)
        partnercompany.status = False
        partnercompany.save(update_fields=["status"])
        return Response({"message": "Company deactivated successfully!"}, status=status.HTTP_200_OK)
    except PartnerCompany.DoesNotExist:
        return Response({"error": "Company not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_specific_company_data(request, company_id):
    partnercompany = get_object_or_404(PartnerCompany, id=company_id)
    serializer = PartnerCompanySerializer(partnercompany)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)