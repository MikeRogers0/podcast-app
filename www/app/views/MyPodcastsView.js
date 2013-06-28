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
			this.myPodcasts.append('<li>No podcasts added yet</li>');
			return this;
		}

		// Should be get subsribed I think.
		_.each(subscribedPodcasts, function(podcastItem){
			var view = new PodcastListItemView({ model: podcastItem });

            this.myPodcasts.append(view.render().el);
    	}, this);

    	this.myPodcasts.append('<a href="/add-feed" title="Add a new Podcast Feed" class="podcastItem addPodcast"><p>Add New Podcast Feed</p></a>');


		return this;
	},
});