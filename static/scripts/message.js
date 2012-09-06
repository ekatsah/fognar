// Copyright 2012, Cercle Informatique. All rights reserved.

models.thread = Backbone.RelationalModel.extend({
    url: urls['thread_bone'],
    relations: [{
        type: Backbone.HasMany,
        key: 'messages',
        relatedModel: 'models.message',
        collectionType: 'collections.messages',
    },{
        type: Backbone.HasOne,
        key: 'user',
        relatedModel: 'models.user'
    }],
    initialize: function(params) {
        console.log("New thread model with id " + params.id);
    },
});

models.message = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasOne,
        key: 'user',
        relatedModel: 'models.user',
    }],
    //url: function() { this.attributes.id ? 'msg/m/' + this.attributes.id : '/msg/m/' },
    url: '/msg/m/',
    initialize: function(params) {
        console.log("New message model with id " + params.id);
        console.log(this.url);
        this.wrap_save_for_djangbone();
    },
    wrap_save_for_djangbone: function() {
        this._save = this.save;
        this.save = function() {
            this.relations[0].includeInJSON = Backbone.Model.prototype.idAttribute;
            this._save();
            this.relations[0].includeInJSON = true;
        }
    },
});

collections.messages = Backbone.Collection.extend({
    model: models.messages,
    initialize: function(params) {
        console.log("New messages collection");
    },
});

applications.submit_new_message = Backbone.View.extend({
    events: {
        "submit": "add_new_message",
    },
    initialize: function(params) {
        console.log("New submit_new_message view");
    },
    add_new_message: function(event) {
        var text = this.$el.find("textarea").val();
        console.log("add a new message with text: " + text);
        event.preventDefault();
        if (text.length == 0) {
            console.log("No text, don't create a new message");
            return;
        }
        this.$el.find("textarea").val("");
        var new_message = new models.message({
            text: text,
            thread: this.model.id,
            user: window.profile.id,
            reference: null,
        });
        this.model.attributes.messages.add(new_message);
        new_message.save();
    }
});

applications.thread_view = Backbone.View.extend({
    initialize: function() {
        this.model.attributes.messages.bind("change", this.render, this);
        this.name = "moi";
        this.render();
    },
    render: function() {
        console.log("Je me render: " + this.name);
        //console.log(JSON.stringify(this.model.toJSON()));
        this.$el.html(templates['tpl-thread-thread']({
            thread: this.model.toJSON(),
        }));
        new applications.submit_new_message({
            el: $("#submit_new_message_" + this.model.id),
            model: this.model,
        });
    }
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
        this.threads.each(function(thread) {
            new applications.thread_view({
                el: $('#thread_' + thread.id),
                model: thread,
            })
        });
        return this;
    },

    close: function() {},
});
