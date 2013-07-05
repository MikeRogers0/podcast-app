/*
	The view of queues
*/
QueueView = Backbone.View.extend({
	initialize: function() {
		this.render();
		this.bind('queueChanged', this.render);
	},

	render: function(){
		this.$el.html(this.template({}));
		this.$queue = this.$el.find("#queue");

		var queuedItems = episodeItems.findQueued();

		if(queuedItems.length == 0){
			// Render not items?
			this.$queue.append('<li>Nothing here :(</li>');
			return this;
		}

		_.each(queuedItems, function(queued){
			var view = new QueueItemView({ model: queued });
			
            this.$queue.append(view.render().el);
    	}, this);

    	this.$queue.sortable({stop: function(event, ui ){
    		// Update the queue order
    		var lis = $(this).find('li[data-model-id]');
    		lis.each(function(indexInArray, valueOfElement){
    			var position = lis.length - indexInArray;
    			$(this).attr('data-model-queuePosition', position);
    			episodeItems.getByID(parseInt($(this).attr('data-model-id'))).set({'queuePosition': position});
    		});
    	}});

		return this;
	},
});