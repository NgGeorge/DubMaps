var drawMap = function() {
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ25nY3AiLCJhIjoiY2lsNXd5b3ZrMDA0a3UybHoxY3h5NGN3eiJ9.OrXfMbZ123f3f1EfPRCHHA';
	var map = L.mapbox.map('map', 'gngcp.p97o5d8j', {
		maxBounds: bounds,
	    	maxZoom: 20,
	    	minZoom: 3
	}).setView([40, -97], 5);
	var layer = L.mapbox.tileLayer('gngcp.p97o5d8j');
	layer.on('ready', function(){
	});
}
