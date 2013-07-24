/*global Backbone variable */
var app = {};

// Head.js loads in all our libarys async, then excutes the in order.
head.js(
	// Load in any libarys we might want.
	'js/vendor/jquery.min.js', // We might want to ditch this later. For now lets just code.
	'js/vendor/underscore-min.js',
	'js/vendor/backbone-min.js',
	'js/vendor/jquery-ui-1.10.3.custom.min.js',
	'js/vendor/jquery.ui.touch-punch.min.js',
	//'//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.9.2/dropbox.min.js',
	'js/vendor/dropbox.js',
	'js/vendor/date.format.js',
	'js/vendor/fastclick.js',

	// By default HTML5 audio sucks - http://mediaelementjs.com/#howitworks - is way better.
	'js/vendor/mediaelement/mediaelement-and-player.min.js',
	'js/vendor/mediaelement/src/mediaelement-back10.js',
	'js/vendor/mediaelement/src/mediaelement-skip.js',

	// A few utils
	'js/vendor/utils.js',

	// LocalStorage plugin for backbone
	'js/vendor/backbone.localStorage.js',
	'js/vendor/backbone.dropbox.js',

	// Now load up the models
	'app/models/CloudModel.js',
	'app/models/EpisodeModel.js',
	'app/models/PodcastModel.js',
	'app/models/SettingsModel.js',
	'app/models/GlobalSettingsModel.js',
	'app/models/FileModel.js',

	// The collections
	'app/collections/CloudCollection.js',
	'app/collections/PodcastCollection.js',
	'app/collections/EpisodeCollection.js',
	'app/collections/FilesCollection.js',

	// The Views - TODO - swap this into an array of some form, which also manages the associated views.
	'app/views/PodcastItemView.js',
	'app/views/QueueItemView.js',
	'app/views/QueueView.js',
	'app/views/PlayerView.js',
	'app/views/AddFeedView.js',
	'app/views/HomeView.js',
	'app/views/DeviceSyncView.js',
	'app/views/ClearDataView.js',
	'app/views/MyPodcastsView.js',
	'app/views/PodcastView.js',
	'app/views/PodcastListItemView.js',
	'app/views/CurrentlyPlayingView.js',
	'app/views/SearchView.js',
	'app/views/SearchResultView.js',

	// The Routers
	'app/router/AppRouter.js',

	// The Crons
	'app/crons/feedUpdater.js',

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
			'CurrentlyPlayingView',
			'SearchView', 'SearchResultView'], function() {

    		FastClick.attach(document.body);

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
			Backbone.history.start({
				//pushState: ( location.protocol == 'http:'? true : false ), // Use hashbangs on mobile.
				pushState: true,
				root: ( location.protocol == 'http:'? '/' : location.pathname ) // Mobile apps use file:// and don't have a sane root.
			});

			// Stop page reload from http://stackoverflow.com/questions/7640362/preventing-full-page-reload-on-backbone-pushstate
			$("#menu, #player, #content, #left, #right").on('click', 'a:not([data-bypass], [target="_blank"])', function (e) {
				if($(this).attr('href') == null){
					return;
				}
				e.preventDefault();
				app.navigate($(this).attr('href'), true);
			});

			// Add the listner for the menu
			$('#menuLink').on('click', function(e){
				e.preventDefault();

				if($("#navMenu").hasClass('open')){
					$("#navMenu").removeClass('open');
				}else{
					$("#navMenu").addClass('open');
				}

				return true;
			});

			// When the nav is clicked, hide it.
			$("#navMenu").on('click', function(){
				$("#navMenu").removeClass('open');
			});

			// If the user is using dropbox
			if(settings.get('dropboxSync')){
				// Authenicate them, then do a sync.
				settings.dropboxAuth(function(){
					settings.dropboxPull();
				});
			}

			// After 2 minutes the feeds will start updating.
			setTimeout(feedUpdater, 5000);
		});
	}
);