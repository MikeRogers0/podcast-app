var PlayerModel = Backbone.Model.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("EpisodeList-bb"),

	defaults: function() {
		return {
			playhead: 0,
			episodeID: 0
		};
	},

	play: function(model){

		// TODO pause & log anything currently running
		this.model = model;
		this.set('episodeID', model.get('id'));
	}
});

var Player = new PlayerModel();