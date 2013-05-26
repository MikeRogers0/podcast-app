CurrentPlayingView = Backbone.View.extend({
	currentlyPlaying: $("#currentlyPlaying"),
	player: $('#player'),

	currentlyPlayingTemplate: _.template($('#currentlyPlaying-template').html()),

	initialize: function() {
		this.listenTo(Player, 'change:episodeID', this.render);
		this.listenTo(Player, 'change:playing', this.playPause);
		this.as = audiojs.createAll();
		this.audioPlayer = this.as[0];
	},

	render: function() {
		this.audioPlayer.load(Player.model.get('mp3'));
		this.audioPlayer.currentTime = Player.model.get('playhead');
		this.audioPlayer.play();

		this.currentlyPlaying.html(this.currentlyPlayingTemplate({
            playhead: Player.model.get('playhead'),
            duration: Player.model.get('duration'),
            episode_title: Player.model.get('title'), 
            podcast_title: Player.model.podcast.get('title')
        }));
	},

	playPause: function(){
		if(Player.model.get('playing') == false){
			this.audioPlayer.pause();
		} else {
			this.audioPlayer.play();
		}
	}
});

var CurrentPlaying = new CurrentPlayingView();