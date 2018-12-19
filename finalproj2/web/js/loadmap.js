var map;
var incidentPlace;
var incidentPlaceName;

var autocomplete_incident;
var autocomplete;

var baseMapLayer;  // controls which demographic attribute is depicted.  Will change based on dropdown menu value.
var baseMapOff = "True";
var heatMapOff = "False";
var supportOrgsOff = "True";

var infowindow = new google.maps.InfoWindow();
var legendValues = [];
var legendColors;


var swLatLng = new google.maps.LatLng(33, -119);
var neLatLng = new google.maps.LatLng(35, -117);
var startUpBounds = new google.maps.LatLngBounds(swLatLng, neLatLng);
var currentBounds = new google.maps.LatLngBounds();

var currentCenter = new google.maps.LatLng(34.31, -118.2);
var currentZoom = 9;
//var symbolScaledSize = new google.maps.Size(20, 20);

var startUpView = "True";

function initialization() {
    showCrimes();
    initAutocomplete();

}

//***************************************************************************************************************
function showCrimes() {
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: { "tab_id": "1"},
        success: function(crimes) {
            mapInitialization(crimes);
        },
        error: function(xhr, status, error) {
            alert("An AJAX error ocurred: " + status + "\nError: " + error);
        }
    });
}

//***************************************************************************************************************
function mapInitialization(crimes) {
    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP, // Set the type of Map
    };

    // Render the map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var bounds = new google.maps.LatLngBounds();
    var heatmapData = [];

    $.each(crimes, function (i, e) {
        var long = Number(e['longitude']);
        var lat = Number(e['latitude']);
        // console.log(long);
        //  console.log(lat);
        if (long != -1.7976931348623157e+308) {
                var latlng = new google.maps.LatLng(lat, long);
                heatmapData.push(latlng);
                bounds.extend(latlng);
        }

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

        //****************************************************************************

        // Icon images for markers
        var icon_img = '';
        if (e['CATEGORY'] === 'DRUNK DRIVING VEHICLE / BOAT') {
            icon_img = 'http://cdn.onlinewebfonts.com/svg/img_332409.png';
        } else if (e['CATEGORY'] === 'NARCOTICS') {
            icon_img = 'https://cdn0.iconfinder.com/data/icons/medical-5/450/capsule-512.png';
        } else if (e['CATEGORY'] === 'BURGLARY') {
            icon_img = 'data/burglar-icon-13.jpg';
          //  icon_img = 'http://chittagongit.com/images/burglar-icon/burglar-icon-13.jpg';
        } else if (e['CATEGORY'] === 'CRIMINAL HOMICIDE') {
            icon_img = 'https://static.thenounproject.com/png/225529-200.png';
        }

        var icon = {
            url: icon_img, // url
            scaledSize: new google.maps.Size(25, 25), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        if (heatMapOff == "True") {
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                icon: icon,
                //zoom: 10,
                customInfo: crimeInfoStr
            });

            //Add a Click Listener to the marker
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(marker['customInfo']);
                infowindow.open(map, marker); // Open InfoWindow
            });
        }

    });

    map.setCenter(currentCenter);
    map.setZoom(currentZoom);


    if (heatMapOff == "False") {
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            //dissipating: false,
            radius: 20,
            map: map
        });

        var gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ];

        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        heatmap.setMap(map);
    }

    if (baseMapOff == "False") {
        setBaseMap();
    }

    if (supportOrgsOff == "False") {
        setSupportOrgs();
    }

    if ((heatMapOff == "True") || (baseMapOff == "False") || (supportOrgsOff=="False"))  {
        createLegend();
    }
    map.addListener('zoom_changed', function() {
        console.log(map.getZoom());
    });

    map.addListener('bounds_changed', function() {
       currentCenter = map.getCenter();
       currentZoom = map.getZoom();

    });

}

