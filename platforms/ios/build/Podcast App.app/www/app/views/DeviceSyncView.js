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

		this.listenTo(settings, 'change:dropboxSync', this.render);
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
		settings.dropboxPush();
	},
	itemPull: function(){
		settings.dropboxPull();
	},

	forcePush: function(){
		settings.dropboxPush(true);
	},
	forcePull: function(){
		settings.dropboxPull(true);
	},
});