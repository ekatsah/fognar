# Copyright 2012, RespLab. All rights reserved.

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.db import models
from utils import dont_create_a_superuser


class Profile(models.Model):
    user = models.OneToOneField(User)
    registration = models.CharField(max_length=80)
    welcome = models.BooleanField(default=True)
    comment = models.TextField(null=True)
    photo = models.CharField(max_length=80, null=True)

    def real_name(self):
        return self.user.first_name + " " + self.user.last_name


class Inscription(models.Model):
    user = models.ForeignKey(User)
    section = models.CharField(max_length=80, null=True)
    year = models.PositiveIntegerField(null=True)

    class Meta:
        unique_together = ('user', 'section', 'year')


# for all user creation, create profile with default value
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, registration=0)


post_save.connect(create_user_profile, sender=User)
dont_create_a_superuser()
