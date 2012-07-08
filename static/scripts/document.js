// Copyright 2012, Cercle Informatique. All rights reserved.

models.document = Backbone.Model.extend({urlRoot: '/document'});

Handlebars.registerHelper('uploader_name', function(uploader, options){
    if (uploader==undefined)
        return;
    if (cache.users.get(uploader) == undefined){
        cache.users.add({id: uploader});
        cache.users.get(uploader).fetch({success: function() {
            cache.users.trigger('fetched');
        }});
    }
    return cache.users.get(uploader).get('name');
});

applications.document = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.documents = new Backbone.Collection();
        this.documents.url = urls['document_bone_type_slug'](this.type, this.context.id);
        this.documents.on("all", this.render);
        this.documents.fetch();
        cache.users.on("fetched", this.render);
        this.render();
    },

    events: {
        'click #upload': function() {
            sidebar.render(templates['tpl-document-upload']({
                type: this.type,
                context: this.context.toJSON(),
                token: get_cookie('csrftoken'),
            }));
            sidebar.toggle();
            return false;
        },
        'click #upload_form_submit': function() {
            var self = this;
            $('#upload_form').attr('action', urls['document_upload_file']);
            $('#upload_frame').load(function() {
                self.documents.fetch();
                $('up_message').html('upload fini');
            })
            $('up_message').html('upload...');
            $('#upload_form').submit();
            return false;
        },

        'submit #upload_http_form': function() {
            var self = this;
            // use ajax because $.post didn't seem to work
            $.ajax({
                type: 'POST',
                url: urls['document_upload_http'],
                data: $('#upload_http_form').serialize(),
                success: function(d) {
                    self.documents.fetch();
                },
                dataType: 'json',
            });
            return false;
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
});
