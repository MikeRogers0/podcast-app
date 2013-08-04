PodcastCollection = CloudCollection.extend({
	model: PodcastModel,
    url: 'podcasts',
    path: 'podcasts',
    localStorage: new Backbone.LocalStorage("PodcastList-bb"),
    
    initialize: function () {
    },

	getByID: function(id){
		return this.where({id:id})[0];
    },
    getByFeedURL: function(feedUrl){
        return this.where({feedUrl:feedUrl})[0];
    },
    nextID: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
    },
    findSubscribed: function(){
        var podcasts = this.where({subscribed:true});
        return _.sortBy(podcasts, function(podcast) { return -podcast.get('lastUpdated'); });
    },

    /**
     * Searches for a term and sorts by relavance.
     */
    searchAttr: function(term, attrs){
        var models = this.models,
        returnItems = []
        term = term.toLowerCase(),
        attrs = attrs;

        // Firstly filter out irrelavant iterms.

        returnItems = _.filter(models, function(model){
            var has = false;
            _.each(attrs, function(attr){
                if(model.get(attr).toLowerCase().indexOf(term) >= 0){
                    has = true;
                }
            });
            return (has == true ? model:null);
        });

        if(returnItems.length == 0){
            return null;
        }

        // Figures out the keyword density.
        returnItems = _.sortBy(returnItems, function(model){
            var density = 0;

            _.each(attrs, function(attr){
                var orgistr = model.get(attr).toLowerCase(), // The orginal field.
                fitleredStr = orgistr.replace(term, ''); // The string without the term 

                // Density is cleaned string / overall string.
                if(fitleredStr == 0){
                    density += 100
                } else {
                   density += (fitleredStr.length / orgistr.length) * 100; 
                } 
            });

            return density / attrs.length
        });

        return returnItems;
    },

    getExpiredPodcast: function(){
        var podcasts = this.models,
        expiredTime = (new Date()).getTime() - 3600000 // 6 hours
        longerExpiredTime = (new Date()).getTime() - 100800000; // 7 Days

        // Filter out the unexpired ones
        podcasts = _.filter(podcasts, function(podcast){
            var expireTime = longerExpiredTime;
            if(podcast.get('subscribed')){
                expireTime = expiredTime;
            }
            if(podcast.get('lastChecked') < expireTime){
                return podcast;
            }
        });

        if(podcasts.length == 0){
            return null;
        }

        // Now sort it so the one which hasn't been updated in a while goes first.
        podcasts = _.sortBy(podcasts, function(podcast){
            return -podcast.get('lastChecked');
        });

        return podcasts[0];
    }, 

    addFeed: function(feedURL, callback){

        // If it's already been added, take the user to it.
        var podcastItem = podcastItems.getByFeedURL(feedURL) 
        if(podcastItem != undefined){
            if(callback === true){
                app.navigate('podcasts/'+podcastItem.get('slug'), true);
            }
            return;
        }

    	// TODO - Parse the feed to get it's details, then add it's episodes.
        // Poss TODO - write & host API for this on cloud (EC2?) rather than rely on google
        var api = "https://ajax.googleapis.com/ajax/services/feed/load",
            count = '50',
            params = "?v=1.0&num=" + count + "&output=xml&q=" + encodeURIComponent(feedURL),
            url = api + params,
            callback = callback,
            feedURL = feedURL;


        $.ajax({
            url: url,
            dataType: 'jsonp',
            cache: false,
            context: this, // Fuck scope, use this ;)
            error: function(jqXHR, textStatus, errorThrown){},
            complete: function(jqXHR, textStatus){},
            success: function(data, textStatus, jqXHR){
                // TODO: Do some checks on the response.

                // Unable to find podcast
                if(data.responseData == null){
                    if(callback === true){
                        app.navigate('podcasts/404', true);
                    }
                    return;
                }

                // Conver the XML reponse to a element we can jQuery over.
                var xmlDoc = $.parseXML( data.responseData.xmlString ),
                $xml = $( xmlDoc );

                // do a quick check if it's a podcast.
                if($xml.find('enclosure').attr('url') == undefined){
                    // Not a podcast.
                    return;
                }

                // Do a quick check we don't already have it
                if(this.getByFeedURL($xml.find('channel > link').text()) != null){
                    return; 
                }

                // Finally check by title
                if(this.where({title: $xml.find('channel > title').text()}).length > 0){
                    return;
                }

                // I want all the podcasts to have images for now.
                if($xml.find('channel > itunes\\:image, channel > image').attr('href') == null){
                    return;
                }

                newPodcastData = {
                    title: $xml.find('channel > title').text(),
                    feedUrl: ($xml.find('atom\\:link[href], link[href]').attr('href') ? $xml.find('atom\\:link[href], link[href]').attr('href') : feedURL), // jQuery so smart we have to repeat this shit.
                    subscribed: false,
                    link: $xml.find('channel > link').text(),
                    imageUrl: $xml.find('channel > itunes\\:image, channel > image').attr('href'),
                    lastChecked: (new Date()).getTime(),
                    lastUpdated: null,
                    explicit: ($xml.find('channel > itunes\\:explicit, channel > explicit').text() == 'no' ? false : true)
                };

                if(newPodcastData.feedUrl.indexOf('http://') == -1 && newPodcastData.feedUrl.indexOf('https://') == -1){
                    newPodcastData.feedUrl = feedURL;
                }

                var newPodcast = this.create(new PodcastModel(newPodcastData));

                // Now add some episodes
                newPodcast.updateEpisodes(callback, $xml)

                if(typeof callback == "function"){
                    //callback();
                    //newPodcast.updateEpisodes(callback);
                }else if(callback === true){
                    /*newPodcast.updateEpisodes(function(){
                        app.navigate('podcasts/301', true); // Extra one needed for when adding podcast from url.
                        app.navigate('podcasts/'+newPodcast.get('slug'), true);
                    }); */
                }  
            }
        });
    },
});