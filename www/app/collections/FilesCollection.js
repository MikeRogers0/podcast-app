/**
 * Used to manage storage of local files. This only will work on phonegap builds cause of CORS.
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

		//console.log('Error: ' + msg);
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

    	fileName = file.get('fileName');
    	if(file != null){
    		file.destroy();

	    	this.fileSystem.root.getFile(fileName, {create: true}, function (fe) {
	    		fe.remove(function(){});
	    	}, _this.errorHandler);
    	}
    },

    // Mostly taken from http://css.dzone.com/articles/offline-files-html5-filesystem
    cacheFile: function(url){
    	var _this = this,
    	url = url,
    	fileName = (new Date() * 1)+'-'+ Math.floor((Math.random()*10000)+1) +'.'+(url.split('.').pop());


    	if(!this.canCache){
    		return url;
    	}

    	var fileTest = this.getFile(url);
    	if(fileTest != url){
    		return true;
    	}

    	// TODO: Check we're online rtoo.

    	// Download the file
		var fileTransfer = new FileTransfer();

		fileTransfer.download(url, this.rootFolder+fileName, function(entry) {

	        // It's in the file system, give it a URL we can use.
	        _this.fileSystem.root.getFile(entry.fullPath, {create: true}, function (fe) {
	        	var file = _this.where({url:url})[0];

				if(file != null){

					file.set({
						cacheURL: fe.toURL(),
						fileName: fileName,
						cached: true
					});
					return;
				}

				// Otherwise make it.
				_this.create(new FileModel({
					url: url,
					cacheURL: fe.toURL(),
					fileName: fileName,
					cached: true
				}));
	        }, _this.errorHandler);

	    }, this.errorHandler);
    },
});