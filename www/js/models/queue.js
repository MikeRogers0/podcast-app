var queue = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      position: null,
      podcastID: null,
      episodeID: null,
      lastPlayed: null,
      position: null,
    };
  }

});