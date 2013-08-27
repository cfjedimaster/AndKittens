var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var hbs = require('hbs');

var app = express();
var BingSearch = require('./bingapi').BingSearch;

app.set('bingkey','fgQ7ve/sV/eB3NN/+fDK9ohhRWj1z1us4eIbidcsTBM');
app.set('bingSearch',new BingSearch(app.get('bingkey')));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use("/public",express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/data', routes.data);
app.get('/cached', routes.cached);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
