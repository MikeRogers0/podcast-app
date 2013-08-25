/**
 * Used to manage storage of local files. This only will work on phonegap builds cause of CORS.
 * This needs to queue download instead of all at once.
 */
FilesCollection = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("FilesCollection-bb"),
	model: FileModel,

	// I this build is allowed to cache, set this to true on PhoneGap Builds.
	canCache: true,
	fileSystem: null,

	initialize: function () {
		var _this = this;
		
		if(this.canCache){
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
			try{
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
					_this.onFileSystemSuccess(fileSystem);
				}, this.onFileSystemFail);
			}catch(e){
				this.canCache = false; // We're not on mobile, no fancie caching for us.
			}	
		}
    },

    onFileSystemSuccess: function(fileSystem){
        this.fileSystem = fileSystem;
        this.canCache = true;

        this.rootFolder = this.fileSystem.root.fullPath+'/';
        this.appFoler = 'Android/data/com.mikerogers.podcastapp/';
    },

    onFileSystemFail: function(evt){
    	//alert(evt);
    	//console.log(evt.target.error.code);
    	filesItems.canCache = false;
    },

	errorHandler: function(e) {
		var msg = '';

		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
			msg = 'QUOTA_EXCEEDED_ERR';
			break;
			case FileError.NOT_FOUND_ERR:
			msg = 'NOT_FOUND_ERR';
			break;
			case FileError.SECURITY_ERR:
			msg = 'SECURITY_ERR';
			break;
			case FileError.INVALID_MODIFICATION_ERR:
			msg = 'INVALID_MODIFICATION_ERR';
			break;
			case FileError.INVALID_STATE_ERR:
			msg = 'INVALID_STATE_ERR';
			break;
			default:
			msg = 'Unknown Error';
			break;
		};

		alert('Error: ' + msg);
	},

	errorCordovaHandler: function(e) {

		alert('PhoneGap Error: ' + e.code);

		//console.log('Error: ' + msg);
	},

	clearAll: function(){
		var _this = this;
		_.each(this.models, function(model){
			_this.remove(model);
		});
	},

    getFile: function(url){
    	if(!this.canCache){
    		return url;
    	}
    	
		var file = this.where({url:url})[0];

		if(file == null || !file.get('cached')){
			return url;
		}
		return file.get('cacheURL');
    },

    removeFile: function(url){
    	var _this = this,
    	fileName = null;

    	if(!this.canCache){
    		return url;
    	}

    	file = this.where({url:url})[0];

    	this.remove(file);
    },

    remove: function(model){
    	if(model != null){
    		fileName = model.get('fileName');
    		model.destroy();

	    	this.fileSystem.root.getFile(this.rootFolder+this.appFoler+fileName, {create: true}, function (fe) {
	    		fe.remove(function(){});
	    	}, _this.errorHandler);
    	}
    },

    // Mostly taken from http://css.dzone.com/articles/offline-files-html5-filesystem
    cacheFile: function(url){
    	var _this = this,
    	url = url;


    	if(!this.canCache){
    		return false;
    	}

    	var file = this.where({url:url})[0];

    	// If the file is already in the process of being cached.
    	if(file != null){
    		return true;
    	}

    	// Otherwise, add the model and queue it to be downloaded.
    	var fileName = (new Date() * 1)+'-'+ Math.floor((Math.random()*10000)+1) +'.'+(url.split('.').pop());

    	var model = _this.create(new FileModel({
			url: url,
			cacheURL: null,
			fileName: fileName,
			filePath: _this.appFoler+fileName,
			cached: false
		}));

		QueueTask.add(function(callback){
			_this.downloadFile(model, callback);
			return false;
		});
    },

    downloadFile: function(model, callback){
    	var file = model,
    		fileName = file.get('fileName'),
    		_this = this;

    	// Download the file
		var fileTransfer = new FileTransfer();

		fileTransfer.download(url, this.rootFolder+this.appFoler+fileName, function(entry) {
	        // It's in the file system, give it a URL we can use.
	        _this.fileSystem.root.getFile(_this.appFoler+fileName, {create: false}, function (fe) {
	        	var file = _this.where({url:url})[0];
	        	var localURL = fe.toURL();

	        	// Quick fix for Android on Cordova to server from HTTP:// not FILE://
	        	if(localURL.indexOf('file://') == 0 && localURL.indexOf('file://localhost/') == -1){
	        		splitURL = localURL.split(_this.appFoler);
	        		localURL = 'http://127.0.0.1:8080/'+splitURL[1];
	        	}       	

				if(file != null){

					file.set({
						cacheURL: localURL,
						fileName: fileName,
						filePath: _this.appFoler+fileName,
						cached: true
					});
					return;
				}
	        }, _this.errorHandler);

	    }, this.errorCordovaHandler);
    },
});