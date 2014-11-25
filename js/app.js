// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//create the map, fetch  the list of traffic cameras, and add them as markers on the map
$(document).ready(function() {
	var mapElem = document.getElementById('map');
	var center = {
		lat: 47.6,
		lng: -122.3
	};
	var map = new google.maps.Map(mapElem, {
		center: center,
		zoom: 12
	});

	var infoWindow = new google.maps.InfoWindow();

	$.getJSON('https://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			//cameras = data; //save the data
			data.forEach(function(camera) {//for each camera
				var marker = new google.maps.Marker({//create a marker at the camera's location
					position: {
						lat: Number(camera.location.latitude),
						lng: Number(camera.location.longitude)
					},
					map: map //assign marker to this map
				});
				google.maps.event.addListener(marker, 'click', function() { //when click a marker
					//"this" refers to map (element that raised event)
					var latLng = this.getPosition();
					//pan map so clicked marker is in center
					map.panTo(latLng);
					//open an InfoWindow that displays the latest camera image + label
					var labelImg = '<p>' + camera.cameralabel + '</p>';
					labelImg += '<img src=' + camera.imageurl.url + '>';
					infoWindow.setContent(labelImg);
					infoWindow.open(map, this)//map open on, and anchor to refer to marker
				})
				//close InfoWindow when user clicks on map
				google.maps.event.addListener(map, 'click', function() {
					infoWindow.close();
				});

				//filter markers when type in search box
				$('#search').bind('search keyup', function() {
					var markerLabel = camera.cameralabel;
					var input = $('#search').val().toLowerCase();
					if (markerLabel.toLowerCase().indexOf(input) >= 0) {
						marker.setMap(map);
					} else {
						marker.setMap(null);
					}
				})
			});

		})
		.fail(function(error) {
			alert("There was an error.");
			console.log(error);
		})
		.always(function() {
			$('#ajax-loader').fadeOut();
		});

});