var EpisodeList = Backbone.Collection.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("EpisodeList-bb"),
	
	getByID: function(id){
		return this.where({id:id})[0];
  },
  getByPodcastID: function(podcastID){
		return this.where({podcastID:podcastID});
  },
  getByQueued: function(queued){
    var qeuedItems = this.where({queued:queued});

    return qeuedItems.sort(queued);
  },
  nextID: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
  },
  nextQueuePosition: function() {
      if (!this.length) return 1;
      return this.last().get('queuePosition') + 1;
  }
});