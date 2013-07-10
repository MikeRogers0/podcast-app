PlayerView = Backbone.View.extend({
	model: null,
	startPaused: false,

	events : {
		'change input[name=playbackRate]':'playbackRate',
	},

	/**
	 * Renders a blank template.
	 */
	initialize: function() {
		// Render the inital blank elements
		this.renderBlank();

		if(globalSettings.get('lastListeningTo') != null){
        	this.model = episodeItems.getByID(globalSettings.get('lastListeningTo'));
        	this.startPaused = true;
        }

		return this;
	},

	renderBlank: function(){
		if(this.audioPlayer != undefined && typeof this.audioPlayer.remove == "function"){
			this.audioPlayer.pause();
			this.audioPlayer.remove();
		}

		this.$el.html(this.template({}));
		this.currentlyPlaying = this.$el.find('#currentlyPlaying');

		// The currently playing bit.
		this.currentlyPlayingView = new CurrentlyPlayingView({model: this.model});
		this.currentlyPlaying.html(this.currentlyPlayingView.el);

		// Resetup the audio 
		this.audioElement = this.$el.find('audio');
		this.audioElementRaw = this.audioElement.get(0);
	},

	render: function(){
		var _this = this;
		this.renderBlank();

		if(!this.loadtrack()){
			this.startPaused = false;
			return;
		}

		this.audioElement.mediaelementplayer({
			success: function(mediaElement, domObject){
				_this.audioPlayer = mediaElement;
				_this.addListners();

				_this.audioPlayer.load();
			},
			error: function(e){
				//debugger;
			},
			skip:function(){
				_this.playNext();
			},
			back10: function(){
				_this.back10();
			},
			plugins: ['silverlight', 'flash'],
			type: '',
			isVideo: false,
			startVolume: 1,
			features: ['playpause','progress','back10', 'duration', 'skip'],
			alwaysShowControls: true,
			pluginPath: '/js/vendor/mediaelement/',
			flashName: 'flashmediaelement.swf',
			silverlightName: 'silverlightmediaelement.xap',
		});
	},

	addListners: function(){

		// Listeners so the model is updated.
        this.audioPlayer.addEventListener('timeupdate', this.currentTime);
        this.audioPlayer.addEventListener('loadedmetadata', this.loadedmetadata);
        this.audioPlayer.addEventListener('pause', this.pause);
        this.audioPlayer.addEventListener('playing', this.pause);
        this.audioPlayer.addEventListener('ended', this.ended);
        this.audioPlayer.addEventListener('canplay', this.canplay);
        this.audioPlayer.addEventListener('waiting', this.waiting);
	},

	/**
	 * Changes the source of the media element.
	 */
	loadtrack: function() {
		if(this.model == null){
			return false;
		}

		this.audioElementRaw.src = filesItems.getFile(this.model.get('mp3'));
		
        this.model.trigger('loading');

        return true;
	},

	back10: function(){
		var newTime = this.audioPlayer.currentTime - 10;
		if(newTime >= 1){
			this.audioPlayer.currentTime = newTime;
			return ;
		}
		this.audioPlayer.currentTime = 1;
	},

	playbackRate: function(){
		this.audioPlayer.playbackRate= this.$el.find('input[name=playbackRate]').val();
	},

	canplay: function(e){
		_this = app.Player;

		_this.audioPlayer.play();
		if(_this.startPaused){
			_this.audioPlayer.pause();
		}
		_this.startPaused = false;
		_this.audioPlayer.setCurrentTime(app.Player.model.get('playhead'));

        // Reset the last listened to.
        globalSettings.set('lastListeningTo', _this.model.get('id'));

		// Quickly trigger the playrate. 
		_this.$el.find('input[name=playbackRate]').trigger('change');

		_this.model.trigger('playing');
	},
	// This function causes the play/pause buttons to fail, it updates to fast.
	currentTime: function(e){
		_this = app.Player;

		// If it's not the first 10 seconds igonre this.
		if(_this.audioPlayer.currentTime <= 10){
			return;
		}
		_this.model.set('playhead', _this.audioPlayer.currentTime);
	},
	pause: function(e){
		_this = app.Player;
		_this.model.set('playhead', _this.audioPlayer.currentTime);
		_this.model.trigger('playing');

		// trigger a sync to dropbox
		settings.dropboxPush();
	},
	waiting: function(e){
		_this = app.Player;
		_this.model.trigger('loading');
	},
	loadedmetadata: function(e){
		_this = app.Player;
		_this.model.set('duration', _this.audioPlayer.duration);

		// trigger a sync to dropbox
		settings.dropboxPush();
	},

	/**
	 * Item has come to an end. Mark it as played etc then move on
	 */
	ended: function(e){
		_this = app.Player;

		_this.model.set({'listened': true});
		_this.model.set({'playhead': 0}); // reset the playhead
		// Just a wrapper.
		_this.playNext();
	},

	playNext: function(){
		// Make a note on the last model, so we can ping it.
		var oldModel = this.model;

		// Ok, it's over. Lets load up the next one.
		this.model = episodeItems.getNextInQueue();

		// If there isn't anything new
		if(this.model == null){
			this.audioPlayer.pause();
			this.renderBlank();
		} else {
			this.render();
		}
		
		if(oldModel != null){
			oldModel.trigger('playing');

			// Unqueue it
			oldModel.set('queued', false);
		}

		// trigger a sync to dropbox
		settings.dropboxPush();
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
		if(this.model == null || this.audioPlayer == undefined || (this.audioPlayer != undefined && this.audioPlayer.paused)){
			return false;
		}

		if(this.model.id == id){
			return true;
		}
		return false;
	}
});