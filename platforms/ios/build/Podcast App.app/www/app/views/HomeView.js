HomeView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	render: function(){
		this.$el.html(this.template({}));
		this.$recentPodcasts = this.$el.find('#recentPodcasts');
		this.$staffPicks = this.$el.find('#staffPicks');

		//PodcastListItemView

		var recentPodcasts = podcastItems.findSubscribed();

		_.each(recentPodcasts, function(podcastItem){
			var view = new PodcastListItemView({ model: podcastItem });

            this.$recentPodcasts.append(view.render().el);
    	}, this);

		return this;
	},
});