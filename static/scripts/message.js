// Copyright 2012, Cercle Informatique. All rights reserved.

models.thread = Backbone.Model.extend({
    initialize: function(params) {
//        this.type = params.type;
//        this.context = params.context;
    },

    url: urls['thread_bone_id'],
});

models.message = Backbone.Model.extend({
    url: urls['message_bone_id'],
});

applications.thread = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.threads = new Backbone.Collection({model: models.thread});
        this.threads.url = urls['thread_bone_type_id'](this.type, this.context.get('id'));
        this.threads.bind('all', this.render);
        this.threads.fetch();
        this.render();
    },

    events: {
        'submit #new_thread': function() {
            var self = this;
            var thread = new models.thread({
                subject: 'wazup?',
                body: 'lorem ispum',
                type: self.type,
                context: self.context.get('id'),
            });
            console.log(thread.isNew());
            thread.save();
            //this.threads.add(thread);
            return false;
        },
    },

    render: function() {
        console.log("thread render");
        $(this.el).html(templates['tpl-course-thread']({
            context: this.context.toJSON(),
        }));
        return this;
    },

    close: function() {},
});
