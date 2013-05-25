var PlayingCollection = Backbone.Collection.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("ThePlayer-bb"),

	play: function(newModel){
		
	}
});

var Player = new PlayingCollection();