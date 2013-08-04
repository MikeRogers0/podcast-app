var Player = {};

var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "queue"				: "home",
        "podcasts"		: "myPodcasts",
        "podcasts/404":'404',
        "podcasts/301":'301',
        "podcasts/:feedUrl" : "podcasts",
        "add-feed"          : "addFeed",
        "search"          : "search",
        "settings/device-sync"      : "deviceSync",
        "settings/clear-data"		: "clearData"
    },

    initialize: function () {
    	// The currently playing item. It's set golobally for easier reference.
        this.Player = new PlayerView();
        $("#player").html(this.Player.el);

        // Now it's been appended, add the listners etc.
        this.Player.render();

        this.$container = $('#container');
        this.$pageTitle = $('head title');

        this.QueueView = new QueueView();
        $('#queueView').html(this.QueueView.el);
    },

    home: function () {
        //if (!this.homeView) {
            this.homeView = new HomeView();
        //}
        $('#content').html(this.homeView.el);
        
        //this.headerView.selectMenuItem('home-menu');

        this.updateMeta({
            class: 'home',
            title: '',
        });
    },
    queue: function () {
        //if (!this.QueueView) {
            this.QueueView = new QueueView();
        //}
        $('#content').html(this.QueueView.el);
        //this.headerView.selectMenuItem('home-menu');

        this.updateMeta({
            class: 'home',
            title: 'Queue',
        });
    },
    addFeed: function () {
        if (!this.AddFeed) {
            this.AddFeedView = new AddFeedView();
        }
        $('#content').html(this.AddFeedView.el);
        //this.headerView.selectMenuItem('home-menu');
    },
    search: function(){
        if(!this.SearchView){
            this.SearchView = new SearchView();
        }

        this.updateMeta({
            class: 'search',
            title: 'Search',
        });

        $('#content').html(this.SearchView.$el);

        this.SearchView.addListners();
    },
    myPodcasts: function(){
        //if (!this.MyPodcastsView) {
            this.MyPodcastsView = new MyPodcastsView();
        $('#content').html(this.MyPodcastsView.el);

        this.updateMeta({
            class: 'myPodcasts',
            title: 'Your Podcasts',
        });
    },

    404: function(){},
    301: function(){},
    podcasts: function(feedUrl, options){
        options = {
            class: 'podcasts',
            title: 'Podcast Overview',
        };

        // Load up the podcast we are looking for.
        
        var podcastModel = podcastItems.getByFeedURL(feedUrl);
        if(podcastModel == undefined){

            if(options.reloaded == undefined){
                podcastItems.addFeed(feedUrl, function(){
                    app.podcasts(feedUrl, {reloaded: true});
                });

                // A loading screen could be better.
                this.PodcastView = {};
                this.PodcastView.el = "<p>Podcast is loading</p>";
            }else{
                // A loading screen could be better.
                this.PodcastView = {};
                this.PodcastView.el = "<p>Can't find podcast :(</p>";
            }
            
        }else{
            this.PodcastView = new PodcastView({model: podcastModel});
        }

        if(this.PodcastView != undefined){
            $('#content').html(this.PodcastView.el);

            if(this.PodcastView.model != null){
                options.title = this.PodcastView.model.get('title');
            }
        }

        this.updateMeta(options);
    },

    deviceSync: function(){
        this.DeviceSyncView = new DeviceSyncView();
        $('#content').html(this.DeviceSyncView.el);

        this.updateMeta({
            class: 'deviceSync',
            title: 'Device Sync',
        });
    },
    clearData: function(){
        this.ClearDataView = new ClearDataView();
        $('#content').html(this.ClearDataView.el);

        this.updateMeta({
            class: 'clearData',
            title: 'Clear Data',
        });
    },

    updateMeta: function(options){
        // Update the class
        if(options.class != undefined){
            this.$container.attr('class', 'pure-g-r '+options.class);
        }
        
        // Update the title
        if(options.title != undefined){
            if(options.title == ''){
                this.$pageTitle.text('Podcast App'); // TODO - YML the podcast app bit.
            }else {
                this.$pageTitle.text(options.title+' - Podcast App');
            }
        }
    },

    clearViews: function(){
        this.homeView = null;
        this.SearchView = null;
        this.DeviceSyncView = null;
        this.ClearDataView = null;
        this.PodcastView = null;
    }
});