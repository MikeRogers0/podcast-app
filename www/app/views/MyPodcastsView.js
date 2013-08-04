MyPodcastsView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function(){
		this.$el.html(this.template({}));
		this.myPodcasts = this.$el.find("#myPodcasts");

		var subscribedPodcasts = podcastItems.findSubscribed();

		if(subscribedPodcasts.length == 0){
			// Render not items?
			this.myPodcasts.append('<li><a href="/search" class="addPodcast"><div>Add New Podcast Feed</div></a><li>');
			return this;
		}

		// Should be get subsribed I think.
		_.each(subscribedPodcasts, function(podcastItem){
			var view = new PodcastListItemView({ model: podcastItem });

            this.myPodcasts.append(view.render().el);
    	}, this);

    	this.myPodcasts.append('<li><a href="/search" class="addPodcast"><div>Add New Podcast Feed</div></a><li>');


		return this;
	},
});