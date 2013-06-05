CurrentlyPlayingView = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	render: function() {
		if(this.model == null){
			// Quickly make the blank element.
			this.$el.html(this.template({
				playhead: 0,
	            duration: 0,
	            title: '', 
	            titleEncoded: '',
	            podcast_title: '',
	            podcast_feedUrlEncoded: ''
			}));
			return this;
		}
		
		this.$el.html(this.template({
            playhead: this.model.get('playhead'),
            duration: this.model.get('duration'),
            title: this.model.get('title'), 
            titleEncoded: this.model.get('titleEncoded'),
            podcast_title: this.model.podcast.get('title'),
            podcast_feedUrlEncoded: this.model.podcast.get('feedUrlEncoded')
        }));
	},
});