var Queue = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: null,
      position: null,
      podcastID: null,
      episodeID: null,
      episode: {},
      podcast: {},
      lastPlayed: null,
      position: null,
    };
  },

  /*initialize: function () {
    var self = this;
    this.episodes = new EpisodeList();
  }*/
});