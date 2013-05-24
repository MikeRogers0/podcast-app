// This is just mock data, this will be pulled from the users DB at some point.

// Add in a few podcasts
podcastItems.add(
	new Podcast({
		title:'Friday Night Comedy from BBC Radio 4', 
		feedURL: 'http://downloads.bbc.co.uk/podcasts/radio4/fricomedy/rss.xml'})
);
podcastItems.add(new Podcast({
		title:'Stuff You Missed in History Class Podcast', 
		feedURL: 'http://www.howstuffworks.com/podcasts/stuff-you-missed-in-history-class.rss'})
);
// Add a few epsidoes to these podcasts
podcastItems.each(function(podcast){
	for(var id = 1; id <= 3; id++){
		episodeItems.add(new Episode({title: 'Episode '+id+' of this', podcastID: podcast.get('id')}));
	}
});

// Now add them to the queue.
episodeItems.each(function(episode){
	queuedItems.add(new Queue({podcastID:episode.get('podcastID'), episodeID: episode.get('id')}));
});