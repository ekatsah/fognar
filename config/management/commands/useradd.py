# Copyright 2012, Cercle Informatique. All rights reserved.

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from getpass import getpass, getuser
from optparse import make_option
from objects.models import Course, Shortcut, Group


class Command(BaseCommand):
    help = 'Initialize fognar for developpment'
    option_list = BaseCommand.option_list + (
        make_option('--username', action='store', dest='username', default=None, help='default username'),
        make_option('--password', action='store', dest='password', default=None, help='default password'),
        make_option('--first-name', action='store', dest='first_name', default=None, help='default first name'),
        make_option('--last-name', action='store', dest='last_name', default=None, help='default last name'),
        )

    def handle(self, *args, **options):
        self.stdout.write('Creating user\n')
        user = User()
        username = raw_input("Username (default: %s): " % getuser()) if options["username"] is None else options["username"]
        if not username:
            username = getuser()
        user.username = username
        password = getpass("Password (default: 'test'): ") if options["password"] is None else options["password"]
        if not password:
            password = 'test'
        first_name = raw_input("Firstname (default: John): ") if options["first_name"] is None else options["first_name"]
        if not first_name:
            first_name = "John"
        last_name = raw_input("Lastname (default: Smith): ") if options["last_name"] is None else options["last_name"]
        if not last_name:
            last_name = "Smith"
        user.first_name = first_name
        user.last_name = last_name
        user.set_password(password)
        user.save()
        profile = user.get_profile()
        profile.name = first_name + " " + last_name
        profile.email = '42@urlab.be'
        profile.save()

        c = Course.objects.all()
        g = Group.objects.all()

        Shortcut.objects.create(user=profile, position=1, app="course", app_id=c[0].id)
        Shortcut.objects.create(user=profile, position=2, app="group", app_id=g[0].id)
        Shortcut.objects.create(user=profile, position=3, app="course", app_id=c[1].id)
        Shortcut.objects.create(user=profile, position=4, app="course", app_id=c[2].id)
        Shortcut.objects.create(user=profile, position=5, app="group", app_id=g[1].id)
