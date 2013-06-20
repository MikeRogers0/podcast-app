/*global Backbone variable */
var app = {};

// Head.js loads in all our libarys async, then excutes the in order.
head.js(
	// Load in any libarys we might want.
	'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', // We might want to ditch this later. For now lets just code.
	'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
	'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js',
	//'//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.9.2/dropbox.min.js',
	'//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.9.2/dropbox.js',
	'/js/vendor/bootstrap.min.js',

	// By default HTML5 audio sucks - http://kolber.github.io/audiojs/ is better.
	//'/js/vendor/audiojs/audio.min.js', // Default is ok for now.

	// A few utils
	'/js/vendor/utils.js',

	// LocalStorage plugin for backbone
	'/js/vendor/backbone.localStorage.js',
	//'/js/vendor/backbone.dropboxStorage.js',
	'/js/vendor/backbone.dropbox.js',

	// Now load up the models
	'/app/models/episode.js',
	'/app/models/podcast.js',
	'/app/models/SettingsModel.js',
	'/app/models/GlobalSettingsModel.js',

	// The collections
	'/app/collections/podcastList.js',
	'/app/collections/episodeList.js',

	// The Views - TODO - swap this into an array of some form, which also manages the associated views.
	'/app/views/EpisodeItemView.js',
	'/app/views/QueueView.js',
	'/app/views/PlayerView.js',
	'/app/views/AddFeedView.js',
	'/app/views/HomeView.js',
	'/app/views/DeviceSyncView.js',
	'/app/views/ClearDataView.js',
	'/app/views/MyPodcastsView.js',
	'/app/views/PodcastView.js',
	'/app/views/PodcastListItemView.js',
	'/app/views/ExploreView.js',
	'/app/views/PodcastEpisodeView.js',
	'/app/views/CurrentlyPlayingView.js',

	// The Routers
	'/app/router/AppRouter.js',

	function(){
		utils.loadTemplate([
			'HomeView', 
			'DeviceSyncView', 
			'EpisodeItemView', 
			'ClearDataView', 
			'AddFeedView', 
			'PlayerView', 
			'QueueView',
			'MyPodcastsView',
			'PodcastView',
			'PodcastListItemView',
			'PodcastEpisodeView',
			'CurrentlyPlayingView',
			'ExploreView'], function() {
			settings = new SettingsModel();
			settings.fetch();

			// Now start the app.
			globalSettings = new GlobalSettingsModel();
			globalSettings.fetch();

			podcastItems = new PodcastList();
			episodeItems = new EpisodeList();

			podcastItems.fetch();
			episodeItems.fetch();

		    app = new AppRouter();
			Backbone.history.start({pushState: true});

			// Stop page reload from http://stackoverflow.com/questions/7640362/preventing-full-page-reload-on-backbone-pushstate
			$("#menu, #player, #content").on('click', 'a:not([data-bypass])', function (e) {
				if($(this).attr('href') == null){
					return;
				}
				e.preventDefault();
				app.navigate($(this).attr('href'), true);
			});

			// If the user is using dropbox
			if(settings.get('dropboxSync')){
				// Authenicate them, then do a sync.
				settings.dropboxAuth(function(){
					// Now trigger the cloud sync - Forcing is bad btw, it's expensive.
					globalSettings.cloudSync('forcePull');
					podcastItems.cloudSync('forcePull');
					episodeItems.cloudSync('forcePull');
				});
			}
		});
	}
);