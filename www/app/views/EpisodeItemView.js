EpisodeItemView = Backbone.View.extend({
    tagName: 'li',

    events:{
        'click a.playPause': 'playPause',
        'click a.queue': 'queueToggle',
    },

    initialize: function(){

        // Set up event listeners. The change backbone event
        // is raised when a property changes (like the checked field)

        this.listenTo(this.model, 'playing', this.render);
        this.listenTo(this.model, 'loading', this.loading);
        this.listenTo(this.model, 'change:playhead', this.playhead);
        this.render();
    },

    render: function(){
        // Create the HTML
        var template = this.template({
            playing: app.Player.isCurrentlyPlaying(this.model.get('id')), // Pull it from the player collection / model.
            queued: this.model.get('queued'), // Get from queue model.
            percentCompleted: parseInt((this.model.get('playhead') / this.model.get('duration')) * 100),
            episode_titleEncoded: this.model.get('titleEncoded'),
            episode_title: this.model.get('title'), 
            podcast_title: this.model.podcast.get('title'),
            podcast_feedUrlEncoded: this.model.podcast.get('feedUrlEncoded')
        });

        this.$el.html(template);

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    },

    loading: function(){
        this.$el.find('a.playPause').text('Loading');
    },
    playhead: function(){
        this.$el.find('.percentCompleted').text('('+parseInt((this.model.get('playhead') / this.model.get('duration')) * 100)+'%)');
    },
    playPause: function(){
        this.model.playPause();
    },
    queueToggle: function(){
        this.model.queueToggle();
    },
});