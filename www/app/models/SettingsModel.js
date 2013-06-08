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
    	lastVisit: null,
    };
  },

  initialize: function () {
  	this.listenTo(this, 'change', this.cloudSave);

    this.dropboxClient = new Dropbox.Client({
      key: "gkEKyDpBMsA=|++7iyniKA/kjwqydL7CQEtBv9oZ4hp7gSaPMp7Fk3w==",
      sandbox: true
    });
    this.dropbox = new DropBoxStorage('someName', this.dropboxClient);

    if(this.get('dropboxSync') == true){
      settings.dropbox.authentificate();
    }
  },

  cloudSave: function(){
    this.save();
  },

  // Move all the auth stuff to here.
});