QueueView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function(){
		this.$el.html(this.template({}));
		this.queue = this.$el.find("#queue");

		queuedItems.each(function(queued){
			var view = new EpisodeItemView({ model: queued });
			
            this.queue.append(view.render().el);
    	}, this);

		return this;
	},
});