//*********************************************************************************************
function createLegend(){

    var legend = document.createElement('div');
    legend.innerHTML = '<H4>Legend</H4>';
    legend.id = "legend";

    if (heatMapOff == "True") {
        var crimeIcons = {
            burglary: {
                name: 'Burglary',
                icon: 'data/burglar.png'
            },
            drunkDriving: {
                name: 'Homicide',
                icon: 'data/homicide.png'
            },
            homicide: {
                name: 'Drunk Driving',
                icon: 'data/drunk_driving.png'
            },
            narcotics: {
                name: 'Narcotics',
                icon: 'data/narcotics.png'
            },
        };
           for (var key in crimeIcons) {
            var type = crimeIcons[key];
            var name = type.name;
            var icon = type.icon;
            var div = document.createElement('div');
            div.innerHTML = '<img src="' + icon + '"> ' + name;
            legend.appendChild(div);
        }
    }// crimeSymbols

    if (supportOrgsOff == "False"){
        var supportIcons = {
            support: {
                name: 'Support Organization',
                icon: 'data/legdot.png'
            }
        };
        for (var key in supportIcons) {
            var type = supportIcons[key];
            var name = type.name;
            var icon = type.icon;
            var div = document.createElement('div');
            div.innerHTML = '<img src="' + icon + '"> ' + name;
            legend.appendChild(div);
        }
    }

    if (baseMapOff == "False"){

        var greenIcons = ['data/green1.png','data/green2.png','data/green3.png','data/green4.png','data/green5.png'];
        var redIcons = ['data/red1.png','data/red2.png','data/red3.png','data/red4.png','data/red5.png'];
        var orangeIcons = ['data/orange1.png','data/orange2.png','data/orange3.png','data/orange4.png','data/orange5.png'];
        var blueIcons = ['data/blue1.png','data/blue2.png','data/blue3.png','data/blue4.png','data/blue5.png'];

        var tempIcons = [];

        if (legendColors == "green"){
            tempIcons = greenIcons;
        }
        else if (legendColors == "red"){
            tempIcons = redIcons;
        }
        else if (legendColors == "orange"){
            tempIcons = orangeIcons;
        }
        else if (legendColors == "blue"){
            tempIcons = blueIcons;
        }

        var legendTextArray = [];
        if (baseMapLayer == "medinc") {
            var extraChar = "$";
            var tempText4 = legendValues[0];
            var tempText3 = legendValues[1];
            var tempText2 = legendValues[2];
            var tempText1 = legendValues[3];

            var legText1 = extraChar + "0" + " to " + extraChar + tempText1;
            var legText2 = extraChar + tempText1 + " to " + extraChar + tempText2;
            var legText3 = extraChar + tempText2 + " to " + extraChar + tempText3;
            var legText4 = extraChar + tempText3 + " to " + extraChar + tempText4;
            var legText5 = extraChar + tempText4 + " or More";

            legendTextArray = [legText1, legText2, legText3, legText4, legText5];
        }
        else if (baseMapLayer != "medinc" ) {
            var extraChar = "%";
            var tempText4 = legendValues[0];
            var tempText3 = legendValues[1];
            var tempText2 = legendValues[2];
            var tempText1 = legendValues[3];

            var legText1 = "0.0" + extraChar + " to " + tempText1 + extraChar;
            var legText2 = tempText1 + extraChar +  " to " + tempText2 + extraChar;
            var legText3 = tempText2 + extraChar +  " to " + tempText3 + extraChar;
            var legText4 = tempText3 + extraChar +  " to " + tempText4 + extraChar;
            var legText5 = tempText4 + extraChar +  " or More";

            legendTextArray = [legText1, legText2, legText3, legText4, legText5];
        }

        console.log(legendTextArray);

        for (i = 0; i < legendTextArray.length; i++){
            var name = legendTextArray[i];
            var icon = tempIcons[i];
            var div = document.createElement('div');
            div.innerHTML = '<img src="' + icon + '"> ' + name;
            legend.appendChild(div);
        }
    }
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
   // }
}
//*********************************************************************************************
//The setBaseMap function is used to depict basemap demographic layers based on user selections
function setSupportOrgs() {
    var supportOrgLayer = new google.maps.Data();
    supportOrgLayer.loadGeoJson('data/supportOrgs.json');

    var supportIcon = {
        url: 'data/dot.png', // url
        scaledSize: new google.maps.Size(10, 10), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    supportOrgLayer.setStyle ({
        icon: supportIcon
        });

    // popup with organization data
    supportOrgLayer.addListener('click', function(e) {
        //  console.log(e);
            infowindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;">' +
                '<p><b>' + 'Organization Name' + ':</b>&nbsp' +  e.feature.getProperty('CONAME') + '</p>' +
                '<p><b>' + 'City' + ':</b>&nbsp' +  e.feature.getProperty('CITY') + '</p>' +
                '<p><b>' + 'ZIP Code' + ':</b>&nbsp' +  e.feature.getProperty('ZIP') + '</p>' +
                '<p><b>' + 'Number of Employees' + ':</b>&nbsp' +  e.feature.getProperty('EMPNUM') + '</p></div>');

        var anchor = new google.maps.MVCObject();
        anchor.set("position", e.latLng);
        infowindow.open(map, anchor);
    });

    supportOrgLayer.setMap(map); // add the demographic layer to the map
}

