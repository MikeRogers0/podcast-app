DeviceSyncView = Backbone.View.extend({

	events: {
		'click #authentificateDropbox': 'authentificateDropbox',
		'click #signOutDropbox': 'signOutDropbox'
	},

	initialize: function() {
		this.render();
	},

	render: function(){
		this.$el.html(this.template({
			'isAuthenticated' : settings.get('dropboxSync')
		}));

		return this;
	},

	authentificateDropbox: function(){
		settings.dropbox.authentificate();
	},

	signOutDropbox: function(){
		settings.dropbox.signOut();
		settings.set('dropboxSync', false);
	},
});