DeviceSyncView = Backbone.View.extend({

	events: {
		'click #authentificateDropbox': 'authentificateDropbox',
		'click #signOutDropbox': 'signOutDropbox',
		'click #forcePush': 'forcePush',
		'click #forcePull': 'forcePull',
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
		settings.dropboxAuth(true, function(){
			//alert();
			// set the other models & collections to now use dropbox.
		});
	},

	signOutDropbox: function(){
		settings.dropboxSignOut();
		settings.set('dropboxSync', false);
	},

	forcePush: function(){
		globalSettings.cloudSync('forcePush');
		podcastItems.cloudSync('forcePush');
		episodeItems.cloudSync('forcePush');
	},
	forcePull: function(){
		globalSettings.cloudSync('forcePull');
		podcastItems.cloudSync('forcePull');
		episodeItems.cloudSync('forcePull');
	},
});