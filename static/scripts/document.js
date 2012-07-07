// Copyright 2012, Cercle Informatique. All rights reserved.

applications.document = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.args[1];
        this.context = params.args[2];
        this.documents = new Backbone.Collection();
        this.documents.url = '/document/'+this.type+'/'+this.context;
        this.documents.on("all", this.render);
        this.documents.fetch();
        this.render();
    },

    events: {
        'click #upload_form_submit': function() {
            $('#upload_form').attr('action', urls['document_upload_file']);
            $('#upload_frame').load(function() {
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
                                                   context: this.context,
                                                   token: get_cookie('csrftoken')}));
        return this;
    },

});
