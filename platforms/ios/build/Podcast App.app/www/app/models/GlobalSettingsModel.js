/**
 * Global settings will sync over multiple devices.
 **/

GlobalSettingsModel = CloudModel.extend({
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
});