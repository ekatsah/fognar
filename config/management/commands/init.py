from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from application.models import AppUsing
from getpass import getpass, getuser


class Command(BaseCommand):
    help = 'Initialize fognar for developpment'

    def handle(self, *args, **options):
        self.stdout.write('Creating user\n')
        user = User()
        username = raw_input("Username (default: %s): " % getuser())
        if not username:
            username = getuser()
        user.username = username
        password = getpass("Password (default: 'test'): ")
        if not password:
            password = 'test'
        user.set_password(password)
        user.first_name = "John"
        user.last_name = "Smith"
        user.save()

        AppUsing.objects.create(user=user, name="profile")
