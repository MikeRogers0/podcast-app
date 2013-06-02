PodcastListItemView = Backbone.View.extend({
    tagName: 'li',

    events:{
        //'click a.playPause': 'playPause',
        //'click a.queue': 'queueToggle',
    },

    initialize: function(){

        // Set up event listeners. The change backbone event
        // is raised when a property changes (like the checked field)

        this.listenTo(this.model, 'change', this.render);
        this.render();
    },

    render: function(){
        // Create the HTML
        var template = this.template({
            title: this.model.get('title'), 
            link: this.model.get('link'),
            subscribed: this.model.get('subscribed')
        });

        this.$el.html(template);

        this.$el.addClass('pure-u-1-5');
        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    }
});