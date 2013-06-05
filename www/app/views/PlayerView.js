PlayerView = Backbone.View.extend({
	model: null,

	events : {
		'change input[name=playbackRate]':'playbackRate',
		'click .back10': 'back10',
		'click .playNext': 'playNext',
	},

	initialize: function() {
		// Render the inital blank elements
		this.$el.html(this.template({}));
		this.currentlyPlaying = this.$el.find('#currentlyPlaying');
		this.audioPlayer = this.$el.find('audio').get(0);

		// The currently playing bit.
		this.currentlyPlayingView = new CurrentlyPlayingView({model: this.model});
		this.currentlyPlaying.html(this.currentlyPlayingView.el);

		// Listeners so the model is updated.
        this.audioPlayer.addEventListener('timeupdate', this.currentTime);
        this.audioPlayer.addEventListener('loadedmetadata', this.loadedmetadata);
        this.audioPlayer.addEventListener('pause', this.pause);
        this.audioPlayer.addEventListener('playing', this.pause);
        this.audioPlayer.addEventListener('ended', this.ended);
        this.audioPlayer.addEventListener('canplay', this.canplay);
        this.audioPlayer.addEventListener('waiting', this.waiting);
	},

	render: function() {
		this.currentlyPlayingView.model = this.model;
		this.currentlyPlayingView.render();

		this.audioPlayer.src = this.model.get('mp3');
		this.audioPlayer.load();

        this.model.trigger('loading');

        /* Some other API references we might want to use. */
        //this.audioPlayer.playbackRate=1.5; // For faster listening
        //this.audioPlayer.duration // The duration of the audio.
        //this.audioPlayer.ended // When it's over
        //this.audioPlayer.error
        //this.audioPlayer.currentTime // gets the current place of the audio.
        //this.audioPlayer.muted // if the audio is muted 
	},

	back10: function(){
		var newTime = this.audioPlayer.currentTime - 10;
		if(newTime >= 1){
			this.audioPlayer.currentTime = newTime;
			return ;
		}
		this.audioPlayer.currentTime = 1;
	},

	playNext: function(){
		this.playNext();
	},

	playbackRate: function(){
		this.audioPlayer.playbackRate= this.$el.find('input[name=playbackRate]').val();
	},

	canplay: function(e){
		e.srcElement.currentTime = app.Player.model.get('playhead');
		e.srcElement.play();

		// Quickly trigger the playrate. TODO - remember last epsiode setting in podcast.
		app.Player.$el.find('input[name=playbackRate]').trigger('change');

		app.Player.model.trigger('playing');
	},
	// This function causes the play/pause buttons to fail, it updates to fast.
	currentTime: function(e){
		// If it's not the first 10 seconds igonre this.
		if(e.srcElement.currentTime <= 10){
			return;
		}
		app.Player.model.set('playhead', e.srcElement.currentTime);
	},
	pause: function(e){
		app.Player.model.set('playhead', e.srcElement.currentTime);
		app.Player.model.trigger('playing');
	},
	waiting: function(e){
		this.model.trigger('loading');
	},
	loadedmetadata: function(e){
		//debugger;
		app.Player.model.set('duration', e.srcElement.duration);
	},

	/**
	 * Item has come to an end. Mark it as played etc then move on
	 */
	ended: function(e){
		// Just a wrapper.
		app.Player.playNext();
	},

	playNext: function(){
		// Make a note on the last model, so we can ping it.
		var oldModel = this.model;

		// Ok, it's over. Lets load up the next one.
		this.model = episodeItems.getNextInQueue();
		
		if(this.model != null){
			this.render();
		}
		if(oldModel != null){
			oldModel.trigger('playing');

			// Unqueue it
			oldModel.set('queued', false);
		}
	},

	/**
	 * Updates the model being used in the player.
	 */
	playPause: function(model){
		// If there is nothing already or it's a new model.
		if(this.model == null){
			this.model = model;
			this.render();
			return;
		}

		if(this.model.id != model.id){
			var oldModel = this.model;
			this.model = model;
			this.render();
			oldModel.trigger('playing');
			return;
		}

		// It's the same episode I guess:
		if(this.audioPlayer.paused){
			this.audioPlayer.play();
		} else {
			this.audioPlayer.pause();
		}

		this.model.trigger('playing');
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