// Copyright 2012, UrLab. All rights reserved.

applications.course_sidebar = Backbone.View.extend({
    initialize: function(params) {
        console.log("Initialize course sidebar view, id = " + params.course_id);
        _.bindAll(this, 'render');
        this.render(params.course_id);
    },

    render: function(course_id) {
        this.$el.html(templates['course-sidebar']({
            course_id: course_id,
        }));
    },

    close: function() {},
});
