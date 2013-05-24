// This is just mock data, this will be pulled from the users DB at some point.

// Add in a few podcasts
podcastItems = new PodcastList([
	new Podcast({
		id: 1, 
		title:'Stuff You Missed in History Class Podcast', 
		feedURL: 'http://www.howstuffworks.com/podcasts/stuff-you-missed-in-history-class.rss'}),
	new Podcast({
		id: 2, 
		title:'Friday Night Comedy from BBC Radio 4', 
		feedURL: 'http://downloads.bbc.co.uk/podcasts/radio4/fricomedy/rss.xml'})
]);

// Add a few epsidoes to these podcasts
var gid = 1;
podcastItems.each(function(podcast){
	for(var id = 1; id <= 3; id++){
		podcast.episodes.add(
			new Episode({id:gid++, title: 'Episode '+id+' of this'})
		);
	}
});

// Now add them to the queue.
queuedItems = new QueueList();

var id = 0;
podcastItems.each(function(podcast){
	podcast.episodes.each(function(episode){
		queuedItems.add(new Queue({id:id++, position:id, podcastID:podcast.get('id'), episodeID: episode.get('id')}));
	});
});