var Queue = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: null,
      position: null,
      podcastID: null,
      episodeID: null,
      lastPlayed: null,
      position: null,
    };
  }

});