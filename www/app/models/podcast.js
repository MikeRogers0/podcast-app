var Podcast = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: podcastItems.nextID(),
      title: "Some podcast title",
      description: "",
      subscribe: null, // Bool - can add episodes that you dont subscribe to, so you can get/listen to specific episodes
      lastChecked: null,
      lastUpdated: null,
      feedURL: ''
    };
  },

  initialize: function () {
    //var self = this;
  },

  getNewEpisodes: function(){
    // TODO - Get the new episodes
  },

  getEpisode: function() {
    // TODO - Get single episode, from an index of the available episodes on the feed URL.
  }
});