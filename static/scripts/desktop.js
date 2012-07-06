// Copyright 2012, RespLab. All rights reserved.

applications.course = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.slug = params.slug;
        this.router = params.router;
        $(this.el).html(templates['tpl-desk-course']());
        $(this.el).addClass('course_popup');
        $('#desktop').append(this.el);
        console.log('left: ' + params.position.left + ' && width : ' + $(this.el).width())
        this.x = Math.max(5, params.position.left - $(this.el).width() / 2);
        this.y = params.position.top + 40;
        $(this.el).css('margin-left', this.x + 'px');
        $(this.el).css('margin-top', this.y + 'px');        
    },

    events: {
        'click #document': function() {
            this.router.navigate('/document/course/' + this.slug, 
                                 {trigger: true});
            return false;
        }
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
        this.render();
        console.log('Initialize desktop');
    },

    events: {
        'click #market': function() {
            this.router.navigate('/market', {trigger: true});
            return false;
        },
        'click .shortcut': function(e) {
            
            if (this.popup) {
                $(this.popup.el).remove();
                delete this.popup;
            }
            var app = e.target.getAttribute('data-type');
            if (app == "course")
                this.popup = new applications.course({
                    slug: e.target.getAttribute('data-target'),
                    position: $(e.target).position(),
                    router: this.router,
                });
            return false;
        },
    },

    render: function() {
        if (this.me.get('realname')) {
            $(this.el).html(templates['tpl-desktop']({profil: this.me.toJSON(), 
                shortcuts: this.config.shortcuts}));
            }
        else
            $(this.el).html(templates['tpl-loading']());
        return this;
    },
    
    unbind : function() {
        this.me.off();
    }
});
