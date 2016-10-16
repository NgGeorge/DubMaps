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
resetCircles();

map.on('zoomstart', function(e) {
  map.removeLayer(circleLayer);
});

map.on('zoomend', function(e) {
  map.addLayer(circleLayer);
});

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
  var j = Math.floor(Math.random() * 69)

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
    circle.options.className = 'buildingMark';
    circle.on('click', function(){
      map.panTo(this._latlng);
      resetCircles();
      toggleCircleModal(this);
      var $controls = $('.population-controls')
      if ( $controls.css('bottom') == '0px' ) {
        $controls.animate({
          'bottom': '-100%'
        })
      }
    });
    circle.addTo(circleLayer);
  }
}

function toggleCircleModal(circle) {
  $('#myModal').modal();
  $('.modal-title').empty();
  $('.modal-body').empty();
  var myTitle = getCircleTitle(circle);
  var myBody = getCircleBody(circle);

  $('.modal-title').html(buildingCodes.get(getCircleTitle(circle)) + ' (' + getCircleTitle(circle) + ') Insights');
  var ctx1 = document.createElement('canvas');
  var ctx2 = document.createElement('canvas');
  var currentClasses = document.createElement('div');
  var cClasses = getClasses(myTitle);
  if ( cClasses.current.length ) {
    $('.modal-body').append('<h1 id="currentTitle"> Current Classes </h1>');
    for (i = 0; i < cClasses.current.length; i++) {
    	$(currentClasses).append('<h2 class="scheduledClass">' + cClasses.current[i].code + ' ' + cClasses.current[i].room + ' @ ' + cClasses.current[i].time[0] + ' to ' + cClasses.current[i].time[1] + '</h2>');
    }
    $('.modal-body').append(currentClasses);
  }

  if ( cClasses.upcoming.length ) {
    var upcomingClasses = document.createElement('div');
    $('.modal-body').append('<h1 id="upcomingTitle"> Upcoming Classes </h1>');
    for (i = 0; i < cClasses.upcoming.length; i++) {
    	$(upcomingClasses).append('<h2 class="scheduledClass">' + cClasses.upcoming[i].code + ' ' + cClasses.upcoming[i].room + ' @ ' + cClasses.upcoming[i].time[0] + ' to ' + cClasses.upcoming[i].time[1] + '</h2>');
    }
    $('.modal-body').append(upcomingClasses);
  }

  ctx1.style.marginTop = "10px"
  ctx2.style.marginTop = "10px"
  $('.modal-body').append(ctx1);
  getStudentChart(myTitle, ctx1)
  $('.modal-body').append(ctx2);
  getSubjectChart(myTitle, ctx2);
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

// Returns the circle corresponding to a code
function findCircle(code) {
  var target;
  var arr = circleLayer.getLayers();

  for(var i = 0; i < arr.length; i++) {
    if(getCircleTitle(arr[i]).includes(code)) {
      return arr[i];
    }
  }

  return null;
}

var fuse = new Fuse(mainData, {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  keys: [
    "code",
    "building",
    "name"
  ]
})

function resetCircles() {
  var circles = circleLayer.getLayers();
  for(var i = 0; i < circles.length; i++) {
    circles[i].setRadius(20);
    circles[i].options.className = "buildingMark";
    circles[i].setStyle({
      fillOpacity: 0,
    	opacity: 0.5,
    	color: '#FFD700',
    	weight: 5
    	// z-index: '2 !important',
    });
  }
}

function highlightCircles(circles) {
  var lat = 0;
  var lng = 0;
  var total = 0;

  for(var i = 0; i < circles.length; i++) {
    if(circles[i] != null) {
      circles[i].options.className = "highlight";
      circles[i].setStyle({color: '#EF1AEF', weight: 7, fillOpacity: 0.5});
      circles[i].setRadius(40);
      lat += circles[i]._latlng.lat;
      lng += circles[i]._latlng.lng;
      total++;
    } else {
      // console.log("You probably gave me SOCC, which is not a building.");
    }
  }

  lat /= total;
  lng /= total;
  map.setZoom(16);
  map.panTo([lat, lng]);
}

// Search function
$("#search").on('keyup', function (e) {
  if (e.keyCode == 13) {
    // console.log("Enter!");
    var circles = [];
    var entry = $("#search").val();
    var search = fuse.search(entry).map(function(thing) {
        return thing.building;
    }).filter(function(building) {
        return building.length == 3
    }).splice(0, 5)

    resetCircles();

    if (search.length > 0) {
      var seen = [];
      for(var i = 0; i < search.length; i++) {
        var item = findCircle(search[i])
        if(!seen.includes(search[i])) {
          circles.push(item);
          seen.push(search[i]);
        }
      }
    } else {
      circles = null;
    }

    if(circles != null) {
      if(circles.length > 1) {
        highlightCircles(circles);
      } else if (circles[0] != null) {
        toggleCircleModal(circles[0]);
        map.setZoom(17);
        map.panTo(circles[0]._latlng);
      }
   } else {
     // console.log(entry + " is not a valid building code.");
   }
  }
});

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
      resetCircles();
    }
  })
})

