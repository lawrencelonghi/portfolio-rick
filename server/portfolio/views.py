from django.http import JsonResponse
from .models import Work
from collections import defaultdict

def work_list(request):
    works = Work.objects.all().order_by('campaign', 'order')
    
    # Agrupar por campanha
    campaigns = defaultdict(list)
    for work in works:
        campaigns[work.campaign].append({
            "id": work.id,
            "title": work.title,
            "file_url": request.build_absolute_uri(work.file.url) if work.file else None,
            "is_cover": work.is_cover,
            "order": work.order
        })
    
    # Formatar resposta
    data = []
    for campaign_name, items in campaigns.items():
        # Encontrar a imagem de capa (ou a primeira se não tiver)
        cover = next((item for item in items if item['is_cover']), items[0] if items else None)
        
        data.append({
            "campaign": campaign_name,
            "cover": cover,
            "items": items
        })
    
    return JsonResponse(data, safe=False)