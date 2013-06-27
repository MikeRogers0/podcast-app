var Episode = Backbone.Model.extend({

  // Default attributes for an episode
  defaults: function() {
    return {
      id: episodeItems.nextID(),
      title: "Some episode title",
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
      modelUpdatedAt: (new Date()).toUTCString()
    };
  },

  initialize: function () {
    this.podcast = podcastItems.getByID(this.get('podcastID'));
    
    if(this.get('queued') == true){
      this.set('queuePosition', episodeItems.nextQueuePosition());
    }

    this.on('change', function(){this.save();});
    this.on('add change:queued', function(){this.cloudSave();}); 
  },

  cloudSave: function(){
    this.cloudSync('update');
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

  cloudSync: function(method, options){
    // If dropbox isn't on ignore the request.
    if(!settings.canDropbox()){
      return false;
    }

    if(options == null){
      options = {};
    }


    //return Backbone.ajaxSync('read', this, options);
    DropBoxSync = new DropBoxStorage(settings.dropboxClient);
    return DropBoxSync.sync(method, this, options);
  },
});