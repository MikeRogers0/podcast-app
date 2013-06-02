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

		_.each(podcastItems.models, function(podcastItem){
			var view = new PodcastListItemView({ model: podcastItem });
			
            this.myPodcasts.append(view.render().el);
    	}, this);

		return this;
	},
});