var Weathermood = {

  $el: $("#container"),

  template: new EJS({url: 'templates/home.ejs'}),

  render: function() {
    this.$el.append(this.template.render({}))
  }

}

Weathermood.render()
