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

function getStudentChart(buildingName, ctx) {
  var building = buildingsStudentData[buildingName];
  var day = 'Monday'

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: building[day].map(function(datapoint) {
        if ( datapoint.time % 100 == 0 )
          return (('0000' + datapoint.time).substr(datapoint.time.toString().length)).match(/.{2}/g, '').join(':')
        return ''
      }),
      datasets: [
        {
          label: 'Number of students in ' + buildingName + ' on ' + day,
          backgroundColor: 'rgba('+ getColor(Math.floor(Math.random() * 20)) +'.6)',
          data: building[day].map(function(datapoint) {
            return datapoint.numStudents
          })
        }
      ]
    }
  })
}

function getSubjectChart(buildingName, ctx) {
  var building = buildingsSubjectsData[buildingName];
  var day = 'Monday'
  var j = Math.floor(Math.random() * 20)

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(building[day]),
      datasets: [
        {
          label: 'Classes of Subject in ' + buildingName + ' on ' + day,
          backgroundColor: 'rgba('+ getColor(j) +'.6)',
          hoverBackgroundColor: 'rgba('+ getColor(j) +'.8)',
          data: Object.keys(building[day]).map(function(subj) {
            return building[day][subj]
          })
        }
      ]
    },
    options:{ 
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 3
          }
        }]
      }
    }
  })
}

function drawCircles(circleLayer) {
  for (i = 0; i < buildingLocations.length; i++) {
    var circle = L.circleMarker([buildingLocations[i].lat, buildingLocations[i].long]);
    var title = buildingLocations[i].name;
    var body = "example";
    var content = "title: [" + title + "]\nbody: [" + body + "]";
    circle.setRadius(20);
    circle.bindPopup(content);
    circle.on('click', function(){
      $('#myModal').modal();
      $('.modal-title').empty();
      $('.modal-body').empty();
      var buildingName = getCircleTitle(this);
      // $('.modal-title').html(myTitle);
      var ctx1 = document.createElement('canvas')
      var ctx2 = document.createElement('canvas')
      $('.modal-body').append(ctx1);
      getStudentChart(buildingName, ctx1)
      $('.modal-body').append(ctx2);
      getSubjectChart(buildingName, ctx2)
    });

    circle.addTo(circleLayer);
  }
}

function getCircleTitle(circle) {
  var myContent = circle._popup._content;
  var myTitle = /title: \[(.*?)\]/.exec(myContent)[1];
  return myTitle;
}

function getCircleBody(circle) {
  var myContent = circle._popup._content;
  var myBody = /body: \[(.*?)\]/.exec(myContent)[1];
  return myBody;
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

function getColor (i) {
  i = i || 0
  var colors = [
    '26, 188, 156,',
    '46, 204, 113,',
    '52, 152, 219,',
    '155, 89, 182,',
    '52, 73, 94,',
    '241, 196, 15,',
    '230, 126, 34,',
    '231, 76, 60,'
  ]

  return colors[i % colors.length]
}