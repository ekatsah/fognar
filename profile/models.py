# Copyright 2012, Cercle Informatique. All rights reserved.

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.db import models
from utils import dont_create_a_superuser
from json import loads


class Profile(models.Model):
    user = models.OneToOneField(User)
    name = models.CharField(max_length=80)
    email = models.CharField(max_length=250)
    registration = models.CharField(max_length=80)
    welcome = models.BooleanField(default=True)
    comment = models.TextField(null=True)
    photo = models.CharField(max_length=80, null=True)
    autostart = models.TextField(default="{sidebar: {}, navbar: {},}")

    def get_courses(self):
        from course.models import Course
        config = loads(self.desktop_config)
        return [ Course.objects.get(pk=s['id'])
                 for s in config['shortcuts']
                 if s['app'] == 'course' ]


class Inscription(models.Model):
    user = models.ForeignKey(Profile)
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
