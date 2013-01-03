define([
  'jquery',
  'underscore',
  'backbone',
  'models/weathermood',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/pages/home.html'
], function($, _, Backbone, WeathermoodModel, weatherMoodTemplate){
  var WeathermoodView = Backbone.View.extend({
    el: $('#container'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( weatherMoodTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.append( compiledTemplate );
    }
  });
  // Our module now returns our view
  return WeathermoodView;
});

