from django.db import models
import os

class Work(models.Model):
    title = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to='works/', blank=True, null=True)
    def __str__(self):
        return self.title or "Untitled"

    def delete(self, *args, **kwargs):
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)