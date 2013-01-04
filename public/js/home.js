var Weathermood = {

  $el: $("#container"),

  template: new EJS({url: 'templates/home.ejs'}),

  initialize: function() {
    this.geocoder = new google.maps.Geocoder()
    this.getLocation()
  },

  render: function(data) {
    this.$el.append(this.template.render(data))
  },

  getLocation: function() {
    navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this))
  },

  error: function() {},

  success: function(position) {
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
      success: function(data) {
        this.render(JSON.parse(data))
      }.bind(this)
    })
  }

}

Weathermood.initialize()
