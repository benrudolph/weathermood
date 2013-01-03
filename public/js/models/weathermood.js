define([
    'underscore',
    'backbone'
    ], function(_, Backbone) {
      var WeathermoodModel = Backbone.Model.extend({
        defaults: {
          weather: "Partly Cloudy"
        }
      });

      return WeathermoodModel
    })
