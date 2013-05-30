PlayerView = Backbone.View.extend({
	currentlyPlaying: $("#currentlyPlaying"),
	player: $('#player'),
	model: null,

	initialize: function() {
		//this.as = audiojs.createAll();
		this.audioPlayer = document.getElementsByTagName('audio')[0];

		// Listeners so the model is updated.
        this.audioPlayer.addEventListener('timeupdate', this.currentTime);
        this.audioPlayer.addEventListener('loadedmetadata', this.loadedmetadata);
        this.audioPlayer.addEventListener('ended', this.ended);
        this.audioPlayer.addEventListener('canplay', this.canplay);

        if(this.model != null){
        	this.render();
        }
	},

	render: function() {
		this.audioPlayer.src = this.model.get('mp3');
		this.audioPlayer.load();

		this.currentlyPlaying.html(this.template({
            playhead: this.model.get('playhead'),
            duration: this.model.get('duration'),
            episode_title: this.model.get('title'), 
            podcast_title: this.model.podcast.get('title')
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
		e.srcElement.currentTime = app.Player.model.get('playhead');
		e.srcElement.play();
	},

	currentTime: function(e){
		app.Player.model.set('playhead', e.srcElement.currentTime);
	},
	loadedmetadata: function(e){
		//debugger;
		app.Player.model.set('duration', e.srcElement.duration);
	},
	ended: function(e){
		//debugger;
	},

	/**
	 * Updates the model being used in the player.
	 */
	playPause: function(model){
		// If there is nothing already or it's a new model.
		if(this.model == null || this.model.id != model.id){
			var oldModel = this.model;
			this.model = model;
			this.render();
			oldModel.trigger('change');
			return;
		}

		// It's the same episode I guess:
		if(this.audioPlayer.paused){
			this.audioPlayer.play();
		} else {
			this.audioPlayer.pause();
		}
	},

	/**
	 * Tells someone if the ID they provide is playing or not.
	 */
	isCurrentlyPlaying: function(id){
		if(this.model == null || this.audioPlayer.paused){
			return false;
		}

		if(this.model.id == id){
			return true;
		}
		return false;
	}
});