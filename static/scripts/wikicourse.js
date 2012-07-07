// Copyright 2012, Cercle Informatique. All rights reserved.

applications.wikicourse = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.infos = new Backbone.Model();
        this.infos.url = urls['document_bone_type_slug'](this.type, this.context.id);
        this.documents.on("all", this.render);
        this.documents.fetch();
        cache.users.on("fetched", this.render);
        this.render();
    },

    events: {
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
        $(this.el).html(templates['tpl-document']({documents: this.documents.toJSON(),
                                                   type: this.type,
                                                   context: this.context.toJSON(),
                                                   token: get_cookie('csrftoken')}));
        return this;
    },

    close: function() {
        cache.users.off("fetched", this.render);
    },
});
