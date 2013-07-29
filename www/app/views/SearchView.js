SearchView = Backbone.View.extend({
	events: {
      "submit"   : "search",
    },

	initialize: function() {
		this.render();
		this.$term = this.$el.find('input[name="feed"]');
		this.$searchResults = this.$el.find('#searchResults');
	},

	render: function(){
		this.$el.html(this.template());

		return this;
	},

	addListners: function(){
		this.$el.find('form').on('submit', function(e){
			app.SearchView.renderResults();
			app.SearchView.search(e);
		})
	},

	search: function(e){
		var _this = this;

		e.preventDefault(); // Stop the form going to a hidden page
		
		this.$searchResults.html('<h3>Search Results</h3><ul class="podcastList"></ul>');
		this.$resultsList = this.$searchResults.find('ul');

		this.termValue = this.$term.val();

		// Check if it's a feed url.
		if(this.termValue.indexOf('http://') == 0 || this.termValue.indexOf('https://') == 0){
			podcastItems.addFeed(this.termValue, function(){
				_this.renderResults();
			});
		} else {
			this.ajaxSearch(this.termValue);
			this.renderResults();
		}
		
		//<li><a href="/podcasts/http%3A%2F%2Fdownloads.bbc.co.uk%2Fpodcasts%2Fradio4%2Ffricomedy%2Frss.xml" style="background-image: url(\'http://www.bbc.co.uk/podcasts/assets/artwork/fricomedy.jpg\');"><div>Friday Night Comedy from BBC Radio 4</div></a></li>
	},

	renderResults: function(){
		if(this.termValue == undefined){
			return;
		}
		//$resultsList
		var results = podcastItems.searchAttr(this.termValue, ['title', 'description', 'feedUrl']),
		resultsEl = $();

		// No results? Bye *Waves from a growing distance*.
		if(results == null){
			this.$resultsList.html('Can\'t find anything yet...');
			return;
		}

		this.$resultsList.html('');

		_.each(results, function(result){
			var element = new SearchResultView({model: result});
			this.$resultsList.append(element.$el);
		}, this);
	},

	ajaxSearch: function(query){
		//https://ajax.googleapis.com/ajax/services/feed/find?v=1.0&q=
		var _this = this,
		query = query;

		$.ajax({
            url: 'https://ajax.googleapis.com/ajax/services/feed/find?v=1.0&q='+encodeURIComponent(query),
            dataType: 'jsonp',
            context: this,
            fail: function(data, textStatus, jqXHR){},
            success: function(data, textStatus, jqXHR){
            	if(data.responseData.entries.length > 0){
            		_.each(data.responseData.entries, function(feed){
            			podcastItems.addFeed(feed.url, function(){
            				_this.renderResults();
            			});
            		});
            	}
            },
        });
	},
});