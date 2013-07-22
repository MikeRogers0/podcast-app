SearchView = Backbone.View.extend({
	//el: $("#addFeed"),

	events: {
      "submit"   : "search",
    },

	initialize: function() {
		this.render();
		this.$feedURL = this.$el.find('input[name="feed"]');
		this.$searchResults = this.$el.find('#searchResults');
	},

	render: function(){
		this.$el.html(this.template());

		return this;
	},

	search: function(e){
		e.preventDefault(); // Stop the form going to a hidden page
		
		this.$searchResults.append('<h3>Search Results</h3><ul class="podcastList"><li><a href="/podcasts/http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Ffricomedy%2Frss.xml" style="background-image: url(\'http://www.bbc.co.uk/podcasts/assets/artwork/fricomedy.jpg\');"><div>Friday Night Comedy from BBC Radio 4</div></a></li></ul>');
	}
});