var Player = {};

var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "queue"				: "queue",
        "podcasts"		: "myPodcasts",
        "podcasts/:feedUrl" : "podcasts",
        "podcasts/:feedUrl/:episodeName" : "podcasts",
        "add-feed"          : "addFeed",
        "dropbox-sync"      : "dropboxSync",
        "clear-data"		: "clearData"
    },

    initialize: function () {
    	// The currently playing item. It's set golobally for easier reference.
        this.Player = new PlayerView();
    },

    home: function () {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        //this.headerView.selectMenuItem('home-menu');
    },
    queue: function () {
        //if (!this.QueueView) {
            this.QueueView = new QueueView();
        //}
        $('#content').html(this.QueueView.el);
        //this.headerView.selectMenuItem('home-menu');
    },
    addFeed: function () {
        if (!this.AddFeed) {
            this.AddFeedView = new AddFeedView();
        }
        $('#content').html(this.AddFeedView.el);
        //this.headerView.selectMenuItem('home-menu');
    },
    myPodcasts: function(){
        //if (!this.MyPodcastsView) {
            this.MyPodcastsView = new MyPodcastsView();
        //}

        $('#content').html(this.MyPodcastsView.el);
    },

    podcasts: function(feedUrl, episodeName){
        
        // Load up the podcast we are looking for.
        try{
            var podcastModel = podcastItems.getByFeedURL(feedUrl);
            if(podcastModel == undefined){
                throw 'Podcast Not Found';
            }
            if(episodeName == undefined){
                this.PodcastView = new PodcastView({model: podcastModel});
            } else {
                var episodeModel = podcastModel.getEpisodesByName(episodeName);
                if(episodeModel == undefined){
                    throw 'Episode Not Found'
                }
                this.PodcastView = new PodcastEpisodeView({model: episodeModel});
            }
        }catch(err){
            // Do Something
            alert('404 - ' +err)
        }

        
        $('#content').html(this.PodcastView.el);
    },

    dropboxSync: function(){
        if (!this.DropboxSyncView) {
            this.DropboxSyncView = new DropboxSyncView();
        }
        $('#content').html(this.DropboxSyncView.el);
    },
    clearData: function(){
        if (!this.ClearDataView) {
            this.ClearDataView = new ClearDataView();
        }
        $('#content').html(this.ClearDataView.el);
    }
});