var map;
var place;
var autocomplete;
var infowindow = new google.maps.InfoWindow();

function initialization() {
    showCrimes();
    initAutocomplete();
}

function showCrimes() {
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: { "tab_id": "1"},
        success: function(crimes) {
            mapInitialization(crimes);
        },
        error: function(xhr, status, error) {
            alert("An AJAX error occured: " + status + "\nError: " + error);
        }
    });
}

function mapInitialization(crimes) {
    var mapOptions = {
        mapTypeId : google.maps.MapTypeId.ROADMAP, // Set the type of Map
    };

    // Render the map within the empty div
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var bounds = new google.maps.LatLngBounds ();


    $.each(crimes, function(i, e) {
        var long = Number(e['longitude']);
        var lat = Number(e['latitude']);
        var latlng = new google.maps.LatLng(lat, long);


        bounds.extend(latlng);

        //Pop up Window Content

        var crimeInfoStr = '<h4>Crime Incident Detail</h4><hr>';
        crimeInfoStr += '<p><b>' + 'Date of Incident' + ':</b>&nbsp' + e['INCTDTE'] + '</p>';
        crimeInfoStr += '<p><b>' + 'Date of Reporting' + ':</b>&nbsp' + e['INCREPODT'] + '</p>';
        crimeInfoStr += '<p><b>' + 'Category' + ':</b>&nbsp' + e['CATEGORY'] + '</p>';
        crimeInfoStr += '<p><b>' + 'Description' + ':</b>&nbsp' + e['STATDESC'] + '</p>';
        crimeInfoStr += '<p><b>' + 'Address' + ':</b>&nbsp' + e['ADDRESS'] + '</p>';
        crimeInfoStr += '<p><b>' + 'Incident Number' + ':</b>&nbsp' + e['INCIDID'] + '</p>';
        crimeInfoStr += '<p><b>' + 'Gang Related?' + ':</b>&nbsp' + e['GANGRELAT'] + '</p>';
        crimeInfoStr += '<p><b>' + 'Unit Name' + ':</b>&nbsp' + e['UNITNAME'] + '</p>';

        //  if ('message' in e){
        //     contentStr += '<p><b>' + 'Message' + ':</b>&nbsp' + e['message'] + '</p>';
        //  }

        //****************************************************************************
        // Below is my additional code for creating separate markers in Question 2

        // Create the icon based on report type
        //   if (e['report_type'] == 'damage'){
        //       var tempImage = 'img/damage.png';
        //   } else if (e['report_type'] == 'request'){
        //     var tempImage = 'img/request.png';
        //  } else if (e['report_type'] == 'donation'){
        //     var tempImage = 'img/donation.png';
        //}

        var tempImage = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var icon = {
            url: tempImage,
            scaledSize: new google.maps.Size(25, 25), //scale the icons
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0)
        };

          //var heatmapData = [];
         //  heatmapData.push(latlng);
         //   var heatmap = new google.maps.visualization.HeatmapLayer({
         //       data: heatmapData,
         //         dissipating: false,
         //        map: map
         //    });


        //Set the marker
        var marker = new google.maps.Marker({
            position: latlng, // Position marker to coordinates
            map: map, // assign the market to our map variable
            //  icon : icon
            customInfo: crimeInfoStr
        });

        //Add a Click Listener to the marker
        google.maps.event.addListener(marker, 'click', function () {
            // use 'customInfo' to customize infoWindow
            infowindow.setContent(marker['customInfo']);
            infowindow.open(map, marker); // Open InfoWindow
            //  });

        });

        map.fitBounds(bounds);
    });
}

//*******************************************************************************************
function initAutocomplete() {
    // Create the autocomplete object
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
    // When the user selects an address from the dropdown, show the place selected
  //  autocomplete.addListener('place_changed', onPlaceChanged);
}

google.maps.event.addDomListener(window, 'load', initialization);

/*
// Below is my code for Question 3 to zoom to the selected place
// *************************************************************
function onPlaceChanged() {
    place = autocomplete.getPlace();
    var placeMarker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0,0)
    });
    placeMarker.setVisible(false);

    // Check to see if the selected place is valid.  If not, notify user
    if (!place.geometry) {
        window.alert("'" + place.name + "'" + " could not be found.  Please try again");
        return;
    }

    // If place is valid, zoom to location
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(13);
      //  placeMarker.setPosition(place.geometry.location);
      //  placeMarker.setVisible(true);
    }
}


//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);

// createReport Function for question 4
//**************************************************************************
function queryReport(event) {
    event.preventDefault(); // stop form from submitting normally
    var a = $("#query_report_form").serializeArray();
    a.push({ name: "tab_id", value: "1" });
    a = a.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: a,
        success: function(crimes) {
            mapInitialization(crimes);
        },
        error: function(xhr, status, error) {
            alert("Status: " + status + "\nError: " + error);
        }
    });
}

$("#query_report_form").on("submit",queryReport);


// createReport Function for question 4
//**************************************************************************

function createReport(event) {
    event.preventDefault(); // stop form from submitting normally`
    var reportForm = document.getElementById("create_report_form");
    var a = $("#create_report_form").serializeArray();

    // Make sure that a place is entered and that it has valid geometry.
    // If not, provide an alert and reset the form
    if (place != null && place.geometry) {
        var latNum = place.geometry.location.lat();
        var lonNum = place.geometry.location.lng();
        var latStr = latNum.toString();
        var lonStr = lonNum.toString();
        a.push({name: "longitude", value: lonStr});
        a.push({name: "latitude", value: latStr});

        // set the place to null in case next report attempt uses invalid place and previous place remains as a global variable
        place = null;
    } else {
        window.alert("A valid place needs to be entered for your report. Please try again");
        reportForm.reset(); // reset the create report form
        $(reportForm).find(".additional_msg_div").css("visibility", "hidden"); // hide additional message
        return;
    }

    a.push({name: "tab_id", value: "0"});
    console.log(a); // check array keys/values

    a = a.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: a,
        success: function(crimes) {
            showCrimes();  // Show all crimes also calls mapInitialization
            reportForm.reset(); // reset the create report form
            $(reportForm).find(".additional_msg_div").css("visibility", "hidden"); // hide additional message
            window.alert("The report is successfully submitted!"); // inform user that report was successful
         },
        error: function(xhr, status, error) {
            alert("Status: " + status + "\nError: " + error);
        }
    });
}

$("#create_report_form").on("submit",createReport);

*/