var drawMap = function() {
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ25nY3AiLCJhIjoiY2lsNXd5b3ZrMDA0a3UybHoxY3h5NGN3eiJ9.OrXfMbZ123f3f1EfPRCHHA';
	var map = L.mapbox.map('map', 'gngcp.p97o5d8j', {
	    	maxZoom: 20,
	    	minZoom: 3
	}).setView([47.661650, -122.327132], 15);
	var layer = L.mapbox.tileLayer('gngcp.p97o5d8j');
	layer.on('ready', function(){
	});

  // test
  //test(map);

  overlayTiles(map);
}

function test(map) {
  L.imageOverlay('tiles/22873(1).png', [[47.655154, -122.308860], [47.655154 + 0.001698, -122.308860 - 0.010761]]).addTo(map);
}

// 47.663348, -122.327132 SW of second from the top
// 47.661650, -122.316371 NE of second from the top
// est. x, y = 0.001698, -0.010761
function overlayTiles(map) {
  var filename = 22873;

  var dy = -0.002500;
  var dx = 0.005000;

  var y1 = 47.661650;
  var y2 = y1 + dy;

  var x2 = -122.327132;
  var x1 = x2 + dx;

  for(var i = 0; i < 4; i++) { // y
    for(var j = 0; j < 8; j++) { // x
      // bounds are South-West to North-East
      L.imageOverlay('tiles/' + (filename + i) + '(' + (j + 1) + ').png', [[y1, x1], [y2, x2]]).addTo(map);
      x1 += dx;
      x2 += dx;
    }
    x2 = -122.327132;
    x1 = x2 + dx;
    y1 += dy;
    y2 += dy;
  }
}
