PlayerView = Backbone.View.extend({
	currentlyPlaying: $("#currentlyPlaying"),
	player: $('#player'),

	initialize: function() {
		//this.as = audiojs.createAll();
		this.audioPlayer = document.getElementsByTagName('audio')[0];

		this.listenTo(Player, 'change:episodeID', this.render);
		this.listenTo(Player, 'change:playing', this.playPause);

		// Listeners so the model is updated.
        this.audioPlayer.addEventListener('timeupdate', this.currentTime);
        this.audioPlayer.addEventListener('loadedmetadata', this.loadedmetadata);
        this.audioPlayer.addEventListener('ended', this.ended);
        this.audioPlayer.addEventListener('canplay', this.canplay);
	},

	render: function() {
		this.audioPlayer.src = Player.model.get('mp3');
		this.audioPlayer.load();

		this.currentlyPlaying.html(this.template({
            playhead: Player.model.get('playhead'),
            duration: Player.model.get('duration'),
            episode_title: Player.model.get('title'), 
            podcast_title: Player.model.podcast.get('title')
        }));

        /* Some other API references we might want to use. */
        //this.audioPlayer.playbackRate=1.5; // For faster listening
        //this.audioPlayer.duration // The duration of the audio.
        //this.audioPlayer.ended // When it's over
        //this.audioPlayer.error
        //this.audioPlayer.currentTime // gets the current place of the audio.
        //this.audioPlayer.muted // if the audio is muted 
	},

	canplay: function(e){
		e.srcElement.currentTime = Player.model.get('playhead');
		e.srcElement.play();
	},

	currentTime: function(e){
		Player.model.set('playhead', e.srcElement.currentTime);
	},
	loadedmetadata: function(e){
		//debugger;
		Player.model.set('duration', e.srcElement.duration);
	},
	ended: function(e){
		//debugger;
	},

	/**
	 * Updates the model being used in the player.
	 */
	playPause: function(model){
		debugger;
		//if(Player.model.get('playing') == false){
		//	this.audioPlayer.pause();
		//} else {
		//	this.audioPlayer.play();
		//}
	}
});