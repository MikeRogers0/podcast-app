var Episode = Backbone.Model.extend({

  // Default attributes for an episode
  defaults: function() {
    return {
      id: episodeItems.nextID(),
      title: "Some episode title",
      datePublished: null,
      duration: null,
      playhead: 0,
      duration: 100,
      mp3: 'http://downloads.bbc.co.uk/podcasts/radio4/fricomedy/fricomedy_20130524-1859a.mp3',
      cached: false,
      listened: false,
      playing: false,
      podcastID: null // The ID of the podcast
    };
  },

  initialize: function () {
    this.podcast = podcastItems.getByID(this.get('podcastID'));

    //this.listenTo(this, 'change:playing', this.queue);
  },

  playPause: function(){
    // If it's playing pause it.
    if(this.get('playing') == true){
      this.set('playing', false);
      Player.pause(this);
    } else {
      this.set('playing', true);
      Player.play(this);
    }
  },

  queue: function(){
    //alert('Unqueue '+ this.get('title'));
  }
});