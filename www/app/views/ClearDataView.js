ClearDataView = Backbone.View.extend({

	events: {
      "click #clearData"   : "clearData",
    },

	initialize: function() {
		this.render();
	},

	render: function(){
		this.$el.html(this.template({}));

		return this;
	},

	clearData: function(){
		// Clear these.
		episodeItems.reset();
		podcastItems.reset();

		// Now delete all the local storage.
		
	}
});