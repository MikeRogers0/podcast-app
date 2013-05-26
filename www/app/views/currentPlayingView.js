CurrentPlayingView = Backbone.View.extend({
	el: $("#currentlyPlaying"),

	template: _.template($('#currentlyPlaying-template').html()),

	initialize: function() {
		this.listenTo(Player, 'change', this.render);
	},

	render: function() {
		this.$el.html(this.template({
                playhead: Player.model.get('playhead'),
                duration: Player.model.get('duration'),
                episode_title: Player.model.get('title'), 
                podcast_title: Player.model.podcast.get('title')
            }));
	}
});

var CurrentPlaying = new CurrentPlayingView();