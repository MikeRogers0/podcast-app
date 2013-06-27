/**
 * Used to manage storage of local files.
 */
var FilesCollection = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("FilesCollection-bb"),

	// I this build is allowed to cache, set this to true on PhoneGap Builds.
	canCache: true,
	fileSystem: null,

	initialize: function () {
		var _this = this;
		if(this.canCache){
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
			try{
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){filesItems.onFileSystemSuccess(fileSystem);}, this.onFileSystemFail);
			}catch(e){
				navigator.PersistentStorage = navigator.PersistentStorage|| navigator.webkitPersistentStorage;
				navigator.PersistentStorage.requestQuota(5*1024*1024, function(gb) {
					window.requestFileSystem(window.PERSISTENT, 5*1024*1024, function(fileSystem){filesItems.onFileSystemSuccess(fileSystem);}, this.onFileSystemFail);
				}, _this.errorHandler);
			}	
		}
    },

    onFileSystemSuccess: function(fileSystem){
    	console.log(fileSystem.name);
        console.log(fileSystem.root.name);
        this.fileSystem = fileSystem;
    },

    onFileSystemFail: function(evt){
    	console.log(evt.target.error.code);
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

		console.log('Error: ' + msg);
	},

    getCachedURL: function(url){
		var file = this.where({url:url})[0];

		if(file == null || !file.get('cached')){
			return url;
		}
		return file.get('cacheLocation');
    },

    // Mostly taken from http://css.dzone.com/articles/offline-files-html5-filesystem
    cacheFile: function(url){
    	var _this = this,
    	file = new FileModel({url:url}),
    	xhr = new XMLHttpRequest,
    	name = 'hat.txt',
    	url = url;
    	//name = encodeURIComponent(url);

    	xhr.open('get', url, true);
		xhr.responseType = 'arraybuffer'; // give us an array buffer back please
		xhr.onload = function () {
			var res = this.response,
			_fe = null; // ArrayBuffer!
			_this.fileSystem.root.getFile(name, {create: true}, function (fe) {
				_fe = fe;
				fe.createWriter(function(writer) {
					// create a blob builder to append the data to
					var bb = new Blob([res]);

					writer.onwriteend = function (e) {
						//_fe.toURL()
						debugger;
						//api.flagSynced(fe) // mark as synced in the UI
					}
					//writer.onerror = api.err;

					// append the data and write to the file
					writer.write(bb);
				});
			}, _this.errorHandler);
		};

		xhr.send();
    },

    getFile: function(url){
    	var _this = this,
    	//name = encodeURIComponent(url),
    	name = 'hat.txt';

    	_this.fileSystem.root.getFile(name, {}, function (fe) {
    		debugger;
    	}, _this.errorHandler);
    }
});