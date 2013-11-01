(function() {
    var cycleTime     = 5000,
        cycleTimeout  = null,
        loader        = new Image(),
        isLoading     = false,
        isFirstLoad   = true,
        containers    = [
            document.getElementById('image-1'),
            document.getElementById('image-2')
        ],
        sources       = [],
        
        transitionDuration     = 500,
        transitionDurationProp = Modernizr.prefixed('transitionDuration'),
        transitionDelayProp    = Modernizr.prefixed('transitionDelay'),
		sourceURL			   = $('#attrib-banner'),
		sourceText			   = $('#attrib-copy');
        
    function loadNext() {
        var source;
        
        if(!isLoading) {
            isLoading  = true;
            source     = sources.shift()
            loader.src = source.url;
			sourceText.text(source.title);
			sourceURL.attr("href", source.url);
            sources.push(source);
        }
    };
    
    function showNext() {
        var prev = containers[0],
            next = containers[1],
            ps   = prev.style,
            ns   = next.style;
            
        ps[transitionDurationProp] = '0ms';
        ps[transitionDelayProp]    = transitionDuration + 'ms';
        ps.zIndex                  = 1;
        ps.opacity                 = 0;
                                   
        ns[transitionDurationProp] = transitionDuration + 'ms';
        ns[transitionDelayProp]    = '0ms';
        ns.zIndex                  = 2;
        ns.backgroundImage         = 'url(' + loader.src +')';
        ns.opacity                 = 1;
        
        if(isFirstLoad) {
            isFirstLoad = false;
            
            setTimeout(function() {
                document.body.removeChild(
                    document.getElementById('loader-animation')
                );
            }, transitionDuration);
        };
        
        containers   = [next, prev];
        cycleTimeout = setTimeout(onCycle, cycleTime);
    };
    
    function onLoad(e) {
        isLoading = false;
        showNext();
    };
    
    function onCycle() {
        loadNext();
    };
    
    loader.addEventListener('load', onLoad);
    loader.addEventListener('error', function(e) {
		//for now, just ignore it
		console.log('error loading the image');	
		isLoading = false;
		showNext();
	});

	//get my data
	$.get('/data'+window.location.pathname, function(res,code) {

		for(var i=0, len=res.length; i<len; i++) {
			sources.push(res[i]);	
		}
		loadNext();
	});
	
})();
