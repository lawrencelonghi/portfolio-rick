from django.db import models
import os

class Work(models.Model):
    title = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='works/') 

    def __str__(self):
        return self.title or "Untitled"
    

    #deleta as imagens do banco de dados e da pasta media tambem
    def delete(self, *args, **kwargs):
        
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        
        super().delete(*args, **kwargs)
