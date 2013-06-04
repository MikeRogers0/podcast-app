PodcastEpisodeView = Backbone.View.extend({

    events:{
        'click a.playPause': 'playPause',
        'click a.queue': 'queueToggle',
    },

    initialize: function(){
        this.render();
        this.listenTo(this.model, 'playing', this.render);
        this.listenTo(this.model, 'loading', this.loading);
        this.listenTo(this.model, 'change:playhead', this.playhead);
        this.listenTo(this.model, 'change:queued', this.render);
    },

    render: function(){
        // Create the HTML
        var template = this.template({
            podcast_title: this.model.podcast.get('title'), 
            episode_title: this.model.get('title'),
            podcast_link: this.model.podcast.get('link'),
            podcast_feedUrlEncoded: this.model.podcast.get('feedUrlEncoded'),
            subscribed: this.model.podcast.get('subscribed'),
            episode_description: this.model.get('description'),
            playing: app.Player.isCurrentlyPlaying(this.model.get('id')), // Pull it from the player collection / model.
            queued: this.model.get('queued'), // Get from queue model.
            percentCompleted: parseInt((this.model.get('playhead') / this.model.get('duration')) * 100),
            episode_link: this.model.get('link')
        });

        this.$el.html(template);

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    },

    loading: function(){
        this.$el.find('a.playPause').text('Loading');
    },
    playPause: function(){
        this.model.playPause();
    },
    queueToggle: function(){
        this.model.queueToggle();
    },
});