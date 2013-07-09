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
				/*navigator.PersistentStorage = navigator.PersistentStorage|| navigator.webkitPersistentStorage;
				navigator.PersistentStorage.requestQuota(8000*1024*1024, function(gb) {
					window.requestFileSystem(window.PERSISTENT, 0, function(fileSystem){filesItems.onFileSystemSuccess(fileSystem);}, this.onFileSystemFail);
				}, _this.errorHandler);*/
			}catch(e){
				alert('Cant cache'+e);
				this.canCache = false; // We're not on mobile, no fancie caching for us.
			}	
		}
    },

    onFileSystemSuccess: function(fileSystem){
        this.fileSystem = fileSystem;
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
    	xhr = new XMLHttpRequest,
    	url = url,
    	_xhr = null;
    	name = encodeURIComponent(url);

    	if(!this.canCache){
    		return url;
    	}

    	var fileTest = this.getFile(url);
    	if(fileTest != url){
    		return true;
    	}

    	// TODO: Check we're online rtoo.

    	alert('Caching File: '+url);

    	xhr.open('get', url, true);
		xhr.responseType = 'arraybuffer'; // give us an array buffer back please
		xhr.onload = function () {
			var res = this.response, // ArrayBuffer!
			_fe = null,
			_xhr = this; 

			_this.fileSystem.root.getFile(name, {create: true}, function (fe) {
				_fe = fe,
				_xhr = _xhr;
				fe.createWriter(function(writer) {
					// create a blob builder to append the data to
					var bb = new Blob([res], {'type':_xhr.getResponseHeader('Content-Type')});

					writer.onwriteend = function (e) {
						// If the url already exits update it
						var file = _this.where({url:url})[0];

						alert('Cached: '+_fe.toURL());

						if(file != null){

							file.set({
								cacheURL: _fe.toURL(),
								cached: true
							});
							return;
						}

						// Otherwise make it.
						_this.create(new FileModel({
							url: url,
							cacheURL: _fe.toURL(),
							cached: true
						}));
						
						//api.flagSynced(fe) // mark as synced in the UI
					};
					writer.onerror = function(e){
						alert(e);
					};

					// Go to end of file.
					//writer.seek(writer.length);

					// append the data and write to the file
					writer.write(bb);
				});
			}, _this.errorHandler);
		};

		xhr.send();
    },
});