AddFeedView = Backbone.View.extend({
	//el: $("#addFeed"),

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

	addFeed: function(e){
		e.preventDefault(); // Stop the form going to a hidden page

		podcastItems.addFeed(this.feedURL.val());
	}
});