// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/weathermood',
], function($, _, Backbone, WeathermoodView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'conditions': 'showConditions',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.on('route:showConditions', function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/pages/home'
      var weathermoodView = new WeathermoodView();
      weathermoodView.render();
    });

    app_router.on('route:defaultAction', function(actions){
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
