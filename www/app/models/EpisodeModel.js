EpisodeModel = CloudModel.extend({

  // Default attributes for an episode
  defaults: function() {
    return {
      id: episodeItems.nextID(),
      title: "Some episode title",
      datePublished: null,
      playhead: 0,
      duration: 0,
      mp3: '',
      mp3_format: 'audio/mpeg',
      link: '',
      listened: false,
      podcastID: null, // The ID of the parent podcast,
      queued: false,
      queuePosition: false,
      modelUpdatedAt: (new Date()).toUTCString()
    };
  },

  initialize: function () {
    this.podcast = podcastItems.getByID(this.get('podcastID'));

    this.bind('change', function(){this.save();});
    this.bind('add change:queuePosition', function(){this.cloudSave();}); 
    this.bind('change:queued', function(){this.queuedChanged();}); 
  },

  /**
   * Update the Queued view when new stuff is added.
   */
  queuedChanged: function(){
    if(app.QueueView != undefined){
      app.QueueView.trigger('queueChanged');
    }
  },

  playPause: function(){
      app.Player.playPause(this);
      this.trigger('change');
  },

  queueToggle: function(){
    this.set('queued', !this.get('queued'));
    if(this.get('queued') == false){
      this.set('queuePosition', false);
      filesItems.removeFile(this.get('mp3'));
    }else{
      this.set('queuePosition', episodeItems.nextQueuePosition());
      filesItems.cacheFile(this.get('mp3'));
    }
  },

  percentCompleted: function(){
    var percentCompleted = 0;
    if(this.get('playhead') != null && this.get('duration') != null && this.get('duration') != 0){
      percentCompleted = parseInt((this.get('playhead') / this.get('duration')) * 100);
    }

    return percentCompleted;
  },

  isPlaying: function(){
    return (app.Player ? app.Player.isCurrentlyPlaying(this.get('id')) : false)
  },

  getPublishedDate: function(){
    return new Date(this.get('datePublished')).timeSince();
  },

  getDuration: function(){
    return dateFormat.minutes(this.get('duration'));
  }
});