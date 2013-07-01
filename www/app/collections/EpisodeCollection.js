EpisodeCollection = CloudCollection.extend({
	model: EpisodeModel,
  url: 'episodes',
  path: 'episodes',
  localStorage: new Backbone.LocalStorage("EpisodeList-bb"),

  initialize: function () {
  },

	getByID: function(id){
		return this.where({id:id})[0];
  },
  findByPodcastID: function(podcastID){
		return this.where({podcastID:podcastID});
  },
  getByWhere: function(query){
    return this.where(query)[0];
  },
  findByWhere: function(query){
    return this.where(query);
  },

  findQueued: function(){
    var Queueditems = this.where({queued:true});

    // Sort them by Queue Position.
    return _.sortBy(Queueditems, function(episode) { return -episode.get('queuePosition'); });
  },


  nextID: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
  },
  nextQueuePosition: function() {
      var Queueditems = this.where({queued:true});
      if (!Queueditems.length) return 1;
      return Queueditems[Queueditems.length - 1].get('queuePosition') + 1;
  },

  getNextInQueue: function(){
    var currentlyPlaying = app.Player.model;
    var foundCurrentlyPlaying = false;
    var queuedItems = this.findQueued();

    // If there are no items in the queue.
    if(queuedItems[0] == undefined){
      return null;
    }

    // If nothing is currently playing, play the first in the list.
    if(currentlyPlaying == null){
      return queuedItems[0];
    }

    // Find the items current location in the list.
    var nextItemIndex = (_.lastIndexOf(queuedItems, currentlyPlaying)) + 1;

    if(queuedItems[nextItemIndex] != undefined){
      return queuedItems[nextItemIndex];
    }

    // Unless it's the only item in the queue, we don't want 1 on a loop.
    if(nextItemIndex == 1){
      return null;
    }

    // I guess we're at the end :( Start again!
    return queuedItems[0];
  },
});