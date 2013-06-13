var PodcastList = Backbone.Collection.extend({
	model: Podcast,
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
        return this.where({subscribed:true});
    },
    addFeed: function(feedURL, redirect){

        // If it's already been added, take the user to it.
        var podcastItem = podcastItems.getByFeedURL(feedURL) 
        if(podcastItem != undefined){
            app.navigate('podcasts/'+podcastItem.get('feedUrlEncoded'), true);
            return;
        }

    	// TODO - Parse the feed to get it's details, then add it's episodes.
        // Poss TODO - write & host API for this on cloud (EC2?) rather than rely on google
        var api = "https://ajax.googleapis.com/ajax/services/feed/load",
            count = '1',
            params = "?v=1.0&num=" + count + "&output=xml&q=" + encodeURIComponent(feedURL),
            url = api + params,
            redirect = redirect,
            feedURL = feedURL;


        $.ajax({
            url: url,
            dataType: 'jsonp',
            context: this, // Fuck scope, use this ;)
            fail: function(data, textStatus, jqXHR){},
            success: function(data, textStatus, jqXHR){
                // TODO: Do some checks on the response.

                // Unable to find podcast
                if(data.responseData == null){
                    app.navigate('podcasts/404', true);
                    return;
                }

                // Conver the XML reponse to a element we can jQuery over.
                var xmlDoc = $.parseXML( data.responseData.xmlString ),
                $xml = $( xmlDoc );

                // TODO - check we have all of these, thus it's a podcast.
                var newPodcast = this.create(new Podcast({
                    title: $xml.find('channel > title').text(),
                    feedUrl: ($xml.find('atom\\:link[href], link[href]').attr('href') ? $xml.find('atom\\:link[href], link[href]').attr('href') : feedURL), // jQuery so smart we have to repeat this shit.
                    description: $xml.find('channel > description').text(),
                    subscribed: false,
                    link: $xml.find('channel > link').text(),
                    imageUrl: $xml.find('channel > itunes\\:image, channel > image').attr('href'),
                    lastChecked: new Date(),
                    lastUpdated: $xml.find('channel > item > pubDate').text(),
                    explicit: ($xml.find('channel > itunes\\:explicit, channel > explicit').text() == 'no' ? false : true)
                }));

                newPodcast.updateEpisodes();

                app.navigate('podcasts/301', redirect); // Extra one needed for when adding podcast from url.
                app.navigate('podcasts/'+newPodcast.get('feedUrlEncoded'), redirect);
            }
        });
    }
});