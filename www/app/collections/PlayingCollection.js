var PlayingCollection = Backbone.Collection.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("ThePlayer-bb"),

	play: function(newModel){
		this.trigger('play', newModel);
		alert('saying play');
	}
});

var Player = new PlayingCollection();