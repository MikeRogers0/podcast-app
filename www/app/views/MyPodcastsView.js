MyPodcastsView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function(){
		this.$el.html(this.template({}));
		this.myPodcasts = this.$el.find("#myPodcasts");

		if(podcastItems.models.length == 0){
			// Render not items?
			this.myPodcasts.append('<li>No podcasts added yet</li>');
			return this;
		}

		// Should be get subsribed I think.
		_.each(podcastItems.models, function(podcastItem){
			var view = new PodcastListItemView({ model: podcastItem });
			
            this.myPodcasts.append(view.render().el);
    	}, this);

    	this.myPodcasts.append('<li class="pure-u-1-5"><a href="/add-feed" title="Add a new Podcast Feed" class="podcastItem">Add New Podcast Feed</a></li>');


		return this;
	},
});