/**
 * These settings only sync for this device, it'll hold dropbox data.
 */
var SettingsModel = Backbone.Model.extend({

  localStorage: new Backbone.LocalStorage("Settings-bb"),

  // Default attributes for an podcast
  defaults: function() {
    return {
    	id: 1,
    	dropboxSync: false,
    	dropboxUser: null,
    	lastVisit: null,
    };
  },

  initialize: function () {
  	this.listenTo(this, 'change', this.cloudSave); 
  },

  cloudSave: function(){
    this.save();
  },

});