//*********************************************************************************************
//The setBaseMap function is used to depict basemap demographic layers based on user selections
function setBaseMap() {
    var demographicLayer = new google.maps.Data();
    demographicLayer.loadGeoJson('data/demwgs2016.json');  // basemap Census tract data
    var attributeLabel;
    var extraChar;

    // stores values for depicting tract fill colors; color values from ColorBrewer (Thanks Cynthia, Mark, Ben, Andy and David!)
    var colorArrayGreen = ['#006d2c', '#31a354', '#74c476', '#bae4b3', '#edf8e9'];
    var colorArrayRed = ['#a50f15', '#de2d26', '#fb6a4a', '#fcae91', '#fee5d9'];
    var colorArrayOrange = ['#a63603', '#e6550d', '#fd8d3c', '#fdbe85', '#feedde'];
    var colorArrayBlue = ['#0868ac', '#43a2ca', '#7bccc4', '#bae4bc', '#f0f9e8'];
    var tempColorArray = [];
    var valueArray = [];  // stores values for class breaks

    if (baseMapLayer == "medinc") {
      attributeLabel = 'Median Household Income';
      tempColorArray = colorArrayGreen;
      legendColors = "green";
      valueArray = [83930, 63604, 48093, 36454];
      extraChar = "$";
    }
    else if (baseMapLayer == "povu18") {
        attributeLabel = 'Poverty Level: Population Under Age 18';
        tempColorArray = colorArrayOrange;
        legendColors = "orange";
        valueArray = [40.3, 26.5, 14.0, 5.1];
        extraChar = "%"
    }
    else if (baseMapLayer == 'povall') {
        attributeLabel = 'Poverty Level: Total Population';
        tempColorArray = colorArrayOrange;
        legendColors = "orange";
        valueArray = [28.3, 19.3, 12.1, 7.5];
        extraChar = "%"
    }
    else if (baseMapLayer == 'AgeU14') {
        attributeLabel = 'Share of Population Under age 15';
        tempColorArray = colorArrayRed;
        legendColors = "red";
        valueArray = [23.7, 19.9, 17.2, 14.0];
        extraChar = "%"
    }
    else if (baseMapLayer == 'Age1519') {
        attributeLabel = 'Share of Population Age 15 to 19';
        tempColorArray = colorArrayRed;
        legendColors = "red";
        valueArray = [8.7, 7.2, 5.9, 4.4];
        extraChar = "%"
    }
    else if (baseMapLayer == 'Age2024') {
        attributeLabel = 'Share of Population Age 20 to 24';
        tempColorArray = colorArrayRed;
        legendColors = "red";
        valueArray = [9.6, 8.1, 6.8, 5.2];
        extraChar = "%"
    }
    else if (baseMapLayer == 'Age2544') {
        attributeLabel = 'Share of Population Age 25 to 44';
        tempColorArray = colorArrayRed;
        legendColors = "red";
        valueArray = [34.0, 30.2, 27.6, 24.3];
        extraChar = "%"
    }
    else if (baseMapLayer == 'Ag4564') {
        attributeLabel = 'Share of Population Age 45 to 64';
        tempColorArray = colorArrayRed;
        legendColors = "red";
        valueArray = [29.8, 26.4, 23.7, 20.6];
        extraChar = "%"
    }
    else if (baseMapLayer == 'Age65Ovr') {
        attributeLabel = 'Share of Population Age 65 and Over';
        tempColorArray = colorArrayRed;
        legendColors = "red";
        valueArray = [17.2, 13.1, 10.3, 7.6];
        extraChar = "%"
    }
    else if (baseMapLayer == 'lthigh') {
        attributeLabel = 'Highest Education Attainment: Less than High School';
        tempColorArray = colorArrayBlue;
        legendColors = "blue";
        valueArray = [41.1, 26.3, 14.5, 5.9];
        extraChar = "%"
    }
    else if (baseMapLayer == 'highsch') {
        attributeLabel = 'Highest Education Attainment: High School Graduate';
        tempColorArray = colorArrayBlue;
        legendColors = "blue";
        valueArray = [27.6, 23.6, 19.7, 13.6];
        extraChar = "%"
    }
    else if (baseMapLayer == 'smeasso') {
        attributeLabel = 'Highest Education Attainment: Some College or Associate Degree';
        tempColorArray = colorArrayBlue;
        legendColors = "blue";
        valueArray = [32.8, 27.5, 23.6, 18.7];
        extraChar = "%"
    }
    else if (baseMapLayer == 'bachigh') {
        attributeLabel = 'Highest Education Attainment: Bachelor Degree or Higher';
        tempColorArray = colorArrayBlue;
        legendColors = "blue";
        valueArray = [50.3, 30.8, 18.7, 9.6];
        extraChar = "%"
    }

    legendValues = valueArray;

    // returns a color based on the value given when the function is called
    function getColor(val) {
        return val >= valueArray[0] ? tempColorArray[0] :
            val > valueArray[1] ? tempColorArray[1] :
                val > valueArray[2] ? tempColorArray[2] :
                    val > valueArray[3] ? tempColorArray[3] :
                        tempColorArray[4];
    }

    // sets the style of the demographic layer
    demographicLayer.setStyle(function(feature) {
        return {
            fillColor: getColor(feature.getProperty(baseMapLayer)), // sets color and class breaks of census tracts
            fillOpacity: 0.8,
            strokeColor: '#b3b3b3',
            strokeWeight: 1,
            zIndex: 1
        };
    });

    demographicLayer.setMap(map); // add the demographic layer to the map

    // highlight census tract on mouse over
    demographicLayer.addListener('mouseover', function(e) {
        demographicLayer.overrideStyle(e.feature, {
            strokeColor: '#ffffff',
            strokeWeight: 1,
            zIndex: 2
        });
    });

    // reset layer on mouseout
    demographicLayer.addListener('mouseout', function(e) {
        demographicLayer.revertStyle();
    });

    // popup with census tract data
    demographicLayer.addListener('click', function(e) {
      //  console.log(e);
        var tempLabel;
        if (extraChar == "$") { // use to set label if value is a dollar amount

                infowindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;">' +
                '<p><b>' + 'Census Tract' + ':</b>&nbsp' +  e.feature.getProperty('Geography') + '</p>' +
                '<p><b>' + attributeLabel + ':</b>&nbsp' + extraChar +  e.feature.getProperty(baseMapLayer) + '</p></div>');
        }
        else if (extraChar == "%") { // use to set label if value is a percentage
            infowindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;">' +
                '<p><b>' + 'Census Tract' + ':</b>&nbsp' +  e.feature.getProperty('Geography') + '</p>' +
                '<p><b>' + attributeLabel + ':</b>&nbsp' +  e.feature.getProperty(baseMapLayer) + extraChar +'</p></div>');
        }

        var anchor = new google.maps.MVCObject();
            anchor.set("position", e.latLng);
            infowindow.open(map, anchor);
    });
}

