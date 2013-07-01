/**
 * These settings only sync for this device, it'll hold dropbox data.
 */
SettingsModel = Backbone.Model.extend({
  // This one is always localStorage
  localStorage: new Backbone.LocalStorage("Settings-bb"),

  // Default attributes for an podcast
  defaults: function() {
    return {
    	id: 1,
    	dropboxSync: false,
      lastPull: null,
      lastPush: null,
    	lastVisit: null,
      UTCOffset: null, // The time difference betweeen the user device and UTC (for smarter dropbox syncing).
      modelUpdatedAt: (new Date()).toUTCString()
    };
  },

  initialize: function () {
  	this.on('change', function(){this.save();});
  },

  clearQueue: function(){

  },

  dropboxInit: function(){
    this.dropboxClient = new Dropbox.Client({
      key: "gkEKyDpBMsA=|++7iyniKA/kjwqydL7CQEtBv9oZ4hp7gSaPMp7Fk3w==",
      sandbox: true
    });
    this.dropboxClient.authDriver(new Dropbox.Drivers.Redirect({
      rememberUser: true,
      useQuery: true
    }));
  },

  dropboxAuth: function(AuthCallback){
    var AuthCallback = AuthCallback;
    this.dropboxInit();
    this.dropboxClient.authenticate({interactive: false}, function(error, client) {
      settings.set('dropboxSync', true);
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
        settings.set('dropboxSync', false);
        return;
      }
    });
  },

  /**
   * Used for the first time a user connects to Dropbox. This will figure out the time difference 
   * of each device compared to dropbox.
   */
  dropboxConnect: function(){
    var _this = this;
    this.dropboxInit();
    settings.set('dropboxSync', true);
    this.dropboxClient.authenticate(function(error, client) {
      if (error) {
        settings.set('dropboxSync', false);
        return;
      }
      
      // Figure out the time difference.
      _this.dropboxDrift();

      app.navigate('settings/device-sync', true);
      return;
    });
  },

  /**
   * Calucate the time difference between the user and UTC.
   */
  dropboxDrift: function(){
    var x = new Date()
    this.set('UTCOffset', x.getTimezoneOffset());
  },

  dropboxSignOut: function(){
    this.dropboxClient.signOut(function(error) {
      if (error == null) {
        app.navigate('301', true);
        app.navigate('settings/device-sync', true);
      }
    });
  },

  // dropbox Pull
  dropboxPull: function(force){
    if(!this.canDropbox()){
      return false;
    }

    var lastPull = this.get('lastPull');
    // If it's the first ever sync.
    if(lastPull == null){
      force = true;
    }
    this.set('lastPull', (new Date().toUTCString()));

    this.dropboxSync('pull', {force: force, lastPull: lastPull});
  },

  // Dropbox Push
  dropboxPush: function(force){
    if(!this.canDropbox()){
      return false;
    }

    var lastPush = this.get('lastPush');

    // If it's the first ever sync.
    if(lastPush == null){
      force = true;
    }
    this.set('lastPush', (new Date().toUTCString()));

    this.dropboxSync('push', {force: force, lastPush: lastPush});
  },

  dropboxClear: function(){
    if(!this.canDropbox()){
      return false;
    }

    this.dropboxSync('delete', {});
  },

  dropboxSync: function(method, options){
    globalSettings.cloudSync(method, options);
    podcastItems.cloudSync(method, options);
    episodeItems.cloudSync(method, options);
  },

  canDropbox: function(){
    if(!this.get('dropboxSync')){
      return false;
    }

    if(this.dropboxClient == undefined){
      return false;
    }

    // Check we are online
    if(!navigator.onLine){
      return false;
    }

    return true;
  },
});