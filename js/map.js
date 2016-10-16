var drawMap = function() {
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ25nY3AiLCJhIjoiY2lsNXd5b3ZrMDA0a3UybHoxY3h5NGN3eiJ9.OrXfMbZ123f3f1EfPRCHHA';
	var map = L.mapbox.map('map', 'gngcp.p97o5d8j', {
	    	maxZoom: 20,
	    	minZoom: 3
	}).setView([47.655650, -122.317000], 15);
	var layer = L.mapbox.tileLayer('gngcp.p97o5d8j');
	layer.on('ready', function(){
	});

  overlayTiles(map);
}

function overlayTiles(map) {
  var filename = 22873;

  var dy = -0.003650;
  var dx = 0.005375;

  var y1 = 47.661650;
  var y2 = y1 + dy;

  var initx = -122.326900;
  var x2 = initx;
  var x1 = x2 + dx;

  for(var i = 0; i < 4; i++) { // y
    for(var j = 0; j < 8; j++) { // x
      // bounds are South-West to North-East
      var overlay = L.imageOverlay('tiles/' + (filename + i) + '(' + (j + 1) + ').png', [[y1, x1], [y2, x2]]);
      overlay.addTo(map);
      x1 += dx;
      x2 += dx;
    }
    x2 = initx;
    x1 = x2 + dx;
    y1 += dy;
    y2 += dy;
  }
}
