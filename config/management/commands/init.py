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
        password = getpass("Password: ")
        if not password:
            raise CommandError("You must provide a password")
        user.set_password(password)
        user.save()

        AppUsing.objects.create(user=user, name="profile")
