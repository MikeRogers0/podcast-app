var Player = {};

var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "queue"				: "queue",
        "my-podcasts"		: "myPodcasts",
        "podcast/:id" : "podcastpage",
        "explore"           : "explore",
        "explore/:feedUrl/:episodeName"	: "explore",
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
        if (!this.QueueView) {
            this.QueueView = new QueueView();
        }
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
        if (!this.MyPodcastsView) {
            this.MyPodcastsView = new MyPodcastsView();
        }
        $('#content').html(this.MyPodcastsView.el);
    },
    podcastPage: function(id){
        if (!this.PodcastView) {
            this.PodcastView = new PodcastView();
        }
        $('#content').html(this.PodcastView.el);
    },
    explore: function(feedURL, episodeName){
        if (!this.ExploreView) {
            this.ExploreView = new ExploreView();
        }
        $('#content').html(this.ExploreView.el);
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