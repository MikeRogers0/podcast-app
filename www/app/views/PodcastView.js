PodcastView = Backbone.View.extend({

    initialize: function(){
        this.render();
    },

    render: function(){
        // Create the HTML
        var template = this.template({
            title: this.model.get('title'), 
            link: this.model.get('link')
        });

        this.$el.html(template);

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    }
});