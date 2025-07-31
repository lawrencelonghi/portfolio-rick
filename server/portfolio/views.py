from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from .models import Work

def work_list(request):
    works = Work.objects.all()
    data = [
        {
            "id": work.id,
            "title": work.title,
            "image": request.build_absolute_uri(work.image.url)
        }
        for work in works
    ]
    return JsonResponse(data, safe=False)