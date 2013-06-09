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

    if(this.get('dropboxSync') == true){
      this.dropboxAuth(false);
    }
  },

  cloudSave: function(){
    this.save();
  },

  dropboxAuth: function(redirect){
    var redirect;
    settings.set('dropboxSync', true);
    this.dropboxClient = new Dropbox.Client({
      key: "gkEKyDpBMsA=|++7iyniKA/kjwqydL7CQEtBv9oZ4hp7gSaPMp7Fk3w==",
      sandbox: true
    });
    this.dropboxClient.authDriver(new Dropbox.Drivers.Redirect({
      rememberUser: true,
      useQuery: true
    }));

    this.dropboxClient.authenticate(function(error, client) {
      if (error) {
        alert(error);
        settings.set('dropboxSync', false);
        return false;
      }

      if(redirect){
        app.navigate('301', true);
        app.navigate('settings/device-sync', true);
      }

      return true;
    });
  },

  dropboxSignOut: function(){
    this.dropboxClient.signOut(function(error) {
      if (error == null) {
        app.navigate('301', true);
        app.navigate('settings/device-sync', true);
      }
    });
  }

  // Move all the auth stuff to here.
});