// Copyright 2012, RespLab. All rights reserved.

applications.document = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.args[1];
        this.context = params.args[2];
        this.documents = new Backbone.Collection();
        this.documents.url = urls.document_d;
        this.documents.on("all", this.render);
        this.documents.fetch();
        this.render();
    },

    events: {
        'submit #upload_form': function() {
            return false;
        },
        
        'submit #upload_http_form': function() {
            var self = this;
            console.log('post..');
            $.post(urls['document_upload_http'],
                $('#upload_http_form').serialize(),
                function(d) {
                    alert('success!, resp = ' + d); 
                });
            return false;
        },
    },
    
    render: function() {
        console.log("document render");
        $(this.el).html(templates['tpl-document']({documents: this.documents.toJSON(),
                                                   type: this.type,
                                                   context: this.context}));
        return this;
    },
    
    unbind : function() {
        this.document.off();
    }
});
