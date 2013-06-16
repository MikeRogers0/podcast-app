/**
 * Backbone localStorage Adapter
 * Version 1.1.4
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
(function (root, factory) {
   if (typeof exports === 'object') {
     module.exports = factory(require("underscore"), require("backbone"));
   } else if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define(["underscore","backbone"], function(_, Backbone) {
        // Use global variables if the locals are undefined.
        return factory(_ || root._, Backbone || root.Backbone);
      });
   } else {
      // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
      factory(_, Backbone);
   }
}(this, function(_, Backbone) {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.LocalStorage instead
Backbone.DropboxStorage = window.Store = function(name, client) {
  this.name = name;
  this.client = client;
};

_.extend(Backbone.DropboxStorage.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    //this.localStorage().setItem(this.name, this.records.join(","));

    // Now drop it to dropbox
    //this.client.writeFile(this.name, this.records.join(","), function(error, stat){});
  },



  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) {
      model.id = guid();
      model.set(model.idAttribute, model.id);
    }

    //this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
    this.client.writeFile(model.url(), JSON.stringify(model), function(error, stat){});
    
    return this.find(model);
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    //this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));

    this.client.writeFile(model.url(), JSON.stringify(model), function(error, stat){});
    return this.find(model);
  },

  // Retrieve a model from `this.data` by id.
  find: function(model, options) {
    var parse, path, promise,
      _this = this;
    path = model.urlRoot || model.path || "/";
    promise = this._findByName(path, model.id);
    parse = function(res) {
      var filePath;
      console.log("res");
      console.log(res[0]);
      filePath = res[0].path;
      return _this._readFile(filePath).then(function(res) {
        console.log("gne");
        console.log(res);
        model.set(JSON.parse(res));
        return console.log(model);
      });
    };
    return $.when(promise).then(parse);
  },

  // Return the array of all models currently in storage.
  findAll: function(model, options) {
    var error, fetchData, promise, promises, rootPath, success,
      _this = this;
    console.log("searching at " + model.path);
    rootPath = model.path;
    success = options.success;
    error = options.error;
    promises = [];
    promise = this._readDir(model.path);
    model.trigger('fetch', model, null, options);
    fetchData = function(entries) {
      var fileName, filePath, _i, _len;
      console.log('fetching data');
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
        if (options.update != null) {
          if (options.update === true) {
            model.update(results);
            model.trigger("update", results);
          } else {
            model.reset(results, {
              collection: model
            });
          }
        } else {
          model.reset(results, {
            collection: model
          });
        }
        if (success != null) {
          success(results);
        }
        return results;
      });
    };
    return $.when(promise).then(fetchData);
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    if (model.isNew())
      return false
    this.client.remove(this.name+"-"+model.id, function(error, userInfo) {});
    return model;
  },


  // fix for "illegal access" error on Android when JSON.parse is passed null
  jsonData: function (data) {
      return data && JSON.parse(data);
  },

  // Clear localStorage for specific collection.
  _clear: function() {
    /*var local = this.localStorage(),
      itemRe = new RegExp("^" + this.name + "-");

    // Remove id-tracking item (e.g., "foo").
    local.removeItem(this.name);

    // Lodash removed _#chain in v1.0.0-rc.1
    // Match all data items (e.g., "foo-ID") and remove.
    (_.chain || _)(local).keys()
      .filter(function (k) { return itemRe.test(k); })
      .each(function (k) { local.removeItem(k); });*/
  },

  _readDir: function(path) {
    var d,
      _this = this;
    d = $.Deferred();
    this.client.readdir(path, function(error, entries) {
      if (error) {
        //return _this.showError(error);
        return {};
      }
      return d.resolve(entries);
    });
    return d.promise();
  },

  _readFile: function(path) {
    var d,
      _this = this;
    d = $.Deferred();
    this.client.readFile(path, function(error, data) {
      if (error) {
        //return _this.showError(error);
        return {};
      }
      return d.resolve(data);
    });
    return d.promise();
  },

  _findByName: function(path, name) {
    var d,
      _this = this;
    console.log(path, name);
    d = $.Deferred();
    this.client.findByName(path, name, function(error, data) {
      if (error) {
        //return _this.showError(error);
        return {};
      }
      console.log("found data " + data);
      return d.resolve(data);
    });
    return d.promise();
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprecated, use Backbone.DropboxStorage.sync instead
Backbone.DropboxStorage.sync = Backbone.dropboxSync = function(method, model, options) {
  var store = model.localStorage || model.collection.localStorage;

  var resp, errorMessage, syncDfd = Backbone.$.Deferred && Backbone.$.Deferred(); //If $ is having Deferred - use it.

  try {

  switch (method) {
    case "read":
      resp = model.id != undefined ? store.find(model, options) : store.findAll(model, options);
      return resp;
      break;
    case "create":
      resp = store.create(model);
      return model.toJSON();
      break;
    case "update":
      resp = store.update(model);
      return model.toJSON();
      break;
    case "delete":
      resp = store.destroy(model);
      break;
    }
  } catch(error) {
    errorMessage = error.message;
  }

  if (options && options.complete) options.complete(resp);

  return resp;


 /* } catch(error) {
    if (error.code === DOMException.QUOTA_EXCEEDED_ERR && store._storageSize() === 0)
      errorMessage = "Private browsing is unsupported";
    else
      errorMessage = error.message;
  }

  if (resp) {
    if (options && options.success) {
      if (Backbone.VERSION === "0.9.10") {
        options.success(model, resp, options);
      } else {
        options.success(resp);
      }
    }
    if (syncDfd) {
      syncDfd.resolve(resp);
    }
  
  } else {
    errorMessage = errorMessage ? errorMessage
                                : "Record Not Found";

    if (options && options.error)
      if (Backbone.VERSION === "0.9.10") {
        options.error(model, errorMessage, options);
      } else {
        options.error(errorMessage);
      }

    if (syncDfd)
      syncDfd.reject(errorMessage);
  }

  // add compatibility with $.ajax
  // always execute callback for success and error
  if (options && options.complete) options.complete(resp);

  return syncDfd && syncDfd.promise();*/
};

Backbone.ajaxSync = Backbone.sync;

Backbone.getSyncMethod = function(model) {
  if(model.localStorage || (model.collection && model.collection.localStorage)) {
    return Backbone.dropboxSync;
  }

  return Backbone.ajaxSync;
};

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.sync = function(method, model, options) {
  return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
};

return Backbone.DropboxStorage;
}));