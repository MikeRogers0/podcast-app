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

  initialize: function () {
    //var self = this;

    this.podcast = podcastItems.getByID(this.get('podcastID'));

    this.episode = this.podcast.episodes.getByID(this.get('episodeID'));
  },

  toggle: function(){
    alert('Clicking like a boss');
  }
});