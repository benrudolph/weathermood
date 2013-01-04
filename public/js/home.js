/* Contains logic for getting location and weather and playing music */

var Weathermood = {

  $el: $("#container"),

  template: new EJS({url: 'templates/weathermood.ejs'}),

  initialize: function() {
    this.getLocation()
  },

  render: function(data) {
    this.$el.append(this.template.render(data))
  },

  getLocation: function() {
    navigator.geolocation.getCurrentPosition(this.onLocationSuccess.bind(this), this.error.bind(this))
  },

  error: function() {},

  onLocationSuccess: function(position) {
    console.log(position)
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    this.getConditions(lat, lng)
  },

  getConditions: function(lat, lng) {
    $.ajax({
      method: "GET",
      data: { loc: lat + "," + lng },
      url: "/conditions",
      success: this.onConditionsSuccess.bind(this)
    })
  },

  onConditionsSuccess: function(data) {
    this.render(JSON.parse(data))
  }

}

$(document).ready(function() {
  Weathermood.initialize()
})
