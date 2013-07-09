/**
 * Used to manage storage of local files.
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
				alert('Cant cache'+e);
				this.canCache = false; // We're not on mobile, no fancie caching for us.
			}	
		}
    },

    onFileSystemSuccess: function(fileSystem){
        this.fileSystem = fileSystem;
        this.canCache = true;

        this.rootFolder = this.fileSystem.root.fullPath+'/com.mikerogers.podcastapp/';
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

		//alert('Error: ' + msg);

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
    	name = encodeURIComponent(url);

    	if(!this.canCache){
    		return url;
    	}

    	file = this.where({url:url})[0];
    	if(file != null){
    		file.destroy();

	    	this.fileSystem.root.getFile(name, {create: true}, function (fe) {
	    		fe.remove(function(){});
	    	}, _this.errorHandler);
    	}
    },

    // Mostly taken from http://css.dzone.com/articles/offline-files-html5-filesystem
    cacheFile: function(url){
    	var _this = this,
    	url = url,
    	name = encodeURIComponent(url);

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

		fileTransfer.download(url, this.rootFolder+name, function(entry) {
	        console.log("download complete: " + entry.fullPath);

	        var file = _this.where({url:url})[0];

			if(file != null){

				file.set({
					cacheURL: entry.fullPath,
					cached: true
				});
				return;
			}

			// Otherwise make it.
			_this.create(new FileModel({
				url: url,
				cacheURL: entry.fullPath,
				cached: true
			}));

	    },
	    function(error) {
	        console.log("download error source " + error.source);
	        console.log("download error target " + error.target);
	        console.log("upload error code" + error.code);
	        //alert('some error.'+error.code);
	    });
    },
});