var time
  , day
  , chart = {}
  , colors = ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]
  , colorsLen = colors.length
  , populationLayer

function renderMap() {
  $('.map').html('')
  day = day || 'Monday'
  time = time || 1400

  $.each(buildingsStudentData, function(buildingName, building) {
    var sections = building[day]
    $.each(sections, function(i, section) {
      if ( section.time == time ) {
        chart[buildingName] = { n: section.numStudents }
      }
    })
  })

  var maxStudents = Math.max.apply(Math, $.map(chart, function(info) {
    return info.n;
  }))
  maxStudents++;
  var maxStudentsLog = Math.log(maxStudents);

  $.each(chart, function(name, info) {
    chart[name].color = colors[Math.floor((Math.log(info.n) || 0)/maxStudentsLog*colorsLen)];
  })

  var circles = circleLayer.getLayers();

  resetCircles();
  for(var i = 0; i < circles.length; i++) {
    var name = getCircleTitle(circles[i]);
    circles[i].setRadius(Math.log(chart[name].n)/maxStudentsLog * 100);
    circles[i].setStyle({color: chart[name].color, fillOpacity: .5});
    circles[i].options.className = "popMark";
  }
}

$('.population-controls .time').on('change input', function() {
  time = $(this).val()
  time = time - ( time % 100 ) + Math.round( ( time % 100 ) * 0.6 )
  renderMap()
  renderOrderedChart(time)
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

// Ordered Chart (Horizontal Bar)
function renderOrderedChart(time) {
  var ctx = $('#ordered-population-chart');
  var data = [];
  time = time || 1200;

  for ( var buildingName in buildingsStudentData ) {
    if (  !buildingsStudentData.hasOwnProperty(buildingName) ) continue;
    var building = buildingsStudentData[buildingName];
    var day = 'Monday'
    var today = buildingsStudentData[buildingName][day]
    var current;
    today.forEach(function(section) {
      if ( section.time == time ) {
        current = section;
      }
    })
    data.push({
      numStudents: current.numStudents,
      numClasses: current.numClasses,
      building: buildingName
    })
  }

  data = data.sort(function(a, b) {
    return a.numStudents > b.numStudents ? -1: 1;
  }).splice(0, 10)

  new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: data.map(function(el) { return el.building }),
      datasets: [
        {
          label: 'Number of Students',
          backgroundColor: 'rgba('+ getColor(42) +'.6)',
          hoverBackgroundColor: 'rgba('+ getColor(42) +'.8)',
          data: data.map(function(el) {
            return el.numStudents
          })
        },
        {
          label: 'Number of Classes',
          backgroundColor: 'rgba('+ getColor(69) +'.6)',
          hoverBackgroundColor: 'rgba('+ getColor(69) +'.8)',
          data: data.map(function(el) {
            return el.numClasses
          })
        }
      ]
    },
    options:{
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          }
        }]
      }
    }
  })
}

