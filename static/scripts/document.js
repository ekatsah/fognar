applications.document = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.documents = new Backbone.Collection();
        this.documents.url = urls.document_all;
        this.documents.on("change", this.render);
        this.documents.fetch();
        setTimeout(this.render, 1000);
    },

    events: {},
    
    render: function() {
        console.log("document render");
        $(this.el).html(templates['tpl-document']({documents: this.documents.toJSON()}));
        return this;
    },
});