/*
	The view of queues
*/
QueueView = Backbone.View.extend({
	initialize: function() {
		this.render();
		this.bind('queueChanged', function(){this.updateQueue();});
	},

	render: function(){
		this.$el.html(this.template({}));
		this.$queue = this.$el.find("#queue");

		this.updateQueue();

    	this.$queue.sortable({ 
    		axis: "y", 
    		handle: ".podcastThumb", 
    		containment: "parent", 
    		opacity: 0.75,
    		stop: function(event, ui ){
	    		// Update the queue order
	    		var lis = $(this).find('li[data-model-id]');
	    		lis.each(function(indexInArray, valueOfElement){
	    			var position = lis.length - indexInArray;
	    			$(this).attr('data-model-queuePosition', position);
	    			episodeItems.getByID(parseInt($(this).attr('data-model-id'))).set({'queuePosition': position});

	    			$(this).removeClass('dragging');
	    		});
    		},
    		activate: function(event, ui ){
    			var lis = $(this).find('li[data-model-id]');
    			lis.addClass('dragging');
    		}
    	});

		return this;
	},

	updateQueue: function(){
		this.$queue.html('');

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
	},
});