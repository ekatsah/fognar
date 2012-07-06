// Copyright 2012, Cercle Informatique. All rights reserved.

applications.course = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.slug = params.slug;
        this.router = params.router;
        this.position = params.position;
        this.render();
    },

    events: {
        'click #document': function() {
            this.router.navigate('/document/course/' + this.slug, 
                                 {trigger: true});
            return false;
        },
    },
    
    render: function() {
        $(this.el).html(templates['tpl-desk-course']());
        $(this.el).css('display', 'block');
        this.x = Math.max(5, this.position.left - $(this.el).width() / 2);
        this.y = this.position.top + 40;
        $(this.el).css('margin-left', this.x + 'px');
        $(this.el).css('margin-top', this.y + 'px');
    },
});

applications.desktop = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.router = params.router;
        this.me = new Backbone.Model();
        this.me.url = urls.profile_me;
        this.me.on("change", this.render);
        this.me.fetch();
        this.config = params.config;
        this.popup = null;
        this.render();
        console.log('Initialize desktop');
    },

    events: {
        'click #market': function() {
            this.router.navigate('/market', {trigger: true});
            return false;
        },
        'click .shortcut': function(e) {
            var app = e.target.getAttribute('data-type');
            if (app == "course") {
                var div = document.createElement('div');
                this.popup = new applications.course({
                    slug: e.target.getAttribute('data-target'),
                    position: $(e.target).position(),
                    router: this.router,
                    el: $('#course_popup'),
                });
            }
            return false;
        },
    },

    render: function() {
        if (this.me.get('realname')) {
            $(this.el).html(templates['tpl-desktop']({profil: this.me.toJSON(), 
                shortcuts: this.config.shortcuts}));
            $('#course_popup').css('display', 'none');
        } else
            $(this.el).html(templates['tpl-loading']());
        return this;
    },
});
