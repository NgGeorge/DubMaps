//var drawMap = function() {
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

  var circleLayer = L.layerGroup().addTo(map);
  drawCircles(circleLayer);

  // Hides circles so that they don't drift on zoom
  map.on('zoomstart', function(e) {
    console.log("Zoom start!");
    map.removeLayer(circleLayer);
  });

  map.on('zoomend', function(e) {
    console.log("Zoom end!");
    map.addLayer(circleLayer);
  });
//}

function drawOverlayTiles() {
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

function drawCircles(circleLayer) {
  for (i = 0; i < buildingLocations.length; i++) {
    var circle = L.circleMarker([buildingLocations[i].lat, buildingLocations[i].long]);
    var name = buildingLocations[i].name;
    circle.setRadius(20);
    circle.bindPopup(name);
    circle.on('click', function(){
      $('#myModal').modal();
      $('.modal-title').empty();
      console.log(this._popup._content);
      $("<p>" + this._popup._content + "</p>").appendTo('.modal-title');
    });

    circle.addTo(circleLayer);
  }
}



// Load shit from button press
$(function() {
  $('.btn--populations').on('click', function() {
    var $controls = $('.population-controls')
    if ( $controls.css('bottom') !== '0px' ) {
      $controls.animate({
        'bottom': '0'
      })
      renderMap()
    } else {
      $controls.animate({
        'bottom': '-100%'
      })
      map.removeLayer(populationLayer)
      circleLayer.addTo(map)
    }

  })
})

var time
  , day
  , chart = {}
  , colors = ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]
  , colorsLen = colors.length
  , populationLayer

function renderMap() {
  $('.map').html('')
  day = day || 'Monday'
  time = time || 800

  $.each(buildingsStudentData, function(buildingName, building) {
    var sections = building[day]
    $.each(sections, function(i, section) {
      if ( section.time == time ) {
        chart[buildingName] = { n: section.numStudents }
      }
    })
  })

  var maxStudents = Math.max.apply(Math, $.map(chart, function(info) {
    return info.n
  }))
  maxStudents++
  var maxStudentsLog = Math.log(maxStudents)

  $.each(chart, function(name, info) {
    chart[name].color = colors[Math.floor(Math.log(info.n)/maxStudentsLog*colorsLen)]
  })

  circleLayer && map.removeLayer(circleLayer)
  populationLayer && map.removeLayer(populationLayer)

  populationLayer = new L.LayerGroup([]);
  for (var i = 0; i < buildingLocations.length; i++) {
    var name = buildingLocations[i].name
    var populationMarker = L.circleMarker([buildingLocations[i].lat, buildingLocations[i].long])
    populationMarker.setRadius(Math.log(chart[name].n)/maxStudentsLog * 100);
    populationMarker.options.color = chart[name].color
    populationMarker.options.fillOpacity = .75
    populationMarker.addTo(populationLayer)
  }
  populationLayer.addTo(map);
}

$('.population-controls .time').on('change', function() {
  time = $(this).val()
  time = time - ( time % 100 ) + Math.floor( ( time % 100 ) * 0.6 )
  renderMap()
})

$('.population-controls .day').on('change', function() {
  day = $(this).val()
  renderMap()
})