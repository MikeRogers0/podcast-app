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
    	alert('Adding feed: '+ feedURL);

    	// TODO - Parse the feed to get it's details, then add it's episodes.
    	// https://code.google.com/p/jsrss/

    	// For now: Just done a create this
    	this.create(new Podcast({
    		title: 'Holder Title',
    		feedURL: feedURL
    	}));
    }
});

var podcastItems = new PodcastList();