var Player = {};

var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "queue"				: "queue",
        "podcasts"		: "myPodcasts",
        "podcasts/404":'404',
        "podcasts/301":'301',
        "podcasts/:feedUrl" : "podcasts",
        "add-feed"          : "addFeed",
        "settings/device-sync"      : "deviceSync",
        "settings/clear-data"		: "clearData"
    },

    initialize: function () {
    	// The currently playing item. It's set golobally for easier reference.
        this.Player = new PlayerView();
        $("#player").html(this.Player.el);

        // Now it's been appended, add the listners etc.
        this.Player.render();
    },

    home: function () {
        if (!this.homeView) {
            this.homeView = new HomeView();
            this.QueueView = new QueueView();
        }
        $('#content').html(this.homeView.el);
        $('#queue').html(this.QueueView.el);
        //this.headerView.selectMenuItem('home-menu');
    },
    queue: function () {
        //if (!this.QueueView) {
            this.QueueView = new QueueView();
        //}
        $('#content').html(this.QueueView.el);
        $('#queue').html(this.QueueView.el);
        //this.headerView.selectMenuItem('home-menu');
    },
    addFeed: function () {
        if (!this.AddFeed) {
            this.AddFeedView = new AddFeedView();
            this.QueueView = new QueueView();
        }
        $('#queue').html(this.QueueView.el);
        $('#content').html(this.AddFeedView.el);
        //this.headerView.selectMenuItem('home-menu');
    },
    myPodcasts: function(){
        //if (!this.MyPodcastsView) {
            this.MyPodcastsView = new MyPodcastsView();
            this.QueueView = new QueueView();
        $('#queue').html(this.QueueView.el);
        $('#content').html(this.MyPodcastsView.el);
    },

    404: function(){},
    301: function(){},
    podcasts: function(feedUrl){
        
        // Load up the podcast we are looking for.
        
        var podcastModel = podcastItems.getByFeedURL(feedUrl);
        if(podcastModel == undefined){
            //try{
                podcastItems.addFeed(feedUrl, true);
            //}catch(err){
                // Do Something
              //  throw 'Podcast Not Found';
           // }
            // A loading screen could be better.
            this.PodcastView = {};
            this.PodcastView.el = "<p>Podcast is loading</p>";
        }else{
            this.PodcastView = new PodcastView({model: podcastModel});
            
            this.QueueView = new QueueView();
        }

        if(this.PodcastView != undefined){
            $('#content').html(this.PodcastView.el);
            $('#queue').html(this.QueueView.el);
        }        
    },

    deviceSync: function(){
        this.DeviceSyncView = new DeviceSyncView();
            this.QueueView = new QueueView();
        $('#queue').html(this.QueueView.el);
        $('#content').html(this.DeviceSyncView.el);
    },
    clearData: function(){
        this.ClearDataView = new ClearDataView();
            this.QueueView = new QueueView();
        $('#queue').html(this.QueueView.el);
        $('#content').html(this.ClearDataView.el);
    }
});