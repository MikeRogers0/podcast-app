/**
 * Global settings will sync over multiple devices.
 **/

var GlobalSettingsModel = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
    	id: 1,
      lastListeningTo: null,
    };
  },

  initialize: function () {
    this.localStorage = (settings.get('dropboxSync') == true ? new Backbone.DropboxStorage('GlobalSettings-bb', settings.dropboxClient) : new Backbone.LocalStorage("GlobalSettings-bb"));
    this.listenTo(this, 'change:lastListeningTo', this.cloudSave); 
  },

  cloudSave: function(){
    this.save();
  },

});