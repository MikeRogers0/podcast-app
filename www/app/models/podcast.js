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
      feedUrlEncoded: '',
      imageUrl: '',
      link: '',
      explicit: false
    };
  },

  initialize: function () {
    this.episodes = episodeItems.getByPodcastID(this.id);
    this.set('feedUrlEncoded', encodeURIComponent(this.get('feedUrl')));
  },

  getNewEpisodes: function(){
    // TODO - Get the new episodes from the feed.
  },

  getEpisode: function() {
    // TODO - Get single episode, from an index of the available episodes on the feed URL.
  },

  // A Cron to run to get newer episodes. If we have time, this should be done in a Worker. If not, do it in a setTimeout().
  updateEpisodes: function(){
    var api = "https://ajax.googleapis.com/ajax/services/feed/load",
        count = '5', // Get the latest 5
        params = "?v=1.0&num=" + count + "&output=xml&q=" + this.get('feedUrlEncoded'),
        url = api + params,
        redirect = redirect;

    $.ajax({
        url: url,
        async: true,
        dataType: 'jsonp',
        context: this, // Fuck scope, use this ;)
        fail: function(data, textStatus, jqXHR){},
        success: function(data, textStatus, jqXHR){
            // TODO: Do some checks on the response.

            // Conver the XML reponse to a element we can jQuery over.
            var xmlDoc = $.parseXML( data.responseData.xmlString ),
            $xml = $( xmlDoc );

            

            $xml.find('channel item').each(function(index, item){
              var newEpisode = {
                title: $(item).find('title').text(),
                datePublished: $(item).find('pubDate').text(),
                mp3: $(item).find('enclosure').attr('url'),
                mp3_format: $(item).find('enclosure').attr('type'),
                duration: $(item).find('enclosure').attr('length'),
                description: $(item).find('description').text()
              }

              debugger;
            });

            /*var newPodcast = this.create(new Podcast({
                title: $xml.find('channel > title').text(),
                feedUrl: $xml.find('atom\\:link[href], link[href]').attr('href'), // jQuery so smart we have to repeat this shit.
                description: $xml.find('channel > description').text(),
                subscribed: false,
                link: $xml.find('channel > link').text(),
                imageUrl: $xml.find('channel > itunes\\:image, channel > image').attr('href'),
                lastChecked: new Date(),
                lastUpdated: $xml.find('channel > item > pubDate').text(),
                explicit: ($xml.find('channel > itunes\\:explicit, channel > explicit').text() == 'no' ? false : true)
            }));*/

            
        }
    });
  }
});