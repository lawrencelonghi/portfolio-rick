from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from .models import Work

def work_list(request):
    works = Work.objects.all().order_by('-id')
    data = [
        {
            "id": work.id,
            "title": work.title,
            "file_url": request.build_absolute_uri(work.file.url) if work.file else None
        }
        for work in works
    ]
    return JsonResponse(data, safe=False)