// Copyright 2012, Cercle Informatique. All rights reserved.

applications.wikicourse = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.infos = new Backbone.Model();
        this.infos.url = urls['wiki_bone_id'](this.context.get('infos'));
        this.infos.parse = function(d) {
            d.infos = eval('(' + d.infos + ')');
            return d;
        };
        this.infos.on("change", this.render);
        this.infos.fetch();
        this.render();
    },

    events: {},

    render: function() {
        $(this.el).html(templates['tpl-course-wiki']({
            infos: this.infos.toJSON(),
            context: this.context.toJSON(),
        }));
        return this;
    },

    close: function() {},
});
