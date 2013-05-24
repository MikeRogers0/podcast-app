var Episode = Backbone.Model.extend({

  // Default attributes for an episode
  defaults: function() {
    return {
      id: null,
      title: "Some episode title",
      datePublished: null,
      duration: null,
      podcast: null // The ID of the podcast?
    };
  }

});