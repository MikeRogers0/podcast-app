ClearDataView = Backbone.View.extend({

	events: {
      "click #clearData"   : "clearData",
      "click #clearQueue"   : "clearQueue"

    },

	initialize: function() {
		this.render();
		this.clearButton = this.$el.find('#clearData');
		this.clearQueueButton = this.$el.find('#clearQueue');
	},

	render: function(){
		this.$el.html(this.template({}));

		return this;
	},

	clearData: function(){
		// Now removed all the dropbox stuff
		settings.dropboxClear();

		// Unqueue everything
		this.clearQueue();

		// Clear these.
		episodeItems.reset();
		podcastItems.reset();
		globalSettings.clear();
		settings.clear();

		// Now delete all the local storage.
		localStorage.clear();
		
		this.clearButton.text('Data Cleared');
	},

	clearQueue: function(){

		var queuedItems = episodeItems.findQueued();

		_.each(queuedItems, function(episode){
            episode.queueToggle();
        }, this);

	}
});