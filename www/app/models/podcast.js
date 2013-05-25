var Podcast = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: podcastItems.nextID(),
      title: "Some podcast title",
      description: "",
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
  }
});