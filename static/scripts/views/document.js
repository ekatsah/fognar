// Copyright 2012, Cercle Informatique. All rights reserved.

Handlebars.registerHelper('stars', function(context, options) {
    var star = Math.round(context.rating_average);
    var ret = '<span class="rating">';
    for (var i=0; i<star; i++)
        ret = ret+'<i class="star-icon"></i>';
    for (var i=star; i<5; i++)
        ret = ret+'<i class="star-icon-gray"></i>';
    return ret+' '+context.rating_number+'</span>';
});

Handlebars.registerHelper('date', function(date, options) {
    var d = new Date(date);
    var ellapsed = new Date().getTime()-d.getTime();
    if(ellapsed<60000)
        return 'il y a '+Math.round(ellapsed/1000)+' secondes';
    else if(ellapsed<3600000)
        return 'il y a '+Math.round(ellapsed/60000)+' minutes';
    return 'le '+d;
});

applications.document = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.upload = false;
        this.upload_file = true;
        this.upload_description = "Description du document";
        this.referer_id = params.referer_id;
        this.referer_content = params.referer_content;
        this.documents = new Backbone.Collection();
        this.documents.url = '/rest/refered/Document/' + this.referer_content + '/' + this.referer_id;
        this.documents.on("all", this.render);
        this.documents.fetch();
        cache.user.bind("change add", this.render);
        this.sort_by = "name";
        this.documents.comparator = this.sort[this.sort_by];
        this.render();
    },

    events: {
        'click #upload': function() {
            this.upload = true;
            this.render();
            return false;
        },

        'click #upload-http': function() {
            this.upload_file = false;
            this.render();
            return false;
        },
        
        'click #upload-file': function() {
            this.upload_file = true;
            this.render();
            return false;
        },

        'click #upload-close': function() {
            this.upload = false;
            this.render();
            return false;
        },

        'click #upload_form_submit': function() {
            var self = this.calling;
            $('#upload_form').attr('action', urls['document_upload_file']);
            $('#upload_frame').load(function() {
                $('#upload_frame').unbind('load');
                var raw = $('pre', frames['upload_frame'].document).html();
                var message = eval('(' + raw + ')').message;
                if (message != 'ok')
                    $('#upload_message').html(message);
                else {
                    $('#upload_message').html('Transfert OK, will process later');
                    self.documents.fetch();
                }
            })
            $('#up_message').html('Upload..');
            $('#upload_form').submit();
            return false;
        },

        'submit #upload_http_form': function() {
            var self = this.calling;
            // use ajax because $.post didn't seem to work
            $.ajax({
                type: 'POST',
                url: urls['document_upload_http'],
                data: $('#upload_http_form').serialize(),
                success: function(d) {
                    var message = eval(d).message;
                    if (message != 'ok')
                        $('#upload_message').html(message);
                    else {
                        $('#upload_message').html('Transfert OK, will process later');
                        self.documents.fetch();
                    }
                },
                dataType: 'json',
            });
            $('#up_message').html('Upload..');
            return false;
        },

        'change #sort-by': function() {
            this.sort_by = $('#sort-by').val();
            this.documents.comparator = this.sort[this.sort_by];
            this.documents.sort();
        },
    },

    render: function() {
        $(this.el).html(templates['document-list']({
            documents: this.documents.toJSON(),
            upload: this.upload,
            upload_file: this.upload_file,
            upload_description: this.upload_description,
        }));
        $('#sort-by').val(this.sort_by);
        return this;
    },

    close: function() {
        cache.users.off("change add", this.render);
    },

    sort: {

        name: function(a,b) {
            if (a.get("name")>b.get("name"))
                return 1;
            else
                return -1;
        },

        uploader: function(a,b) {
            if(cache.users.get_or_fetch(a.get('uploader'))
                >cache.users.get_or_fetch(b.get('uploader')))
                return 1;
            else
                return -1;
        },

        rating: function(a,b) {
            if(a.get('rating_average')>b.get('rating_average'))
                return -1;
            else
                return 1;
        },

        statistical_rating: function(a,b) {
            if (a.get('rating_lower_bound')>b.get('rating_lower_bound'))
                return -1;
            else
                return 1;
        },

        popularity: function(a,b) {
            if(a.get('view_number')+a.get('download_number')>b.get('view_number')+b.get('download_number'))
                return -1;
            else
                return 1;
        },

        date: function(a,b) {
            if (a.get('date')>b.get('date'))
                return 1;
            else
                return -1;
        },

    },
});