//***************************************************************************************************************
function initAutocomplete() {

    var options = {
        bounds: startUpBounds
    };

    // Create the autocomplete object
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),options);
    autocomplete_incident = new google.maps.places.Autocomplete(document.getElementById('autocomplete_incident'),options);

     // When the user selects an address from the dropdown, show the place selected
    autocomplete.addListener('place_changed', onPlaceChanged);
    autocomplete_incident.addListener('place_changed', setIncidentPlace);
}

//*********************************************************************************************
function onPlaceChanged(){
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
       //     map.fitBounds(place.geometry.viewport);
      //  } else {
            map.setCenter(place.geometry.location);
            map.setZoom(12);  // Why 12? Because it looks good.
            var circle = new google.maps.Circle({
                map: map,
                radius: 8046,    // 5 miles in metres
                fillColor: '#AA0000'
            });
            circle.bindTo('center', marker, 'position');
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        }

}

google.maps.event.addDomListener(window, 'load', initialization);

//*********************************************************************************************
function setIncidentPlace() {

    incidentPlace = autocomplete_incident.getPlace();

    var placeMarker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0,0)
    });
    placeMarker.setVisible(false);

    // Check to see if the selected place is valid.  If not, notify user
    if (!incidentPlace.geometry) {
        window.alert("'" + incidentPlace.name + "'" + " could not be found.  Please try again");
        return;
    }

    // If place is valid, zoom to location
    if (incidentPlace.geometry) {
        map.panTo(incidentPlace.geometry.location);
        map.setZoom(15);
        incidentPlaceName = incidentPlace.name;
    }
}

