var Episode = Backbone.Model.extend({

  // Default attributes for an episode
  defaults: function() {
    return {
      id: episodeItems.nextID(),
      title: "Some episode title",
      datePublished: null,
      duration: null,
      mp3: '',
      cached: false,
      podcastID: null // The ID of the podcast
    };
  },

  /*initialize: function () {
    var self = this;
    this.episodes = new EpisodeList();
  }*/
});