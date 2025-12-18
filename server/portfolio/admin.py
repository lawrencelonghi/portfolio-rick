from django.contrib import admin
from django.utils.html import format_html
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin
from .models import Campaign, Work


class WorkInline(SortableInlineAdminMixin, admin.TabularInline):
    model = Work
    extra = 1
    fields = ('file', 'title', 'is_cover', 'preview')
    readonly_fields = ('preview',)

    
    def preview(self, obj):
        if obj.file:
            ext = obj.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                return format_html(
                    '<img src="{}" style="max-height: 50px; max-width: 100px;" />',
                    obj.file.url
                )
            elif ext in ['mp4', 'webm', 'ogg']:
                return format_html(
                    '<video src="{}" style="max-height: 50px; max-width: 100px;" muted></video>',
                    obj.file.url
                )
        return '—'
    preview.short_description = 'Preview'


@admin.register(Campaign)
class CampaignAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'image_count', 'cover_preview', 'created_at')
    search_fields = ('name',)
    inlines = [WorkInline]
    
    def cover_preview(self, obj):
        cover = obj.get_cover_image()
        if cover and cover.file:
            ext = cover.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                return format_html(
                    '<img src="{}" style="max-height: 60px; max-width: 120px; object-fit: cover;" />',
                    cover.file.url
                )
            elif ext in ['mp4', 'webm', 'ogg']:
                return '🎥 Vídeo'
        return '—'
    cover_preview.short_description = 'Capa'


@admin.register(Work)
class WorkAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('campaign', 'title', 'is_cover', 'file_preview')
    list_filter = ('campaign', 'is_cover')
    list_editable = ('is_cover',)
    search_fields = ('campaign__name', 'title')
    
    def file_preview(self, obj):
        if obj.file:
            ext = obj.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                return format_html(
                    '<img src="{}" style="max-height: 50px; max-width: 100px;" />',
                    obj.file.url
                )
            elif ext in ['mp4', 'webm', 'ogg']:
                return '🎥 Vídeo'
        return '❌'
    file_preview.short_description = 'Preview'