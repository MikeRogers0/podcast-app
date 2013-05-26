var PlayerModel = Backbone.Model.extend({
	model: null,

	localStorage: new Backbone.LocalStorage("EpisodeList-bb"),

	defaults: function() {
		return {
			episodeID: 0,
			playing: false
		};
	},

	// TODO make it so it listens to it's child model, instead of the shit below.

	play: function(model){

		// If something is currently playing, pause it.
		if(this.model != null &&  this.model != model && this.model.get('playing')){
			this.model.set('playing', false);
		}

		// TODO pause & log anything currently running
		this.model = model;
		this.set('episodeID', model.get('id'));
		this.set('playing', true);
	},
	pause: function(){
		this.set('playing', false);
	}
});

var Player = new PlayerModel();