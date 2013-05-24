var EpisodeList = Backbone.Collection.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("EpisodeList-bb"),
	
	getByID: function(id){
		return this.where({id:id})[0];
    },
    getByPodcastID: function(podcastID){
		return this.where({podcastID:podcastID});
    },
    nextID: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
    }
});

episodeItems = new EpisodeList();