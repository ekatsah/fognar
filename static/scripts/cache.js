// Copyright 2012, UrLab. All rights reserved.

window.cache_solution = Backbone.Collection.extend({
    initialize: function(model_name) {
        _.bindAll(this, 'get_or_fetch');
        this.model_name = model_name;
    },

    get_or_fetch: function(id) {
        var self = this, object = this.get(id);

        if (typeof object == 'undefined') {
            object = new Backbone.Model({ id: id });
            object.url = '/rest/' + this.model_name + '/' + id;
            object.bind("change", function() { self.trigger("change"); });
            object.fetch();
            this.add(object);
        }

        return object;
    },
});

var cache = {};

cache.course = new window.cache_solution('Course');
Handlebars.registerHelper('course_name', function(id) {
    return cache.course.get_or_fetch(id).get('name');
});

cache.user = new window.cache_solution('Profile');
Handlebars.registerHelper('user_name', function(id) {
    return cache.user.get_or_fetch(id).get('name');
});

cache.group = new window.cache_solution('Group');
Handlebars.registerHelper('group_name', function(id) {
    return cache.group.get_or_fetch(id).get('name');
});

Handlebars.registerHelper('get_name', function(app, id) {
    if (app == 'course')
        return cache.course.get_or_fetch(id).get('name');
    else if (app == 'group')
        return cache.group.get_or_fetch(id).get('name');
    else
        return app + " #" + id;
});