renderOrderedChart()

window.onload = function(e) {
	$('div.population-controls').on('mouseover', function() {
		map.dragging.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
	});
	$('div.population-controls').on('mouseout', function() {
		map.dragging.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
	});
  $('div #scheduleView').on('mouseover', function() {
		map.dragging.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
	});
	$('div #scheduleView').on('mouseout', function() {
		map.dragging.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
	});
  $('div #myModal').on('mouseover', function() {
		map.dragging.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
	});
	$('div #myModal').on('mouseout', function() {
		map.dragging.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
	});
	$('#slider').on('change', function() {
		var hour = Math.floor($('#slider').val() / 100);
		var minutes;
		if($('#slider').val() % 100 >= 60) {
			hour++;
			minutes = Math.abs(60 - $('#slider').val()%100);
		} else {
			minutes = $('#slider').val()%100;
		}

		if(minutes == 0) {
			minutes = "00";
		}
		if(hour >= 12) {
			hour = Math.floor(hour % 12);
			minutes = minutes + " PM";
		} else {
			minutes = minutes + " AM";
		}
		$('#time').html(hour + ':' + minutes);
	});

	 var upcomingEvents = document.createElement('div');
	 var events = getEvents();
  	for (i = 0; i < events.length; i++) {
  	$(upcomingEvents).append('<h2 class="scheduledEvent">' + events[i].name + ' ' + events[i].location + ' @ ' + events[i].time + '</h2>'); 	
  	}
  	$('#upcomingEvents').append(upcomingEvents);

}

function mark_schedule(schedule) {
  var circles = [];
  $.each(schedule, function(day, content) {
    var courses = content.courses;
    $.each(courses, function(n, course) {
    var name = course.name;
    var place = course.place;
    if ( place ) {
      var building = place.building;
      var room = place.room;
      var major = "";
      $.each(name, function(i, c) {
         major += (c + " ");
      })
      var circle = findCircle(building);
      circles.push(circle);  
    }
    }) 
  })
  highlightCircles(circles);
}

// Get current and upcoming classes
function getClasses(building) {
  var now = new Date()
    , day = 'Monday'
    , hour = ('00' + now.getHours()).substr(now.getHours().toString().length)
    , minute = ('00' + now.getMinutes()).substr(now.getMinutes().toString().length)
    , time = hour + minute
    , hourFuture = parseFloat(hour)+3
    , timeFuture = ('00' + hourFuture).substr(hourFuture.toString().length) + minute

  building = building || 'MGH'

  var data = {
    current: mainData.filter(function(el) {
      return (
        el.building == building &&
        parseFloat(el.time[0]) <= time &&
        parseFloat(el.time[1]) >= time &&
        ( (parseFloat(el.time[1]) - parseFloat(el.time[0])) < 1200 ) &&
        el.days.indexOf(day) >= 0
      )
    }).splice(0, 5),

    upcoming: mainData.filter(function(el) {
      return (
        el.building == building &&
        parseFloat(el.time[0]) <= timeFuture &&
        parseFloat(el.time[1]) >= timeFuture &&
        ( (parseFloat(el.time[1]) - parseFloat(el.time[0])) < 1200 ) &&
        el.days.indexOf(day) >= 0
      )
    }).splice(0, 5)
  }

  return data
}

function getEvents() {
  return eventsData.splice(0, 6)
}

function previewFile() {
  var file    = $('input[type="file"]').get(0).files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'post',
      headers: {
          Authorization: 'Client-ID 31c54f7e6175b2b'
      },
      data: {
          image: reader.result.split(',')[1]
      },
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          var url = response.data.link.split('/')
          var fname = url[url.length - 1]

          $.ajax({
            url: 'http://192.241.190.28:3069/?url=' + fname
          }).done(function(response) {
              mark_schedule(response)
          })
        }
      }
    });
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

$('input[type="file"]').unbind().off().on('change', previewFile)
