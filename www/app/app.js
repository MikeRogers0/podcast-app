/*global Backbone variable */
var app = {};

// Head.js loads in all our libarys async, then excutes the in order.
head.js(
	// Load in any libarys we might want.
	'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', // We might want to ditch this later. For now lets just code.
	'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
	'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js',
	'/js/vendor/bootstrap.min.js',

	// By default HTML5 audio sucks - http://kolber.github.io/audiojs/ is better.
	//'/js/vendor/audiojs/audio.min.js', // Default is ok for now.

	// A few utils
	'/js/vendor/utils.js',

	// LocalStorage plugin for backbone
	'/js/vendor/backbone.localStorage.js',

	// Now load up the models
	'/app/models/episode.js',
	'/app/models/podcast.js',

	// The collections
	'/app/collections/podcastList.js',
	'/app/collections/episodeList.js',

	// The Views
	'/app/views/EpisodeItem.js',
	'/app/views/QueueView.js',
	'/app/views/PlayerView.js',
	'/app/views/AddFeedView.js',
	'/app/views/HomeView.js',
	'/app/views/DropboxSyncView.js',
	'/app/views/ClearDataView.js',
	'/app/views/MyPodcastsView.js',
	'/app/views/PodcastView.js',
	'/app/views/PodcastListItemView.js',
	'/app/views/ExploreView.js',

	// The Routers
	'/app/router/AppRouter.js',

	function(){
		utils.loadTemplate([
			'HomeView', 
			'DropboxSyncView', 
			'EpisodeItemView', 
			'ClearDataView', 
			'AddFeedView', 
			'PlayerView', 
			'QueueView',
			'MyPodcastsView',
			'PodcastView',
			'PodcastListItemView',
			'ExploreView'], function() {
			episodeItems = new EpisodeList();
			podcastItems = new PodcastList();
		    
		    // Add some mock data in quickly
		    head.js('/app/mockdata/queue.js', function(){
		    	app = new AppRouter();
		    	Backbone.history.start({pushState: true});

		    	// Stop page reload from http://stackoverflow.com/questions/7640362/preventing-full-page-reload-on-backbone-pushstate
				$("#menu").on('click', 'a:not([data-bypass])', function (e) {
					e.preventDefault();
					app.navigate($(this).attr('href'), true);
				});
		    });

		    
		});
	}
);