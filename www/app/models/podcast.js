var Podcast = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: podcastItems.nextID(),
      title: "Some podcast title",
      description: "",
      subscribed: false, // Bool - can add episodes that you dont subscribe to, so you can get/listen to specific episodes
      lastChecked: null,
      lastUpdated: null,
      feedUrl: '',
      imageUrl: '',
      link: ''
    };
  },

  initialize: function () {
    this.episodes = episodeItems.getByPodcastID(this.id);
  },

  getNewEpisodes: function(){
    // TODO - Get the new episodes from the feed.
  },

  getEpisode: function() {
    // TODO - Get single episode, from an index of the available episodes on the feed URL.
  }
});