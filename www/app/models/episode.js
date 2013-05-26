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
      mp3: '',
      cached: false,
      listened: false,
      playing: false,
      podcastID: null // The ID of the podcast
    };
  },

  play: function(){
    if(this.get('playing') == true){
      alert('Pausing'+ this.get('title'));
    } else {
      alert('playing '+ this.get('title'));
      Player.play(this);
    }
    // Looking through, do you reckon it would be better to model the 
    // player and load episodes into it, rather than a variable on the 
    // episodes themselves? - JW (It may not be, just putting it out there)
    
  },
  pause: function(){
    if(this.get('playing') == true){
      alert('Pausing'+ this.get('title'));
    } else {
      alert('playing '+ this.get('title'));
    }
  },
  queue: function(){
    alert('Unqueue '+ this.get('title'));
  }

  /*initialize: function () {
    var self = this;
    this.episodes = new EpisodeList();
  }*/
});