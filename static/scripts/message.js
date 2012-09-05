// Copyright 2012, Cercle Informatique. All rights reserved.

models.thread = Backbone.Model.extend({
    initialize: function(params) {
//        this.type = params.type;
//        this.context = params.context;
    },

    url: urls['thread_bone'],
});

models.message = Backbone.Model.extend({
    urlRoot: urls['message_bone'],
});

applications.thread = Backbone.View.extend({
    events: {
        'submit #new_thread': 'post_new_thread',
    },

    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.threads = new Backbone.Collection();
        this.threads.model = models.thread;
        this.threads.url = urls['thread_bone_type_id'](this.type, this.context.get('id'));
        this.threads.bind('add', this.render);
        var self = this;
        this.threads.fetch({
            success: function() {
                self.render();
            },
        });
    },

    post_new_thread: function() {
        var self = this;
        var thread = new models.thread({
            subject: 'wazup?',
            text: 'lorem ispum',
            type: self.type,
            context: self.context.get('id'),
        });
        //thread.save();
        this.threads.add(thread);
        return false;
    },

    render: function() {
        console.log("thread render " + JSON.stringify(this.threads.toJSON()));
        this.$el.html(templates['tpl-course-thread']({
            context: this.context.toJSON(),
            threads: this.threads.toJSON(),
        }));
        return this;
    },

    close: function() {},
});
