// Copyright 2012, UrLab. All rights reserved.

applications.wikicourse = Backbone.View.extend({
    initialize: function(params) {
        console.log("Initialize wikicourse view");
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.infos = new Backbone.Model({id: this.context.get('infos')});
        this.infos.url = urls['wiki_bone_id'](this.infos.get('id'));
        this.infos.parse = function(d) {
            d.infos = eval('(' + d.infos + ')');
            return d;
        };
        this.infos.on("change", this.render);
        this.infos.fetch();
        this.render();
    },

    events: {
        'click .wiki-edit': function(e) {
            var parent = e.target.parentNode;
            var text = $(parent).children('.wiki-text');
            var input = document.createElement('input');
            $(input).addClass('wiki-input').val($(text).html());
            $(text).remove();
            $(parent).prepend(input);
        },

        'keypress .wiki-input': function(e) {
            if ((e.keyCode ? e.keyCode : e.which) == 13) {
                var text = $(e.target).val();
                var parent = e.target.parentNode;
                var div = document.createElement('div');
                $(div).addClass('wiki-text').html(text);
                $(e.target).remove();
                $(parent).prepend(div);
                $('#wiki-save').css('display', 'block');
            }
        },

        'click #wiki-save': function(e) {
            var new_info = Array();
            $('#wiki article').each(function(idx, elt) {
                var values = Array();
                $(elt).children('ul').children('li').each(function(idx, elt) {
                    values.push({
                        name: $(elt).children('.wiki-label').html(),
                        value: $(elt).children('.wiki-content').children('.wiki-text').html()
                    });
                });
                new_info.push({
                    name: $(elt).children('h2').html(),
                    values: values,
                });
            });
            this.infos.save({infos: new_info});
        },
    },

    render: function() {
        this.context.set({infos: this.infos.get('id')}, {silent: true});
        $(this.el).html(templates['tpl-wiki']({wiki: this.infos.toJSON()}));
        return this;
    },

    close: function() {},
});