/**
 * These settings only sync for this device, it'll hold dropbox data.
 */
var SettingsModel = Backbone.Model.extend({
  // This one is always localStorage

  // Default attributes for an podcast
  defaults: function() {
    return {
    	id: 1,
    	dropboxSync: true,
    	lastVisit: null,
    };
  },

  initialize: function () {
  	this.listenTo(this, 'change', this.cloudSave);
  },

  cloudSave: function(){
    this.save();
  },

  dropboxAuth: function(redirect, AuthCallback){
    var redirect = (redirect === true ? true : false);
    var AuthCallback = AuthCallback;
    settings.set('dropboxSync', true);
    this.dropboxClient = new Dropbox.Client({
      key: "gkEKyDpBMsA=|++7iyniKA/kjwqydL7CQEtBv9oZ4hp7gSaPMp7Fk3w==",
      sandbox: true
    });
    this.dropboxClient.authDriver(new Dropbox.Drivers.Redirect({
      rememberUser: true,
      useQuery: true
    }));

    this.dropboxClient.authenticate({interactive: false}, function(error, client) {
      if (error) {
          settings.set('dropboxSync', false);
          //return handleError(error);
          return;
      }
      if (client.isAuthenticated()){
        if(typeof AuthCallback == "function"){
          AuthCallback();
        }
        return;
      }else{
        client.authenticate(function(error, client) {
          if (error) {
            settings.set('dropboxSync', false);
            return '';
          }
          if(typeof AuthCallback == "function"){
            AuthCallback();
          }
          if(redirect){
            app.navigate('settings/device-sync', true);
          }
          return;
        });
      }
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