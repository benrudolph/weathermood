var WunderNodeClient = require("./node_modules/wundernode/WunderNodeClient.js");
var express = require('express')
  , fs = require("fs")

var app = express();

var apikey = "999c5842f5b56785";
var country = "IE";
var city = "Waterford";

var debug = true;

var wunder = new WunderNodeClient(apikey,debug, country, city);

app.configure(function() {
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, res) {
  res.render("home", {})
})

app.get('/conditions', function(req, res){
    console.log(req.query.loc)
    wunder.conditions(function(err, obj) {
            if (err){
                    console.log('errors: ' + err);
            }
            res.end(obj);
    }, req.query.loc);
});

app.get(/\/css\/(\w+).css/, function(req, res) {
  fs.readFile("public/css/" + req.params[0] + ".less", function(e, data) {
    less.render(data.toString("utf8"), function(e, css) {
      res.write(css);
      res.end();
    });
  });
});

app.listen(3000);
console.log('Listening on port 3000');
