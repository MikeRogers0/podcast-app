// This is just mock data, this will be pulled from the users DB at some point.

// Add in a few podcasts
podcastItems.add([
	new Podcast({
		title:'Stuff You Missed in History Class Podcast', 
		feedURL: 'http://www.howstuffworks.com/podcasts/stuff-you-missed-in-history-class.rss'}),
	new Podcast({
		title:'Friday Night Comedy from BBC Radio 4', 
		feedURL: 'http://downloads.bbc.co.uk/podcasts/radio4/fricomedy/rss.xml'})
]);

// Add a few epsidoes to these podcasts
podcastItems.each(function(podcast){
	for(var id = 1; id <= 3; id++){
		podcast.episodes.add(
			new Episode({title: 'Episode '+id+' of this'})
		);
	}
});

// Now add them to the queue.

var id = 0;
podcastItems.each(function(podcast){
	podcast.episodes.each(function(episode){
		queuedItems.add(new Queue({id:id++, position:id, podcastID:podcast.get('id'), episodeID: episode.get('id')}));
	});
});