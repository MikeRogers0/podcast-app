feedUpdater = function(){
	// The callback for when it's done.
	runAgain = function(delay){
		if(delay == null){
			delay = 3000;
		}
		setTimeout(feedUpdater, delay);
	}
	// If it fails to make it to the AJAX thing, just try again in 5 minutes.
	if(!feedUpdaterRun(runAgain)){
		return runAgain(300000);
	}
}

feedUpdaterRun = function(callback){
	// Check were online
	if(!navigator.onLine){
		return false;
	}

	// Get the most out of date feed
	var podcast = podcastItems.getExpiredPodcast();
	if(podcast == null){
		return false;
	}

	// Update it
	podcast.updateEpisodes(callback);
	return true;
}