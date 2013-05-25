AddFeedView = Backbone.View.extend({
	el: $("#addFeed"),

	template: _.template($('#addFeed-template').html()),

	events: {
      "submit"   : "addFeed",
    },

	initialize: function() {
		this.render();
		this.feedURL = this.$('input[name="feedURL"]');
	},

	render: function(){
		this.$el.html(this.template({

		}));

		return this;
	},

	addFeed: function(){
		podcastItems.addFeed(this.feedURL.val());
	}
});

var AddFeed = new AddFeedView();