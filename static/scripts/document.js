applications.document = Backbone.View.extend({
    initialize: function(params) {
        console.log("params : " + dump(params));
        _.bindAll(this, 'render');
        this.documents = new Backbone.Collection();
        this.documents.url = urls.document_all;
        this.documents.on("change", this.render);
        this.documents.fetch();
        this.render();
    },

    events: {},
    
    render: function() {
        console.log("document render");
        $(this.el).html(templates['tpl-document']({documents: this.documents.toJSON()}));
        return this;
    },
});