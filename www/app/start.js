startApp = function(){
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

	// Now trigger the cloud sync - Forcing is bad btw, it's expensive.
	globalSettings.cloudSync('forcePull');
	podcastItems.cloudSync('forcePull');
	episodeItems.cloudSync('forcePull');
}