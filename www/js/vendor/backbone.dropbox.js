DropBoxStorage = (function() {
  function DropBoxStorage(client, AuthCallback) {
    this.AuthCallback = AuthCallback;
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
    var id;

    // Check we are online

    switch (method) {
      case 'read':
        console.log("reading");
        if (model.id != undefined) {
          return this.find(model, options);
        } else {
          return this.findAll(model, options);
        }
        break;
      case 'forcePush':
        return this.forcePush(model, options);
        break;
      case 'forcePull':
        return this.forcePull(model, options);
        break;
      case 'create':
        console.log("creating");
        if (!model.id) {
          model.set(model.id, model.idAttribute);
        }
        console.log("id" + model.url());
        this.writeFile(model.url(), JSON.stringify(model));
        return model.toJSON();
      case 'update':
        console.log("updating");
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
        console.log("deleting");
        console.log(model);
        return this.remove(model.url());
    }
  };



  /**
   * Overwrites dropbox with the stuff on localStorge
   */
  DropBoxStorage.prototype.forcePush = function(model, options){
    var model = model, _this = this;
    // First delete the folder / file
    promise = this._remove((model.urlRoot || model.url));
    writeData = function(){
      _this.sync('update', model, options);
    }

    return $.when(promise).then(writeData);
  }

  /**
   * Overwrites LocalStoage with the stuff on Dropbox
   */
  DropBoxStorage.prototype.forcePull = function(model, options){
    var model = model, _this = this;
    // First delete the folder / file
    model.localStorage._clear();
    return _this.sync('read', model, options);
  }

  DropBoxStorage.prototype.find = function(model, options) {
    var parse, path, promise,
      _this = this;
    return _this._readFile(model.url()).then(function(res) {
        console.log("gne");
        console.log(res);
        model.set(JSON.parse(res));
        model.save();
        return console.log(model);
      });
  };

  DropBoxStorage.prototype.findAll = function(model, options) {
    var error, fetchData, promise, promises, rootPath, success,
      _this = this;
    console.log("searching at " + model.path);
    rootPath = model.path;
    promises = [];
    promise = this._readDir(model.path);
    model.trigger('fetch', model, null, options);
    fetchData = function(entries) {
      var fileName, filePath, _i, _len;
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        fileName = entries[_i];
        filePath = "" + rootPath + "/" + fileName;
        console.log("file path: " + filePath);
        promises.push(_this._readFile(filePath));
      }
      return $.when.apply($, promises).done(function() {
        var results;
        results = arguments;
        results = $.map(results, JSON.parse);
        console.log("ALL DONE", results);

        // For now just do a hard reset.
        model.reset(results, {
          collection: model
        });

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
      return console.log("removed " + name);
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
      return console.log("File saved as revision " + stat.versionTag);
    });
  };

  DropBoxStorage.prototype.createFolder = function(name) {
    var _this = this;
    return this.client.mkdir(name, function(error, stat) {
      if (error) {
        return _this.showError(error);
      }
      return console.log("folder create ok");
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
      return d.resolve(entries);
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
      return d.resolve(data);
    });
    return d.promise();
  };

  DropBoxStorage.prototype._findByName = function(path, name) {
    var d,
      _this = this;
    console.log(path, name);
    d = $.Deferred();
    this.client.findByName(path, name, function(error, data) {
      if (error) {
        return _this.showError(error);
      }
      console.log("found data " + data);
      return d.resolve(data);
    });
    return d.promise();
  };

  return DropBoxStorage;

})();