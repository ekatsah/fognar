# FOGNAR IS UPON US

1. Introduction
===============

This project aim to create a new, universal student platform for the ULB. It is lead by the collaboration of respublicae and UrLab, the ULB hackerspace.
It is build using Django 1.4 and a series of javascript library : jquery, backbone.js, underscore.js and handlebars.js. Fognar is only a preliminary milestone name.

2. Installation
===============

1. Fork the main repository (hosted by AlterSid) on github

2. Clone your fork of the project on your local computer/laptop/smartphone/toaster using :

    git clone git@github.com:your_username/fognar.git

3. Install django **1.4** (**we insist on the 1.4**) and djano south, enventually in a virtual environment :

    sudo pip install django south

4. Move in the project directory and synchronize the db :

    cd fognar
    python manage.py syncdb

5. Install a new user (because the netid system probably won't work) :

    python manage.py shell
    from application.models import User
    user = User()
    user.username = "your_username"
    user.set_password("your_password")
    user.save()

6. Launch the server using :

    python manage.py runserver

7. Go to (http://localhost:8000/syslogin) and login !


