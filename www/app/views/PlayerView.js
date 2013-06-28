PlayerView = Backbone.View.extend({
	model: null,
	startPaused: true,

	events : {
		'change input[name=playbackRate]':'playbackRate',
		'click .back10': 'back10',
		'click .playNext': 'playNext',
	},

	/**
	 * Renders a blank template.
	 */
	initialize: function() {
		// Render the inital blank elements
		this.$el.html(this.template({}));
		this.currentlyPlaying = this.$el.find('#currentlyPlaying');

		// The currently playing bit.
		this.currentlyPlayingView = new CurrentlyPlayingView({model: this.model});
		this.currentlyPlaying.html(this.currentlyPlayingView.el);

		if(globalSettings.get('lastListeningTo') != null){
        	this.model = episodeItems.getByID(globalSettings.get('lastListeningTo'));
        	this.startPaused = true;
        }

		return this;
	},

	initAudioElement: function(){
		var _this = this;
		this.audioElement = this.$el.find('audio').get(0);
		new mediaelementplayer({
			success: function(mediaElement, domObject){
				_this.audioPlayer = mediaElement;
				_this.addListners();
			},
			plugins: ['flash'],
			type: '',
			isVideo: false,
			startVolume: 1,
			features: ['playpause','progress','current','duration','volume'],
			alwaysShowControls: true,
			pluginPath: '/js/vendor/mediaelement/',
			flashName: 'flashmediaelement.swf',
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

	render: function() {
		if(this.model == null){
			return;
		}
		this.currentlyPlayingView.model = this.model;
		this.currentlyPlayingView.render();

		this.audioPlayer.pause();
		this.audioPlayer.setSrc(this.model.get('mp3'));
		this.audioPlayer.setSrc({
			src: filesItems.getFile(this.model.get('mp3')), 
			type: this.model.get('mp3_format')
		});
		this.audioPlayer.load();

        this.model.trigger('loading');
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
		_this = app.Player;
		_this.audioPlayer.currentTime = app.Player.model.get('playhead');

		if(!_this.startPaused){
			_this.audioPlayer.play();
		}
		_this.startPaused = false;

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
		// Just a wrapper.
		_this.playNext();
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
		if(this.audioElement.paused){
			this.audioElement.play();
		} else {
			this.audioElement.pause();
		}

		this.model.trigger('playing');
	},

	/**
	 * Tells someone if the ID they provide is playing or not.
	 */
	isCurrentlyPlaying: function(id){
		if(this.model == null || this.audioElement.paused){
			return false;
		}

		if(this.model.id == id){
			return true;
		}
		return false;
	}
});