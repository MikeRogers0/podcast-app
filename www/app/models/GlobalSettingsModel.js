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
    };
  },

  initialize: function () {
    this.listenTo(this, 'change:lastListeningTo', this.cloudSave); 
  },

  cloudSave: function(){
    this.save();
  },

  cloudSync: function(method, options){
    // If dropbox isn't on ignore the request.
    if(!settings.get('dropboxSync')){
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