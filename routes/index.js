
/*
host looks like foo:port, so strip off port (may not exist), and then
return either www (if host length is 2) or the subdomain
*/
function getSubdomain(h) {
	var parts = h.split(".");
	if(parts.length == 2) return "www";
	return parts[0];
}

var cache = {};

exports.index = function(req, res) {
	var subdomain = getSubdomain(req.headers.host);
	if(subdomain === 'www') {
		res.render('index');
	} else {
		res.render('viewer',{title:subdomain + ' and Kittens'});
	}
};

exports.data = function(req, res) {
	var subdomain = getSubdomain(req.headers.host);

	if(subdomain === 'www') return;

	var term = subdomain + ' and kittens';

	/*
	check cache - needs to be more sexy
	*/
	if(cache[term]) {
		console.log("Had cache for "+term);
		res.send(cache[term]);
	} else {
		req.app.get('bingSearch').search(term, function(result) {
			var data = result.data.map(function(o) {
				return {"url":o.MediaUrl,"title":o.Title,"source":o.SourceUrl};	
			});
			cache[term] = data;
			res.send(data);
		});

	}
};

exports.cached = function(req, res) {
	var keys = [];
	for(key in cache) {
		if(cache.hasOwnProperty(key)) keys.push(key);	
	}
	res.send(keys);
};