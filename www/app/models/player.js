var PlayerModel = Backbone.Model.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("EpisodeList-bb"),

	defaults: function() {
		return {
			playhead: 0,
			episodeID: 0,
			playing: false
		};
	},

	// TODO make it so it listens to it's child model, instead of the shit below.

	play: function(model){

		// TODO pause & log anything currently running
		this.model = model;
		this.set('episodeID', model.get('id'));
		this.set('playing', true);
	},

	pause: function(model){
		this.set('playing', false);
	}
});

var Player = new PlayerModel();