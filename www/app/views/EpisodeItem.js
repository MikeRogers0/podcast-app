EpisodeItemView = Backbone.View.extend({
    tagName: 'li',
    // I need a el

    events:{
        'click .playPause': 'playPause',
        'click .queue': 'queue',
    },

    initialize: function(){

        // Set up event listeners. The change backbone event
        // is raised when a property changes (like the checked field)

        this.listenTo(this.model.episode, 'change', this.render);
        this.render();
    },

    render: function(){
        // Create the HTML
        var template = this.template({
            playing: this.model.episode.get('playing'), // Pull it from the player collection / model.
            queued: true, // Get from queue model.
            playhead: this.model.episode.get('playhead'),
            duration: this.model.episode.get('duration'),
            episode_title: this.model.episode.get('title'), 
            podcast_title: this.model.podcast.get('title')
        });

        this.$el.html(template);

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    },

    playPause: function(){
        this.model.episode.playPause();
    },
    queue: function(){
        this.model.episode.queue();
    },
});