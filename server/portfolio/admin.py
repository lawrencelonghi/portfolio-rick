from django.contrib import admin
from .models import Work

@admin.register(Work)
class WorkAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'title', 'is_cover', 'order', 'file_preview')
    list_filter = ('campaign', 'is_cover')
    list_editable = ('order', 'is_cover')
    search_fields = ('campaign', 'title')
    ordering = ('campaign', 'order')
    
    def file_preview(self, obj):
        if obj.file:
            ext = obj.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                return f'🖼️ Imagem'
            elif ext in ['mp4', 'webm', 'ogg']:
                return f'🎥 Vídeo'
        return '❌ Sem arquivo'
    file_preview.short_description = 'Tipo'

    # solucao que funciona