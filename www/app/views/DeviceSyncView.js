DeviceSyncView = Backbone.View.extend({

	events: {
		'click #authentificateDropbox': 'authentificateDropbox',
		'click #signOutDropbox': 'signOutDropbox',
		'click #forcePush': 'forcePush',
		'click #forcePull': 'forcePull',
		'click #push': 'itemPush',
		'click #pull': 'itemPull',
	},

	initialize: function() {
		this.render();

		this.listenTo(settings, 'dropboxSync', this.render);
	},

	render: function(){
		this.$el.html(this.template({
			'isAuthenticated' : settings.get('dropboxSync')
		}));

		return this;
	},

	authentificateDropbox: function(){
		settings.dropboxConnect();
	},

	signOutDropbox: function(){
		settings.dropboxSignOut();
		settings.set('dropboxSync', false);
	},

	itemPush: function(){
		this.itemSync('push', true);
	},
	itemPull: function(){
		this.itemSync('pull', true);
	},

	itemSync: function(PushPull, force){
		if(force == null){
			force = false;
		}

		var lastSync = settings.get('lastSync');
		// If it's the first ever sync.
		if(lastSync == null){
			force = true;
		}

		// Now reset the last sync time
		settings.set('lastSync', (new Date().toUTCString()));

		globalSettings.cloudSync(PushPull, {force: force, lastSync: lastSync});
		podcastItems.cloudSync(PushPull, {force: force, lastSync: lastSync});
		episodeItems.cloudSync(PushPull, {force: force, lastSync: lastSync});
	},

	forcePush: function(){
		this.itemSync('push', true);
	},
	forcePull: function(){
		this.itemSync('pull', true);
	},
});