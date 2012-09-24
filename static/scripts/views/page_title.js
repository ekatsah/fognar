// Copyright 2012, UrLab. All rights reserved.

applications.page_title = Backbone.View.extend({
    initialize: function(params) {
        console.log("Initialize course view");
        _.bindAll(this, 'render', 'close');
        this.model_name = params.model_name;
        this.object_id = params.object_id;

        if (this.model_name == 'course')
            this.collection = cache.course;
        else
            this.collection = null;

        if (this.collection != null) {
            this.object = cache.course.get_or_fetch(this.object_id);
            this.collection.bind("change add", this.render);
            this.render();
        }
    },

    render: function() {
        this.$el.html(templates['page-title']({
            title: this.object.get('name'),
            icon: this.model_name,
        }));
    },

    close: function() {
        if (this.collection)
            this.collection.unbind("change add", this.render);
    },
});
