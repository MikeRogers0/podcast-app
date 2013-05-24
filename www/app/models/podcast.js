var Podcast = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: null,
      title: "Some podcast title",
      description: "",
      lastChecked: null,
      lastUpdated: null,
      feedURL: '',
      episodes: {}
    };
  },

  initialize: function () {
    //var self = this;
    this.episodes = new EpisodeList();
  }
});