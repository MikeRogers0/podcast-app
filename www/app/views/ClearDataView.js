ClearDataView = Backbone.View.extend({

	events: {
      "click #clearData"   : "clearData",
    },

	initialize: function() {
		this.render();
		this.clearButton = this.$el.find('#clearData');
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
		localStorage.clear();

		this.clearButton.text('Data Cleared');
	}
});