from django.db import models

# Create your models here

class Work(models.Model):
    title = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='works/')  # this saves to MEDIA_ROOT/works/

    def __str__(self):
        return self.title or "Untitled"