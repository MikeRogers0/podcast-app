/**
 * Built upon https://github.com/kaosat-dev/Backbone.dropbox 
 * At some ponit i want to rewrite this, but for now it'll be good.
 * I need to make the push & pull more sane at some point.
 * https://www.dropbox.com/developers/core/docs#metadata - use this to do that.
 */
DropBoxStorage = (function() {
  function DropBoxStorage(client) {
    this.client = client;
  }

  DropBoxStorage.prototype.showError = function(error) {
    console.log("error in dropbox");
    switch (error.status) {
      case 401:
        break;
      case 404:
        break;
      case 507:
        break;
      case 503:
        break;
      case 400:
        break;
      case 403:
        break;
      case 405:
        break;
    }
  };

  DropBoxStorage.prototype.sync = function(method, model, options) {
    // Check we are online
    if(!navigator.onLine){
      return false;
    }

    this.options = options;

    switch (method) {
      case 'read':
        //console.log("reading");
        if (model.id != undefined) {
          return this.find(model, options);
        } else {
          return this.findAll(model, options);
        }
        break;
      case 'push':
        return this.itemPush(model, options);
        break;
      case 'pull':
        return this.itemPull(model, options);
        break;
      case 'create':
        //console.log("creating");
        if (!model.id) {
          model.set(model.id, model.idAttribute);
        }
        //console.log("id" + model.url());
        this.writeFile(model.url(), JSON.stringify(model));
        return model.toJSON();
      case 'update':
        //console.log("updating");
        if (model.id != undefined) {
          this.writeFile(model.url(), JSON.stringify(model));
        } else {
          var _this = this;
          _.each(model.models, function(model){
            _this.writeFile(model.url(), JSON.stringify(model));
          });
        }
        return model.toJSON();
      case 'delete':
        //console.log("deleting");
        //console.log(model);
        return this.remove(model.url());
    }
  };



  /**
   * Overwrites dropbox with the stuff on localStorge
   */
  DropBoxStorage.prototype.itemPush = function(model, options){
    var model = model, _this = this;
    // First delete the folder / file
    if(options.force){
      promise = this._remove((model.urlRoot || model.url));
    } else {
      promise = true;
    }
    
    writeData = function(){
      _this.sync('update', model, options);
    }

    return $.when(promise).then(writeData);
  }

  /**
   * Overwrites LocalStoage with the stuff on Dropbox
   */
  DropBoxStorage.prototype.itemPull = function(model, options){
    var model = model, _this = this;
    // First delete the folder / file
    if(options.force == true){
      model.localStorage._clear();
    }
    return _this.sync('read', model, options);
  }

  DropBoxStorage.prototype.find = function(model, options) {
    var parse, path, promise,
      _this = this;
    return _this._readFile(model.url()).then(function(res, metadata) {
        //console.log("gne");
        //console.log(res);
        model.set(JSON.parse(res));
        model.save();
        return true;
        //return console.log(model);
      });
  };

  DropBoxStorage.prototype.findAll = function(model, options) {
    var error, fetchData, promise, promises, rootPath, success,
      _this = this;
    //console.log("searching at " + model.path);
    rootPath = model.path;
    promises = [];
    promise = this._readDir(model.path);
    model.trigger('fetch', model, null, options);
    fetchData = function(entries, metadata) {
      var fileName, filePath, _i, _len;

      // If the folder has not changed since last sync.
      if(options.force != true && (new Date(options.lastPull) > new Date(metadata.modifiedAt))){
        return true;
      }


      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        fileName = entries[_i];
        filePath = "" + rootPath + "/" + fileName;
        //console.log("file path: " + filePath);
        promises.push(_this._readFile(filePath));
      }
      return $.when.apply($, promises).done(function() {
        var results = [], options = _this.options;

        // If there is only 1 object in the response
        if(typeof arguments[1] == 'undefined' || typeof arguments[1].isFile == 'boolean'){
          results[0] = arguments[0];
        } else {
          _.each(arguments, function(result){
            if(options.force == true || (new Date(options.lastPull) < new Date(result[1].modifiedAt))){
              results.push(result[0]);
            }
          });
        }

        results = $.map(results, JSON.parse);
        //console.log("ALL DONE", results);

        // For now just do a hard reset.
        if(options.force == true){
          model.reset(results, {
            collection: model
          });
        }else{
          model.add(results);
        }

        _.each(model.models, function(model){
          model.save();
        });
        return results;
      });
    };
    return $.when(promise).then(fetchData);
  };

  DropBoxStorage.prototype.remove = function(name) {
    return this.client.remove(name, function(error, userInfo) {
      if (error) {
        return showError(error);
      }
      return true;
      //return console.log("removed " + name);
    });
  };

  /**
   * Remove function but with Deferred.
   */
  DropBoxStorage.prototype._remove = function(name) {
    var d,
      _this = this;
    d = $.Deferred();
    this.client.remove(name, function(error, userInfo) {
      //if (error) {
      //  return showError(error);
      //}
      return d.resolve(name);
      //return console.log("removed " + name);
    });
    return d.promise();
  };

  DropBoxStorage.prototype.writeFile = function(name, content) {
    var _this = this;
    return this.client.writeFile(name, content, function(error, stat) {
      if (error) {
        return _this.showError(error);
      }
      return true;
      //return console.log("File saved as revision " + stat.versionTag);
    });
  };

  DropBoxStorage.prototype.createFolder = function(name) {
    var _this = this;
    return this.client.mkdir(name, function(error, stat) {
      if (error) {
        return _this.showError(error);
      }
      return true;
      //return console.log("folder create ok");
    });
  };

  DropBoxStorage.prototype._readDir = function(path) {
    var d,
      _this = this;
    d = $.Deferred();
    this.client.readdir(path, function(error, entries, metadata, headers) {
      if (error) {
        return _this.showError(error);
      }
      return d.resolve(entries, metadata);
    });
    return d.promise();
  };

  DropBoxStorage.prototype._readFile = function(path) {
    var d,
      _this = this;
    d = $.Deferred();
    this.client.readFile(path, function(error, data, metadata, headers) {
      if (error) {
        return _this.showError(error);
      }
      return d.resolve(data, metadata);
    });
    return d.promise();
  };

  DropBoxStorage.prototype._findByName = function(path, name) {
    var d,
      _this = this;
    //console.log(path, name);
    d = $.Deferred();
    this.client.findByName(path, name, function(error, data) {
      if (error) {
        return _this.showError(error);
      }
      //console.log("found data " + data);
      return d.resolve(data);
    });
    return d.promise();
  };

  return DropBoxStorage;

})();