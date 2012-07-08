// Copyright 2012, Cercle Informatique. All rights reserved.

models.document_details = Backbone.Model.extend({
    initialize: function() {},
    urlRoot: urls['document_bone_id'](''),
});

applications.viewer = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.id = params.args[1];
        this.doc = new models.document_details({id: this.id});
        this.doc.on('change', this.render);
        this.doc.fetch();
        this.pages = new Backbone.Collection();
        this.pages.url = urls['document_page'](this.id);
        this.pages.on('all', this.render);
        this.pages.fetch();
        this.render();
    },

    events: {},

    render: function() {
        if (this.doc.has('name') && this.pages.length > 0)
            $(this.el).html(templates['tpl-doc-viewer']({doc: this.doc.toJSON(),
                    pages: this.pages.toJSON()}));
        else
            $(this.el).html(templates['tpl-loading']({}));
        return this;
    },

    close: function() {},
});
