var Queue = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: queuedItems.nextID(),
      position: null,
      episodeID: null,
      lastPlayed: null,
      position: 0, // In seconds I think?
    };
  },

  initialize: function () {
    //var self = this;

    // Grab it's children models.
    this.episode = episodeItems.getByID(this.get('episodeID'));
    this.podcast = podcastItems.getByID(this.episode.get('podcastID'));
  }
});