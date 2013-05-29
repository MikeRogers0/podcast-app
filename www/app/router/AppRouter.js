var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "queue"				: "queue",
        "my-podcasts"		: "myPodcasts",
        "explore"			: "podcasts",
        "explore:/id"       : "podcasts",
        "episodes/:id"		: "episodes",
        "episodes/:id"      : "episodes",
        "add-feed"          : "addFeed",
        "dropbox-sync"      : "dropboxSync",
        "clear-data"		: "clearData"
    },

    initialize: function () {
    	// The currently playing item.
        this.currentlyPlaying = new CurrentPlayingView();
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