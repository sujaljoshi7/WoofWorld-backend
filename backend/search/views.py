from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from products.models import Product
from events.models import Event
from adoption.models import Dogs

class GlobalSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '').strip()
        if not query:
            return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Search across different models
        products = Product.objects.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query),
            status=1
        )[:5]

        events = Event.objects.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query),
            status=True
        )[:5]

        dogs = Dogs.objects.filter(
            Q(name__icontains=query) | 
            Q(breed__icontains=query),
            status=True
        )[:5]

        results = {
            'products': [{
                'id': p.id,
                'name': p.name,
                'image': p.image.url if p.image else None,
                'price': str(p.price)
            } for p in products],
            'events': [{
                'id': e.id,
                'title': e.title,
                'date': e.date,
                'image': e.image.url if e.image else None
            } for e in events],
            'dogs': [{
                'id': d.id,
                'name': d.name,
                'breed': d.breed,
                'image': d.image.url if d.image else None
            } for d in dogs]
        }

        return Response(results) 