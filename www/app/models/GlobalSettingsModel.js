/**
 * Global settings will sync over multiple devices.
 **/

var GlobalSettingsModel = Backbone.Model.extend({
  urlRoot: 'globalSettings',
  id: 1,
  localStorage: new Backbone.LocalStorage("GlobalSettings-bb"),

  // Default attributes for an podcast
  defaults: function() {
    return {
    	id: 1,
      lastListeningTo: null,
      modelUpdatedAt: (new Date()).toUTCString()
    };
  },

  initialize: function () {
    this.on('change', function(){this.save();});
    this.on('change:lastListeningTo', function(){this.cloudSave();}); 
  },

  cloudSave: function(){
    this.cloudSync('update');
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