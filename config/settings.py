# Copyright 2012, Cercle Informatique. All rights reserved.

# settiiiingz \o/ The competent programmer is fully aware of the strictly
# limited size of his own skull; therefore he approaches the programming task
# in full humility, and among other things he avoids clever tricks like the
# plague. -- Edsger W. Dijkstra

from os import path
from re import sub

# Absolute path to the directory that hold the manage.py file
PROJECT_PATH = sub('/config$', '', path.abspath(path.split(__file__)[0]))

DEBUG = True
TEMPLATE_DEBUG = DEBUG
ADMINS = (('NullCorp', 'null@null.com'),)
MANAGERS = ADMINS

# File containing the handlebars templates
OBJECT_FILE = '%s/templates/objects.html' % PROJECT_PATH

# User Profile Model
AUTH_PROFILE_MODULE = 'profile.Profile'

# Page to show after a syslogin
LOGIN_REDIRECT_URL = '/zoidberg#desktop'

# url to internal login
LOGIN_URL = '/syslogin'

# hack for nginx
FORCE_SCRIPT_NAME = ''

# Upload settings
UPLOAD_LOG = '/tmp/upload_log'
UPLOAD_DIR = '%s/document/r' % PROJECT_PATH
PARSING_WORKERS = 7

# ULB login, need to add the url to redirect at the end
ULB_LOGIN = 'https://www.ulb.ac.be/commons/intranet?_prt=ulb:facultes:sciences:p402&_ssl=on&_prtm=redirect&_appl='

# ULB authentificator, need 2 parameters : SID and UID
ULB_AUTH = 'http://www.ulb.ac.be/commons/check?_type=normal&_sid=%s&_uid=%s'

TIME_ZONE = 'Europe/Paris'
LANGUAGE_CODE = 'en-us'
SITE_ID = 1
USE_I18N = True

ugettext = lambda s: s

LANGUAGES = (
  ('fr', ugettext('French')),
  ('en', ugettext('English')),
)

USE_L10N = True

ROOT_URLCONF = 'config.urls'
STATIC_ROOT = ''
STATIC_URL = '/static/'
STATICFILES_DIRS = ('%s/static/' % PROJECT_PATH,)
ALLOWED_INCLUDE_ROOTS = ('%s/templates' % PROJECT_PATH,)
TEMPLATE_DIRS = ( '%s/templates' % PROJECT_PATH,)

FRAGMENTS_DIR = path.join(PROJECT_PATH, "fragments")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sql',
        'USER': '', # Not used with sqlite3.
        'PASSWORD': '', # Not used with sqlite3.
        'HOST': '', # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '', # Set to empty string for default. Not used with sqlite3.
    }
}

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.markup',
    'south',
    'djangbone',
    'category',
    'course',
    'document',
    'group',
    'message',
    'profile',
    'config',
    'django_extensions',
    'fragments',
)

SECRET_KEY = 'v_g654gxfo#38*ju5*@bqbxg60a95dw*vpc+t&^(q*tjzazx1%'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.i18n',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

try:
    from production import *
except ImportError:
    pass

try:
    from version import VERSION
except ImportError:
    VERSION = "dev"
