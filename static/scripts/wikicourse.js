// Copyright 2012, Cercle Informatique. All rights reserved.

applications.wikicourse = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.infos = new Backbone.Model();
        this.infos.url = urls['wiki_bone_id'](this.context.get('id'));
        this.infos.on("all", this.render);
        this.infos.fetch();
        this.render();
    },

    events: {},

    render: function() {
        console.log("wikicourse render");
        $(this.el).html(templates['tpl-course-wiki']({
            infos: this.infos.toJSON(),
            context: this.context.toJSON(),
        }));
        return this;
    },

    close: function() {},
});
