PodcastView = Backbone.View.extend({

    events: {
        'click .subscribe' : 'subscribeToggle',
        'click .updateEpisodes': 'updateEpisodes'
    },

    initialize: function(){
        this.render();
        this.listenTo(this.model, 'change:subscribed', this.render); 
    },

    render: function(){
        // Create the HTML
        var template = this.template({
            title: this.model.get('title'), 
            link: this.model.get('link'),
            subscribed: this.model.get('subscribed')
        });

        this.$el.html(template);

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    },

    subscribeToggle: function(){
        this.model.set('subscribed', !this.model.get('subscribed'));
        this.model.save();
    },

    updateEpisodes: function(){
        this.model.updateEpisodes();
    }
});