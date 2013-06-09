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
		settings.dropboxAuth(true);
	},

	signOutDropbox: function(){
		settings.dropboxSignOut();
		settings.set('dropboxSync', false);
	},
});