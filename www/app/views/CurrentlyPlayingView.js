CurrentlyPlayingView = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	render: function() {
		if(this.model == null){
			// Quickly make the blank element.
			this.$el.html(this.template({
				episode: {},
				podcast: {},
			}));
			return this;
		}
		
		this.$el.html(this.template({
			episode: this.model.attributes,
			podcast: this.model.podcast.attributes,
        }));
	},
});