from django.db import models
import os

class Campaign(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nome da Campanha")
    order = models.PositiveIntegerField(
        default=0, 
        blank=False, 
        null=False,
        db_index=True,  # Para performance
        help_text="Ordem de exibição na home"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Campanha"
        verbose_name_plural = "Campanhas"
    
    def __str__(self):
        return self.name
    
    def get_cover_image(self):
        """Retorna a imagem de capa ou a primeira imagem"""
        cover = self.works.filter(is_cover=True).first()
        return cover or self.works.first()
    
    def image_count(self):
        return self.works.count()
    image_count.short_description = "Nº de imagens"


class Work(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='works', verbose_name="Campanha")
    title = models.CharField(max_length=100, blank=True, verbose_name="Título")
    file = models.FileField(upload_to='works/', blank=True, null=True, verbose_name="Arquivo")
    order = models.PositiveIntegerField(
        default=0,
        blank=False,
        null=False,
        db_index=True,  # Para performance
        help_text="Ordem de exibição dentro da campanha"
    )
    is_cover = models.BooleanField(default=False, verbose_name="Capa da campanha", help_text="Imagem que aparece na home")
    
    class Meta:
        ordering = ['order']
        verbose_name = "Trabalho"
        verbose_name_plural = "Trabalhos"
    
    def __str__(self):
        cover = " [CAPA]" if self.is_cover else ""
        return f"{self.title or 'Sem título'}{cover}"

    def delete(self, *args, **kwargs):
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        # Se marcar como capa, desmarcar outras capas da mesma campanha
        if self.is_cover:
            Work.objects.filter(campaign=self.campaign, is_cover=True).update(is_cover=False)
        super().save(*args, **kwargs)