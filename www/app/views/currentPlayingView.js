CurrentPlayingView = Backbone.View.extend({
	el: $("#currentlyPlaying"),

	template: _.template($('#currentlyPlaying-template').html()),

	initialize: function() {
		this.listenTo(Player, 'play', this.render);
	},

	render: function() {
		alert('Hello');
		debugger;
		this.el.html(this.template({
                playhead: this.model.episode.get('playhead'),
                duration: this.model.episode.get('duration'),
                episode_title: this.model.episode.get('title'), 
                podcast_title: this.model.podcast.get('title')
            }));
	}
});

var CurrentPlaying = new CurrentPlayingView();