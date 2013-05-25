var PlayingCollection = Backbone.Collection.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("ThePlayer-bb"),

	play: function(newModel){
		alert('saying play');
	}
});

var Player = new PlayingCollection();