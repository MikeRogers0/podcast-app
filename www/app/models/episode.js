var Episode = Backbone.Model.extend({

  // Default attributes for an episode
  defaults: function() {
    return {
      id: episodeItems.nextID(),
      title: "Some episode title",
      titleEncoded: '',
      description: '',
      datePublished: null,
      playhead: 0,
      duration: 100,
      mp3: '',
      mp3_format: 'audio/mpeg',
      link: '',
      cached: false,
      listened: false,
      podcastID: null, // The ID of the parent podcast,
      queued: false,
      queuePosition: false,
      updated_at: null,
    };
  },

  initialize: function () {
    this.podcast = podcastItems.getByID(this.get('podcastID'));
    
    this.set('titleEncoded', encodeURIComponent(this.get('title')));
    if(this.get('queued') == true){
      this.set('queuePosition', episodeItems.nextQueuePosition());
    }

    this.listenTo(this, 'change', this.cloudSave); // In future we'll need to be more specific.
  },

  cloudSave: function(){
    this.save();
  },

  playPause: function(){
      app.Player.playPause(this);
      this.trigger('change');
  },

  queueToggle: function(){
    this.set('queued', !this.get('queued'));
    if(this.get('queued') == false){
      this.set('queuePosition', false);
    }else{
      this.set('queuePosition', episodeItems.nextQueuePosition());
    }
  }
});