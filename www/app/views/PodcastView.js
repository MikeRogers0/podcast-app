PodcastView = Backbone.View.extend({

    events: {
        'click .subscribe' : 'subscribeToggle',
        'click .updateEpisodes': 'updateEpisodes'
    },

    initialize: function(){
        this.render();
        this.listenTo(this.model, 'change', this.render); 
    },

    render: function(){
        // Create the HTML
        var template = this.template({
            podcast: this.model
        });

        this.$el.html(template);

        // Add in the episodes
        this.episodes = this.$el.find("#episodes");

        var podcastEpisodesItems = this.model.getEpisodes();

        if(podcastEpisodesItems.length == 0){
            // Render not items?
            this.episodes.append('<li>No items in queue</li>');
            return this;
        }

        _.each(podcastEpisodesItems, function(episode){
            var view = new PodcastItemView({ model: episode });
            
            this.episodes.append(view.render().el);
        }, this);


        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    },

    subscribeToggle: function(){
        this.model.subscribedToggle();
    },

    updateEpisodes: function(){
        this.model.updateEpisodes();
    }
});