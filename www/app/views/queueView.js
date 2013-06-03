QueueView = Backbone.View.extend({
	initialize: function() {
		this.render();
		//this.listenTo(EpisodeList, 'change', this.render); 
	},

	render: function(){
		this.$el.html(this.template({}));
		this.queue = this.$el.find("#queue");

		var queuedItems = episodeItems.getQueued();

		if(queuedItems.length == 0){
			// Render not items?
			this.queue.append('<li>Nothing here :(</li>');
			return this;
		}

		_.each(queuedItems, function(queued){
			var view = new EpisodeItemView({ model: queued });
			
            this.queue.append(view.render().el);
    	}, this);

		return this;
	},
});