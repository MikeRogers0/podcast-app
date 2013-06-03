var EpisodeList = Backbone.Collection.extend({
	model: Episode,

	localStorage: new Backbone.LocalStorage("EpisodeList-bb"),
	
	getByID: function(id){
		return this.where({id:id})[0];
  },
  getByPodcastID: function(podcastID){
		return this.where({podcastID:podcastID});
  },
  getByWhere: function(query){
    return this.where(query)[0];
  },
  findByWhere: function(query){
    return this.where(query);
  },
  getQueued: function(){
    return this.where({queued:true});

    //return qeuedItems.sort('queued');
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