//*********************************************************************************************
function queryIncidents(event) {
    event.preventDefault(); // stop form from submitting normally
    var a = $("#query_form").serializeArray();
    a.push({ name: "tab_id", value: "1" });
    a = a.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: a,
        success: function(crimes) {


            for (i = 0; i < a.length; i++) {
                if (a[i].name == "crimeSymbols") {
                    crimeSymbolsOn = a[i].value;
                    if (crimeSymbolsOn == "symbols") {
                        heatMapOff = "True"
                    }
                    if (crimeSymbolsOn == "heatMap") {
                        heatMapOff = "False"
                    }
                }
            }

           // console.log(a);
           // var length = a.length;

            for (i = 0; i < a.length; i++) {
                if (a[i].name == "demo_attribute") {
                    baseMapLayer = a[i].value;
                    console.log(baseMapLayer);
                }
            }
            for (i = 0; i < a.length; i++) {
                if (a[i].name == "demo_layer"){
                    demoLayerOn = a[i].value;
                    if (demoLayerOn == "t") {
                        console.log(demoLayerOn);
                        console.log(baseMapLayer);
                        baseMapOff = "False";
                        //setBaseMap();
                    }
                    else if (demoLayerOn == "f") {
                        baseMapOff = "True";
                    }
                }
            }

            for (i = 0; i < a.length; i++) {
                if (a[i].name == "support_layer"){
                    supportLayerOn = a[i].value;
                    if (supportLayerOn == "t") {
                        console.log(demoLayerOn);
                        console.log(baseMapLayer);
                        supportOrgsOff = "False";

                    }
                    else if (supportLayerOn == "f") {
                        supportOrgsOff = "True";
                    }
                }
            }
            mapInitialization(crimes);
        },
        error: function(xhr, status, error) {
            alert("Status: " + status + "\nError: " + error);
        }
    });
}

$("#crime_type").on("change",queryIncidents);
$("#crimeSymbols").on("change",queryIncidents);
$("#demo_layer").on("change",queryIncidents);
$("#demo_attribute").on("change",queryIncidents);
$("#support_layer").on("change",queryIncidents);



//*********************************************************************************************
function createIncident(event) {
    event.preventDefault(); // stop form from submitting normally`
    var incidentForm = document.getElementById("create_form");
    var a = $("#create_form").serializeArray();

    // Make sure that a place is entered and that it has valid geometry.
    // If not, provide an alert and reset the form
    if (incidentPlace != null && incidentPlace.geometry) {
        var latNum = incidentPlace.geometry.location.lat();
        var lonNum = incidentPlace.geometry.location.lng();
        var latStr = latNum.toString();
        var lonStr = lonNum.toString();
        a.push({name: "longitude", value: lonStr});
        a.push({name: "latitude", value: latStr});
        a.push({name: "address", value: incidentPlaceName});

        // set the place to null in case next report attempt uses invalid place and previous place remains as a global variable
        incidentPlace = null;
        document.getElementById("autocomplete_incident").placeholder = 'Incident Address';

    } else {
        window.alert("A valid place needs to be entered for your incident. Please try again");
       // incidentForm.reset(); // reset the create report form
        return;
    }

    a.push({name: "tab_id", value: "0"});
    console.log(a); // check array keys/values

    a = a.filter(function(item){return item.value != '';});
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: a,
        success: function(incidents) {
            showCrimes();  // Show all crimes also calls mapInitialization
            window.alert("The incident was successfully submitted."); // inform user that report was successful
         },
        error: function(xhr, status, error) {
            alert("Status: " + status + "\nError: " + error);
        }
    });
}

$("#create_form").on("submit",createIncident);
