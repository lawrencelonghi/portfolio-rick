from django.http import JsonResponse
from .models import Campaign

def work_list(request):
    campaigns = Campaign.objects.prefetch_related('works').all()
    
    data = []
    for campaign in campaigns:
        works = campaign.works.all()
        items = []
        
        for work in works:
            items.append({
                "id": work.id,
                "title": work.title,
                "file_url": request.build_absolute_uri(work.file.url) if work.file else None,
                "is_cover": work.is_cover,
                "order": work.order
            })
        
        # Encontrar a capa ou usar a primeira imagem
        cover = next((item for item in items if item['is_cover']), items[0] if items else None)
        
        if items:  # Só adiciona campanhas com imagens
            data.append({
                "campaign": campaign.name,
                "cover": cover,
                "items": items
            })
    
    return JsonResponse(data, safe=False)