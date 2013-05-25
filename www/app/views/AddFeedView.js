AddFeedView = Backbone.View.extend({
	el: $("#addFeed"),

	template: _.template($('#addFeed-template').html()),

	events: {
      "submit"   : "addFeed",
    },

	initialize: function() {
		this.render();
		this.feedURL = this.$('input[name="feedURL"]');
		debugger;
	},

	render: function(){
		this.$el.html(this.template({

		}));

		return this;
	},

	addFeed: function(){
		debugger;
		alert('Adding feed: '+ this.feedURL.val());
	}
});

var AddFeed = new AddFeedView();