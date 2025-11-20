from django.db import models
import os

class Work(models.Model):
    title = models.CharField(max_length=100, blank=True)
    campaign = models.CharField(max_length=100, help_text="Nome da campanha para agrupar imagens")
    file = models.FileField(upload_to='works/', blank=True, null=True)
    order = models.IntegerField(default=0, help_text="Ordem de exibição (menor aparece primeiro)")
    is_cover = models.BooleanField(default=False, help_text="Imagem de capa da campanha (aparece na home)")
    
    class Meta:
        ordering = ['campaign', 'order']
    
    def __str__(self):
        cover_indicator = " [CAPA]" if self.is_cover else ""
        return f"{self.campaign} - {self.title or 'Untitled'}{cover_indicator}"

    def delete(self, *args, **kwargs):
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)