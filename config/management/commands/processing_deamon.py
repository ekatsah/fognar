# Copyright 2012, RespLab. All rights reserved.

from sys import exit
from time import sleep
from signal import signal, SIGTERM
from django.core.management.base import BaseCommand
from config.settings import UPLOAD_DIR, UPLOAD_LOG, PARSING_WORKERS
from document.models import Page, PendingDocument as Task
from django.db import close_connection
from os import system, path, makedirs
from multiprocessing import Process
from pyPdf import PdfFileReader
from urllib2 import urlopen

# TODO : rtfm django logging
import logging
logger = logging.getLogger('das_logger')
hdlr = logging.FileHandler(UPLOAD_LOG)
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.INFO)

class Command(BaseCommand):
    help = 'Start tha processing deamon'

    def convert_page(self, doc, page, filename, num):
        # extract a normal size page and a thumbnail with graphicsmagick
        pname = "%s/%s/%04d_%04d.jpg" % (UPLOAD_DIR, doc.referer.slug, doc.pk, num)
        mname = "%s/%s/%04d_%04d_m.jpg" % (UPLOAD_DIR, doc.referer.slug, doc.pk, num)
        w, h = page.bleedBox.getWidth(), page.bleedBox.getHeight()
        system('gm convert -resize %dx%d -quality 90 %s "%s[%d]" %s' %
               (w, h, ' -density 350', filename, num, pname))
        system('gm convert -resize 118x1000 %s "%s[%d]" %s' % 
               ('-quality 90 -density 100', filename, num, mname))
        print "create page => " + str(num)
        Page.objects.create(num=num + 1, width=w, height=h, doc=doc)

    def parse_file(self, doc, upfile):
        logger.info('Starting processing of doc %d (from %s) : %s' % 
                    (doc.id, doc.uploader.username, doc.name))
        filename = "%s/%s/%04d.pdf" % (UPLOAD_DIR, doc.referer.slug, doc.id)
    
        print "fname : " + filename
        # check if course subdirectory exist
        if not path.exists(UPLOAD_DIR + '/' + doc.referer.slug):
            print "need to subdir"
            makedirs(UPLOAD_DIR + '/' + doc.referer.slug)

        print "parsing step1"
        # original file saving
        fd = open(filename, 'w')
        fd.write(upfile.read())
        fd.close()
    
        print "parsing step2"
        # sauvegarde du nombre de page
        pdf = PdfFileReader(file(filename, 'r'))
        doc.pages = pdf.numPages
        doc.save()

        # activate the search system
        # system("pdftotext " + filename)
        # words = open("%s/%s/%04d.txt" % (UPLOAD_DIR, doc.referer.slug, doc.id), 'r')
        # words.close()
    
        # iteration page a page, transform en png + get page size
        for num, page in zip(xrange(pdf.numPages), pdf.pages):
            self.convert_page(doc, page, filename, num)
    
        logger.info('End of processing of doc %d' % doc.id)
    
    def download_file(self, doc, url):
        logger.info('Starting download of doc %d : %s' % (doc.id, url))
        return urlopen(url)
    
    def process_file(self, pending_id):
        close_connection()
        pending = Task.objects.get(pk=pending_id)
        try:
            pending.state = 'download'
            pending.save()
            raw = self.download_file(pending.doc, pending.url)
            pending.state = 'process'
            print "process file state ->"
            pending.save()
            self.parse_file(pending.doc, raw)
            pending.state = 'done'
            pending.save()
    
            # may fail if download url, don't really care
            system("rm /tmp/TMP402_%d.pdf" % pending.doc.id)
    
        except Exception as e:
            logger.error('Process file error of doc %d (from %s) : %s' % 
                         (pending.doc.id, pending.doc.uploader.username, str(e)))
            pending.doc.delete()

    # drop here when the deamon is killed
    def terminate(self, a, b):
        close_connection()
        for worker, pending in self.workers:
            try:
                worker.terminate()
                pending.doc.done = 0
                pending.doc.save()
                pending.state = 'queued'
                pending.save()
            # fail quietly, not a good idea, but hey, we've got already been kill,
            # so what the hell?
            except:
                pass
        exit(0)

    def handle(self, *args, **options):
        self.workers = list()
    
        signal(SIGTERM, self.terminate)
    
        while True:
            sleep(10)
            close_connection()
            self.workers = [ (w,p) for w, p in self.workers if w.is_alive() ]
            # Avoid useless SQL queries
            if len(self.workers) >= PARSING_WORKERS:
                continue
            
            # Pool seem less flexible
            pendings = list(Task.objects.filter(state='queued').order_by('id'))
            while len(self.workers) < PARSING_WORKERS and len(pendings) > 0:
                pending = pendings.pop(0)
                print "start process " + str(pending.id)
                process = Process(target=self.process_file, args=(pending.id,))
                process.start()
                self.workers.append((process, pending))
