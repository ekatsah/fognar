from django.db import models

from profile.models import Profile

class Shortcut(models.Model):
    user = models.ForeignKey(Profile)
    app = models.CharField(max_length=255)
    app_id = models.PositiveIntegerField()
    position = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'position')
        ordering = ['position']
