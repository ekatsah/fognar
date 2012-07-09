# Copyright 2012, Cercle Informatique. All rights reserved.

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from application.models import AppUsing
from getpass import getpass, getuser
from category.models import Category, CategoryItem
from group.models import Group
from course.models import Course, CourseInfo
from optparse import make_option
from django.utils.datetime_safe import datetime

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
        profile.save()
        
        AppUsing.objects.create(user=profile, name="desktop", config=""" {
            shortcuts: [ 
                {app: 'course', slug: 'info-f-666'},
                {app: 'course', slug: 'info-f-777'},
                {app: 'course', slug: 'info-f-888'},
                {app: 'course', slug: 'info-f-999'},
                {app: 'group', slug: 'ACE'},
                {app: 'group', slug: 'CI'},
            ],
        }""")

        self.stdout.write('Adding base data ...\n')
        c1 = Course.objects.create(slug='info-f-666', name='Hell Informatique',
                                   description='Hell Computer Science course')
        c2 = Course.objects.create(slug='info-f-777', name='Over Math',
                                   description='New math course based on fuzzy axiomes')
        c3 = Course.objects.create(slug='info-f-888', name='AlgoSimplex',
                                   description='Les simplex dans tout leurs etats')
        c4 = Course.objects.create(slug='info-f-999', name='Support Vector Machines',
                                   description='Neural Networks are outdated, use SVM!')
        
        CourseInfo.objects.create(course=c1, user = profile,infos = """[
            {    name: "general", values: [
                                        {name: 'Professeur', values:'B. Lecharlier'},
                                        {name: 'Langue', values:'Francais'},
                                        {name: 'Syllabus', values:'Informatique Ba1'},
                                        {name: 'ECTS', values:'5'},
                                    ],
            },
        ]""")
        
        CourseInfo.objects.create(course=c1, user = profile,infos = """[
            {    name: "general", values: [
                                        {name: 'Professeur', values:'B. Lecharlier'},
                                        {name: 'Langue', values:'Francais'},
                                        {name: 'Syllabus', values:'Informatique Ba1'},
                                        {name: 'ECTS', values:'5'},
                                    ],
            },
            {    name: "exam", values: [
                                      {name: 'Difficultes', values:'Language noyaux'},
                                     ],
            },
        ]""")     
        
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
