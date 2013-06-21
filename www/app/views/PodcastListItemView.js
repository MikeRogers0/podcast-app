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
            podcast: this.model.attributes
        });

        this.$el.html(template);

        this.$el.addClass('pure-u-1-5');
        //this.$el.find(".podcastItem").css("background-image", "url(http://assets.libsyn.com/content/5463414.jpg)"); 
        this.$el.find(".podcastItem").css("background-image", "url('" + this.model.get('imageUrl') + "')"); 

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    }
});