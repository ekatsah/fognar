from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from application.models import AppUsing
from getpass import getpass, getuser
from category.models import Category, CategoryItem
from group.models import Group
from course.models import Course
from document.models import Document

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
        firstname = raw_input("Firstname (default: John): ")
        if not firstname:
            firstname = "John"
        lastname = raw_input("Lastname (default: Smith): ")
        if not lastname:
            lastname = "Smith"
        user.firstname = firstname
        user.lastname = lastname
        user.set_password(password)
        user.save()

        AppUsing.objects.create(user=user, name="desktop", config=""" {
            shortcuts: [ 
                {app: 'course', slug: 'info-f-666'},
                {app: 'course', slug: 'info-f-777'},
                {app: 'course', slug: 'info-f-888'},
                {app: 'course', slug: 'info-f-999'},
                {app: 'group', slug: 'ACE'},
                {app: 'group', slug: 'CI'},
                
            ],
        }""")

        c1 = Course.objects.create(slug='info-f-666', name='Hell Informatique',
                                   description='Hell Computer Science course')
        c2 = Course.objects.create(slug='info-f-777', name='Over Math',
                                   description='New math course based on fuzzy axiomes')
        c3 = Course.objects.create(slug='info-f-888', name='AlgoSimplex',
                                   description='Les simplex dans tout leurs etats')
        c4 = Course.objects.create(slug='info-f-999', name='Support Vector Machines',
                                   description='Neural Networks are outdated, use SVM!')

        g1 = Group.objects.create(slug='CI', name='Cercle Informatique',
                                  description='Cercle des etudiants en info \o/')
        g2 = Group.objects.create(slug='ACE', name='Association des Cercles Etudiants',
                                  description='Youplaboom')

        cat0 = Category.objects.create(name='Faculty', description='Root node w/ category')
        cat1 = Category.objects.create(name='Sciences', description='Fac de sciences')
        cat2 = Category.objects.create(name='Polytech', description='Polytech')
        cat3 = Category.objects.create(name='Informatique', description='Section INFO')

        cat0.holds.add(cat1)
        cat0.holds.add(cat2)
        cat1.holds.add(cat3)

        CategoryItem.objects.create(category=cat3, thing=c1, priority=1)
        CategoryItem.objects.create(category=cat3, thing=c2, priority=2)
        CategoryItem.objects.create(category=cat3, thing=c4, priority=3)
        CategoryItem.objects.create(category=cat3, thing=g1, priority=3)
        CategoryItem.objects.create(category=cat0, thing=g2, priority=1)
        CategoryItem.objects.create(category=cat2, thing=c3, priority=1)

        Document.objects.create(name='US missile launch code', uploader_id= 1, description='Launch code for the us military nuclear missiles.', refer_oid = 1, refer_content_id = 1)
        Document.objects.create(name='List of CIA spy', uploader_id = 1, description='This is the complete list of all CIA spy.', refer_oid = 1, refer_content_id = 1)

