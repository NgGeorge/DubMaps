var drawMap = function() {
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ25nY3AiLCJhIjoiY2lsNXd5b3ZrMDA0a3UybHoxY3h5NGN3eiJ9.OrXfMbZ123f3f1EfPRCHHA';
	var southWest = L.latLng(47.647252, -122.324270),
	    northEast = L.latLng(47.661635, -122.288589),
	    bounds = L.latLngBounds(southWest, northEast);

	bounds = L.latLngBounds(southWest, northEast);
	var map = L.mapbox.map('map', 'gngcp.p97o5d8j', {
		maxBounds: bounds,
	  maxZoom: 18,
	  minZoom: 16,
	}).setView([47.653800, -122.307851], 17);

  drawOverlayTiles(map);

  var circleLayer = L.featureGroup().addTo(map);
  drawCircles(map, circleLayer);
}

function drawOverlayTiles(map) {
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

function drawCircles(map, circleLayer) {
  for (i = 0; i < buildingLocations.length; i++) {
    var circle = L.circleMarker([buildingLocations[i].lat, buildingLocations[i].long]);
    circle.setRadius(20);
    circle.on('click', function(){$('#myModal').modal()});
    circle.addTo(circleLayer);
  }
}
