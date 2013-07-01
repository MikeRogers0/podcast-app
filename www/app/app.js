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

	// By default HTML5 audio sucks - http://mediaelementjs.com/#howitworks - is way better.
	'/js/vendor/mediaelement/mediaelement-and-player.min.js',

	// A few utils
	'/js/vendor/utils.js',

	// LocalStorage plugin for backbone
	'/js/vendor/backbone.localStorage.js',
	'/js/vendor/backbone.dropbox.js',

	// Now load up the models
	'/app/models/CloudModel.js',
	'/app/models/EpisodeModel.js',
	'/app/models/PodcastModel.js',
	'/app/models/SettingsModel.js',
	'/app/models/GlobalSettingsModel.js',
	'/app/models/FileModel.js',

	// The collections
	'/app/collections/CloudCollection.js',
	'/app/collections/PodcastCollection.js',
	'/app/collections/EpisodeCollection.js',
	'/app/collections/FilesCollection.js',

	// The Views - TODO - swap this into an array of some form, which also manages the associated views.
	'/app/views/PodcastItemView.js',
	'/app/views/QueueItemView.js',
	'/app/views/QueueView.js',
	'/app/views/PlayerView.js',
	'/app/views/AddFeedView.js',
	'/app/views/HomeView.js',
	'/app/views/DeviceSyncView.js',
	'/app/views/ClearDataView.js',
	'/app/views/MyPodcastsView.js',
	'/app/views/PodcastView.js',
	'/app/views/PodcastListItemView.js',
	'/app/views/CurrentlyPlayingView.js',

	// The Routers
	'/app/router/AppRouter.js',

	function(){
		utils.loadTemplate([
			'HomeView', 
			'DeviceSyncView',
			'PodcastItemView',  
			'QueueItemView', 
			'ClearDataView', 
			'AddFeedView', 
			'PlayerView', 
			'QueueView',
			'MyPodcastsView',
			'PodcastView',
			'PodcastListItemView',
			'CurrentlyPlayingView'], function() {
			settings = new SettingsModel();
			settings.fetch();

			// Now start the app.
			globalSettings = new GlobalSettingsModel();
			globalSettings.fetch();

			filesItems = new FilesCollection();
			filesItems.fetch();

			podcastItems = new PodcastCollection();
			episodeItems = new EpisodeCollection();

			podcastItems.fetch();
			episodeItems.fetch();

		    app = new AppRouter();
			Backbone.history.start({pushState: true});

			// Stop page reload from http://stackoverflow.com/questions/7640362/preventing-full-page-reload-on-backbone-pushstate
			$("#menu, #player, #content").on('click', 'a:not([data-bypass], [target="_blank"])', function (e) {
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
					settings.dropboxPull();
				});
			}

			// Load in the crons
			head.js('/app/crons/feedUpdater.js', function(){
				// After 2 minutes the feeds will start updating.
				setTimeout(feedUpdater, 60000);
			});
		});
	}
);