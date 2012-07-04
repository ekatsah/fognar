# Copyright 2012, RespLab. All rights reserved.

# export DJANGO_SETTINGS_MODULE='settings'
# export PYTHONPATH=$PYTHONPATH:.
# python documents/processing_deamon.py

from sys import exit
from time import sleep
from signal import signal, SIGTERM
from os import system, path, makedirs
from config.settings import UPLOAD_DIR, UPLOAD_LOG, PARSING_WORKERS
from multiprocessing import Process
from django.db import close_connection
from pyPdf import PdfFileReader
from urllib2 import urlopen
from document.models import PendingDocument as Task

import logging
logger = logging.getLogger('das_logger')
hdlr = logging.FileHandler(UPLOAD_LOG)
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.INFO)


def convert_page(doc, page, filename, num):
    # extract a normal size page and a thumbnail with graphicsmagick
    pname = "%s/%s/%04d_%04d.jpg" % (UPLOAD_DIR, doc.refer.slug, doc.pk, num)
    mname = "%s/%s/%04d_%04d_m.jpg" % (UPLOAD_DIR, doc.refer.slug, doc.pk, num)
    w, h = page.bleedBox.getWidth(), page.bleedBox.getHeight()

    system('gm convert -resize %dx%d -quality 90 %s "%s[%d]" %s' %
           (w, h, ' -density 350', filename, num, pname))
    system('gm convert -resize 118x1000 %s "%s[%d]" %s' % 
           ('-quality 90 -density 100', filename, num, mname))
    doc.add_page(num + 1, pname, mname, w, h)

def parse_file(doc, upfile):
    logger.info('Starting processing of doc %d (from %s) : %s' % 
                (doc.id, doc.owner.username, doc.name))
    filename = "%s/%s/%04d.pdf" % (UPLOAD_DIR, doc.refer.slug, doc.id)

    # check if course subdirectory exist
    if not path.exists(UPLOAD_DIR + '/' + doc.refer.slug):
        makedirs(UPLOAD_DIR + '/' + doc.refer.slug)

    # original file saving
    fd = open(filename, 'w')
    fd.write(upfile.read())
    fd.close()

    # sauvegarde du nombre de page
    pdf = PdfFileReader(file(filename, 'r'))
    doc.set_npages(pdf.numPages)

    # activate the search system
    system("pdftotext " + filename)
    words = open("%s/%s/%04d.txt" % (UPLOAD_DIR, doc.refer.slug, doc.id), 'r')
    words.close()

    # iteration page a page, transform en png + get page size
    for num, page in zip(xrange(pdf.numPages), pdf.pages):
        convert_page(doc, page, filename, num)

    logger.info('End of processing of doc %d' % doc.id)

def download_file(doc, url):
    logger.info('Starting download of doc %d : %s' % (doc.id, url))
    return urlopen(url)

def process_file(pending_id):
    close_connection()
    pending = Task.objects.get(pk=pending_id)
    try:
        pending.state = 'download'
        pending.save()
        raw = download_file(pending.doc, pending.url)
        pending.state = 'process'
        pending.save()
        parse_file(pending.doc, raw)
        pending.state = 'done'
        pending.save()

        # may fail if download url, don't really care
        system("rm /tmp/TMP402_%d.pdf" % pending.doc.id)

    except Exception as e:
        logger.error('Process file error of doc %d (from %s) : %s' % 
                     (pending.doc.id, pending.doc.owner.username, str(e)))
        pending.doc.delete()

# drop here when the deamon is killed
def terminate(a, b):
    close_connection()
    for worker, pending in workers:
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

if __name__ == "__main__":
    workers = list()

    signal(SIGTERM, terminate)

    while True:
        sleep(10)
        close_connection()
        workers = [ (w,p) for w, p in workers if w.is_alive() ]
        # Avoid useless SQL queries
        if len(workers) >= PARSING_WORKERS:
            continue
        
        # Pool seem less flexible
        pendings = list(Task.objects.filter(state='queued').order_by('id'))
        while len(workers) < PARSING_WORKERS and len(pendings) > 0:
            pending = pendings.pop(0)
            process = Process(target=process_file, args=(pending.id,))
            process.start()
            workers.append((process, pending))
