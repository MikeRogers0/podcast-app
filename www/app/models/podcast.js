var Podcast = Backbone.Model.extend({

  // Default attributes for an podcast
  defaults: function() {
    return {
      id: podcastItems.nextID(),
      title: "Some podcast title",
      description: "",
      subscribed: false, // Bool - can add episodes that you dont subscribe to, so you can get/listen to specific episodes
      lastChecked: null,
      lastUpdated: null,
      feedUrl: '',
      slug: '',
      imageUrl: '',
      link: '',
      explicit: false,
      modelUpdatedAt: (new Date()).toUTCString()
    };
  },

  initialize: function () {
    this.set('slug', encodeURIComponent(this.get('feedUrl')));

    this.on('change', function(){this.save();});
    this.on('add change:subscribed', function(){this.cloudSave();}); 
  },

  cloudSave: function(){
    this.cloudSync('update');
  },


  getEpisodesByName: function(slug) {
    // TODO - Get single episode, from an index of the available episodes on the feed URL.
    return episodeItems.findByWhere({podcastID: this.get('id'), title: slug})[0];
  },

  getEpisodes: function() {
    var episodes = episodeItems.findByWhere({podcastID: this.get('id')});

    return _.sortBy(episodes, function(episode) { return -episode.get('datePublished'); });
  },

  // A Cron to run to get newer episodes. If we have time, this should be done in a Worker. If not, do it in a setTimeout().
  updateEpisodes: function(callback){
    var api = "https://ajax.googleapis.com/ajax/services/feed/load",
        count = '50', // Get the latest 50
        params = "?v=1.0&num=" + count + "&output=xml&q=" + this.get('slug'),
        url = api + params,
        redirect = redirect,
        callback = callback;

    $.ajax({
        url: url,
        dataType: 'jsonp',
        context: this, // Fuck scope, use this ;)
        fail: function(data, textStatus, jqXHR){},
        success: function(data, textStatus, jqXHR){
            // TODO: Do some checks on the response.

            // Conver the XML reponse to a element we can jQuery over.
            var xmlDoc = $.parseXML( data.responseData.xmlString ),
            $xml = $( xmlDoc ),
            lastUpdated = null;

            
            var context = this;
            $xml.find('channel item').each(function(index, item){
              // It's not a podcast
              if($(item).find('enclosure').attr('url') == undefined || (
                ($(item).find('enclosure').attr('url')).indexOf('.mp3') == -1 && ($(item).find('enclosure').attr('url')).indexOf('.m4a') == -1)){
                return;
              }

              var newEpisode = {
                title: $(item).find('title').text(),
                datePublished: (new Date($(item).find('pubDate').text())).getTime(),
                link: $(item).find('link').text(),
                mp3: $(item).find('enclosure').attr('url'),
                mp3_format: $(item).find('enclosure').attr('type'),
                duration: $(item).find('enclosure').attr('length'),
                description: $(item).find('description').text(),
                podcastID: context.get('id'),
                queued: (context.get('subscribed') ? true : false) // If they are subscribed, autoqueue it.
              }

              // Get the most recent date updated.
              if(lastUpdated == null || lastUpdated < newEpisode.datePublished){
                lastUpdated = newEpisode.datePublished;
              }
              
              // Confirm it's legit.
              if(episodeItems.getByWhere({podcastID: newEpisode.podcastID, title: newEpisode.title}) != undefined){
                return;
              }

              // Add it!
              episodeItems.create(new Episode(newEpisode));
            });

            // Update the feed last check info.
            this.set('lastChecked', (new Date()).getTime());
            this.set('lastUpdated', lastUpdated);
            this.save();

            if(typeof callback == 'function'){
              callback();
            }
        }
    });
  },

  cloudSync: function(method, options){
    // If dropbox isn't on ignore the request.
    if(!settings.canDropbox()){
      return false;
    }

    if(options == null){
      options = {};
    }


    //return Backbone.ajaxSync('read', this, options);
    DropBoxSync = new DropBoxStorage(settings.dropboxClient);
    return DropBoxSync.sync(method, this, options);
  },
});