CurrentlyPlayingView = Backbone.View.extend({
	tagName: 'li',

	initialize: function() {
		this.render();

		if(this.model != null){
			this.listenTo(this.model, 'change:duration playing', this.render);
		}
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
			podcast: _.extend(this.model.podcast.attributes, {
                imageUrl: filesItems.getFile(this.model.podcast.get('imageUrl'))
            }),
        }));
	},
});