var PodcastList = Backbone.Collection.extend({
	model: Podcast,

	localStorage: new Backbone.LocalStorage("PodcastList-bb"),
	
	getByID: function(id){
		return this.where({id:id})[0];
    },
    nextID: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
    },
    addFeed: function(feedURL){

    	// TODO - Parse the feed to get it's details, then add it's episodes.
        // Poss TODO - write & host API for this on cloud (EC2?) rather than rely on google
        var api = "https://ajax.googleapis.com/ajax/services/feed/load",
            count = '5',
            params = "?v=1.0&num=" + count + "&callback=?&q=" + feedURL,
            url = api + params;

        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                console.log(data.responseData.feed);
                // Not quite sure how to get this data down to the function below.
                // tried a few things, but only 3am tried... working personal projects
                // in afternoon in bonzo, so im working on getting this RSS working :)
                createPodcast(data.responseData.feed);
            }
        });

    	function createPodcast(feed) {
        	this.create(new Podcast({
        		title: feed.title,
        		feedURL: feed.feedURL
        	}));
        };
    }
});