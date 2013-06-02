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
            count = '1',
            params = "?v=1.0&num=" + count + "&callback=?&q=" + feedURL,
            url = api + params,
            feedResponse = null;

        var scope = this;

        $.ajax({
            url: url,
            dataType: "JSON",
            success: function(data) {
                scope.create(new Podcast({
                    title: data.responseData.feed.title,
                    feedUrl: data.responseData.feed.feedUrl,
                    description: data.responseData.feed.description,
                    subscribed: false,
                    link: data.responseData.feed.link
                }));
            }
        });
    }
});