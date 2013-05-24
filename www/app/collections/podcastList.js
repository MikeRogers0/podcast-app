var PodcastList = Backbone.Collection.extend({
	model: Podcast,

	localStorage: new Backbone.LocalStorage("PodcastList-bb"),
	
	getByID: function(id){
		return this.where({id:id})[0];
    },
    nextID: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
    }
});

var podcastItems = new PodcastList();