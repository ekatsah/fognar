// Copyright 2012, Cercle Informatique. All rights reserved.

models.document = Backbone.Model.extend({urlRoot: '/document'});

Handlebars.registerHelper('uploader_name', function(uploader, options) {
    if (typeof uploader == 'undefined')
        return;
    return cache.users.get_or_fetch(uploader).get('name');
});

applications.document = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.documents = new Backbone.Collection();
        this.documents.url = urls['document_bone_type_slug'](this.type, this.context.get('slug'));
        this.documents.on("all", this.render);
        this.documents.fetch();
        cache.users.on("fetched", this.render);
        this.render();
    },

    events: {
        'click #upload': function() {
            sidebar.render(templates['tpl-document-upload']({
                type: this.type,
                context: this.context.get('slug'),
                token: get_cookie('csrftoken'),
            }));
            sidebar.show(this);
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
            this.documents.comparator = this.sort[$('#sort-by').val()];
            this.documents.sort();
        },
    },

    render: function() {
        console.log("document render");
        $(this.el).html(templates['tpl-course-document']({
            documents: this.documents.toJSON(),
        }));
        return this;
    },

    close: function() {
        cache.users.off("fetched", this.render);
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
            if(a.get('rating')>b.get('rating'))
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
        
        },
    },
});
