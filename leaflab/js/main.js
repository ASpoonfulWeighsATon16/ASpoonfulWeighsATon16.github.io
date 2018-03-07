// Share or shr is used to designate functions or objects tied to the Proprietor Share layer
// Income or inc is used to designate functions or objects tied to the Proprietor Income layer

// The following function creates the leaflet map object and sets the map center and zoom level
function createMap() {
    var mymap = L.map('map', {
       
        center: [40.5, -98], 
        zoom: 5
        
    });
    
    // add layers, basemap and layers
    var propShareLayer = new L.geoJson()
    var propIncomeLayer = new L.geoJson().addTo(mymap);

    var grayBaseMap =  L.tileLayer('https://api.mapbox.com/styles/v1/aspoonfulweighsaton/cje69kflt83ta2snts1nubkti/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXNwb29uZnVsd2VpZ2hzYXRvbiIsImEiOiJjajZ4bzA2Nm0xazVzMnduemh4YjlybGYyIn0.VZLEWPIshYHPL5RO8AFbcw', {
    attribution: 'Sources: U.S. Bureau of Economic Analysis, U.S. Census Bureau and Mapbox'  // 
     }).addTo(mymap);
       
   //call functions to initialize map components
    getPropIncData(mymap, propIncomeLayer);
    getPropShareData(mymap, propShareLayer);
   
    propShareLayer.addTo(mymap);
    
    //add to layer control and set layer control values
    var baseMaps = {
        "Gray Base Layer": grayBaseMap
     };
     
    var overlays = {
        "<span style='color: gray'>Average Proprietor Income</span>": propIncomeLayer, 
        "<span style='color: gray'>Proprietors as a Share of Employment</span>": propShareLayer
         
         //"<span style='color: gray'>Metro Areas</span>": msaLayer
    };
    
    L.control.layers(baseMaps, overlays, {collapsed:false, autoZIndex:true, hideSingleBase:true, sortLayers:false}).addTo(mymap);
    
};  //function createMap

//load the Proprietor Share data from JSON file and initalize symbols and controls related to this layer
function getPropShareData(map, propShareLayer){
    $.ajax("data/msa_1mil_propper.json", {
        dataType: "json",
        success: function(response){
            var attributes = processPropShareData(response);
            createPropShareSymbols(response, propShareLayer, attributes);
            createShareSequenceControls(map, propShareLayer, attributes);
        }
    });
};

//load the Proprietor Income data from JSON file and initalize symbols and controls related to this layer
function getPropIncData(map, propIncomeLayer){
    $.ajax("data/msa_1mil_propinc.json", {
        dataType: "json",
        success: function(response){
            var attributes = processPropIncData(response);
            createPropIncSymbols(response, propIncomeLayer, attributes);
            createIncSequenceControls(map, propIncomeLayer, attributes);  
        }
    });
};

//Get attributes for proprietor share data. 
function processPropShareData(data){
    var attributes = [];
    var properties = data.features[0].properties;
    
    //only use those columns starting with "per"
    for (var attribute in properties){
        if(attribute.indexOf("per") > -1 ){
            attributes.push(attribute);
        };
    };
    //console.log (attributes);
    return attributes;
};

//Get attributes for proprietor Income data. 
function processPropIncData(data){
    var attributes = [];
    var properties = data.features[0].properties;
    
    //only use those columns starting with "yr"
    for (var attribute in properties){
        if(attribute.indexOf("yr") > -1 ){
            attributes.push(attribute);
        };
    };
    //console.log (attributes);
    return attributes;
};

//spawn JSON points to symbols and add to the layer
function createPropShareSymbols (data, propShareLayer, attributes) {
    propShareSymbols = L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return propSharePointToLayer(map, feature, latlng, attributes);  
        }
    }).addTo(propShareLayer); 
    return propShareSymbols;
};

//spawn JSON points to symbols and add to the layer
function createPropIncSymbols (data, propIncomeLayer, attributes) {
    propIncSymbols = L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return propIncPointToLayer(map, feature, latlng, attributes);  
        }
    }).addTo(propIncomeLayer);
    return propIncSymbols;
};


// set symbolization and layer listeners for proprietor income
function propSharePointToLayer(map, feature, latlng, attributes){
    var attribute = attributes[0];
    
    //symbology
    var options = {
        fillColor: "#fd8d3c",
        color: "#d94701",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7 
    };
    
    var attrValue = Number(feature.properties[attribute]);
    options.radius = calcPropShareRadius(attrValue);
    var layer = L.circleMarker(latlng, options);
    
   //listeners for proprietor share
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function() {
            this.closePopup();
        },
        click: function() {
          this.openPopup();
        }
    });

    return layer;
};

//set symbolization and layer listeners for proprietor income
function propIncPointToLayer(map, feature, latlng, attributes){
    var attribute = attributes[0];
    // console.log(attribute);
    //symbology
    var options = {
        fillColor: "#6baed6",
        color: "#2171b5",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7 
    };
    
    var attrValue = Number(feature.properties[attribute]);
    options.radius = calcPropIncRadius(attrValue);
    var layer = L.circleMarker(latlng, options);
    
    //listeners for proprietor income
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function() {
            this.closePopup();
        },
        click: function() {
           this.openPopup(); 
        }
    });
    return layer;
};

//create sequence controls for proprietor share data 
function createShareSequenceControls (map, propShareLayer, attributes){
    var SequenceControl1 = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            var container1 = L.DomUtil.create('div', 'sequence-control-container1');
            
             $(container1).append('<div id="sequence-control-text1">');// used to hold control layer refernce
             $(container1).append('<input class="range-slider1" type="range">');
             $(container1).append('<button class="skip1" id="reverse"><<</button>');
             $(container1).append('<button class="skip1" id="forward">>></button>');
            
            $(container1).on('mousedown dblclick pointerdown', function(e){
                L.DomEvent.stopPropagation(e);
            });
            
            return container1;
        }
    });
    
    createShareLegend(map,attributes); // call here to initialize popup container values, otherwise do not exist until controls are clicked.
    map.addControl(new SequenceControl1());// add control to map
    
    $('.range-slider1').attr({
        max: 46,    //46 refers to number of items in the attributes
        min: 0,
        value: 0,
        step: 1
    });
    
    updatePropShareSymbols(propShareSymbols, map, attributes[0]);
    var content = "Proprietors as a Share of Total Employment"; 
    $('#sequence-control-text1').html(content); // add label to controls
    
    //button functions
    $('.skip1').click(function(){
       var index1 = $('.range-slider1').val();
       
       if ($(this).attr('id') == 'forward'){
           index1++;
           index1 = index1 > 46 ? 0: index1;  //46 refers to number of items in the attributes
       } else if  ($(this).attr('id') == 'reverse'){
            index1--;
            index1 = index1 < 0 ? 46: index1;
       };
        
       $('.range-slider1').val(index1);
        updatePropShareSymbols(propShareSymbols, map, attributes[index1]);  
    }); 
    
    //slider movement
    $('.range-slider1').on('input', function(){
        var index1 = $(this).val();
        updatePropShareSymbols(propShareSymbols, map, attributes[index1]);
    });
    
};

//create sequence controls for proprietor income data 
function createIncSequenceControls (map, propIncLayer, attributes){
    var SequenceControl2 = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            var container2 = L.DomUtil.create('div', 'sequence-control-container2');
            $(container2).append('<div id="sequence-control-text2">');
             $(container2).append('<input class="range-slider2" type="range">');
             $(container2).append('<button class="skip2" id="reverse"><<</button>');
             $(container2).append('<button class="skip2" id="forward">>></button>');
            
            $(container2).on('mousedown dblclick pointerdown', function(e){
                L.DomEvent.stopPropagation(e);
            });

            return container2;
        }
    });
    
    // call here to initialize popup container values, otherwise do not exist until controls are clicked.
    createIncomeLegend(map,attributes); 
    
    map.addControl(new SequenceControl2()); // add control to map
    
   
    $('.range-slider2').attr({
        max: 46,  //46 refers to number of items in the attributes
        min: 0,
        value: 0,
        step: 1
    });
    
    updatePropIncomeSymbols(propIncSymbols, map, attributes[0]);
    var content = "Average Proprietor Income ($2016)";
    $('#sequence-control-text2').html(content);
    
    //button functions
    $('.skip2').click(function(){
       var index = $('.range-slider2').val();
       
       if ($(this).attr('id') == 'forward'){
           index++;
           index = index > 46 ? 0: index;
       } else if  ($(this).attr('id') == 'reverse'){
            index--;
            index = index < 0 ? 46: index; //46 refers to number of items in the attributes
       };
        
       $('.range-slider2').val(index);
        updatePropIncomeSymbols(propIncSymbols, map, attributes[index]);
    }); 
    
     //slider movement
    $('.range-slider2').on('input', function(){
        var index = $(this).val();
        updatePropIncomeSymbols(propIncSymbols, map, attributes[index]);
    });
    
};

//function updates the proprietor income level when slider or buttons are clicked
function updatePropShareLegend(map, attribute){    
    var year = attribute.split("_")[1];
    var content = "Proprietors as a Share of Total Employment in " + year;    
    $('#temporal-legend1').html(content);   //label year of data
    
    var circleShareValues = getShareCircleValues(propShareSymbols, attribute);  
    //console.log(circleShareValues)
   
    for (var circleShareNum in circleShareValues){
        var radius = calcPropShareRadius(circleShareValues[circleShareNum]);
        $('#'+circleShareNum).attr({
            cy: 85 - radius,  //adjusts base location of circles in legend
            r: radius          
        });
        
        $('#'+circleShareNum+'-text').text(Math.round(circleShareValues[circleShareNum]*100)/100+ "%");
     };
};


//function updates the proprietor income level when slider or buttons are clicked
function updatePropIncomeLegend(map, attribute){    
    var year = attribute.split("_")[1];
    var content = "Average Proprietor Income in " + year + ' (in $2016)';    
    $('#temporal-legend2').html(content);  //label year of data
    
    var circleIncValues = getIncCircleValues(propIncSymbols, attribute);  
    //console.log(circleIncValues)
 
    for (var circleIncNum in circleIncValues){
        var radius = calcPropIncRadius(circleIncValues[circleIncNum]);
        $('#'+circleIncNum).attr({
            cy: 85 - radius,  //adjusts initial base location of circles in legend
            r: radius          
        });
    
        $('#'+circleIncNum+'-text').text(circleIncValues[circleIncNum]);  //attribute text
     };
};

//create income legend control and set circle values 
function createShareLegend(map, attributes){
    var LegendShareControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        onAdd: function (map) {
            
            var container3 = L.DomUtil.create('div', 'legend-control-container1');
            $(container3).append('<div id="temporal-legend1">');  
            var svg = '<svg id="attribute-legend1" width="200px" height="90px">';
            
            var circlesShare = ["shareMax", "shareVal3", "shareVal2", "shareMin" ];
            
            var offSet = 85;  // used to adjust label height instead of using example in tutorial
            var tempIndex = 4;  //used to reorder labels to match circle size        
            for (var i=0; i < circlesShare.length; i++){
                tempIndex -= 1
                svg += '<circle class="legend-circle" id="' + circlesShare[i] + '" fill="#fd8d3c" fill-opacity="0.8" stroke="#d94701" cx="40"/>';
                svg += '<text id="' + circlesShare[tempIndex] +'-text" x="95" y="' + offSet + '"></text>'
                offSet -= 15; // adjust label offset to move label location
            };
            svg += "</svg>";
            $(container3).append(svg)
                    
            return container3;
        }
    });
    
    map.addControl(new LegendShareControl());// add control to map
    updatePropShareLegend(map, attributes[0])
};

//create income legend control and set circle values 
function createIncomeLegend(map, attributes){
    var incLegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        onAdd: function (map) {
            
            var container = L.DomUtil.create('div', 'legend-control-container2');
            $(container).append('<div id="temporal-legend2">');  
            var svg = '<svg id="attribute-legend2" width="200px" height="90px">';
            
            var circlesInc = ["incMax", "incVal3", "incVal2", "incMin"];
            
            var offSet = 85; // used to adjust label height instead of using example in tutorial
            var tempIndex = 4;//used to reorder labels to match circle size  
            for (var i=0; i < circlesInc.length; i++){
                tempIndex -= 1;
                svg += '<circle class="legend-circle" id="' + circlesInc[i] + '" fill="#6baed6" fill-opacity="0.8" stroke="#2171b5" cx="40"/>';
            
                svg += '<text id="' + circlesInc[tempIndex] +'-text" x="95" y="' + offSet + '"></text>'
                offSet -= 17; // adjust label offset to move label location. Is different to account for different circle sizes.
            };
            svg += "</svg>";
            $(container).append(svg);
                    
            return container;
        }
    });
    map.addControl(new incLegendControl());  // add control to map
    updatePropIncomeLegend(map, attributes[0])
};

//used for circle symbols for proprietor share of employment
function calcPropShareRadius(attrValue) {
    var scaleFactor = 45; // can be adjusted to play with circle sizes
    var area = attrValue * scaleFactor;
    var radius = Math.sqrt(area/Math.PI);
    return radius
};


//used for circle symbols for proprietor income
function calcPropIncRadius(attrValue) {
    var scaleFactor = 0.055; // can be adjusted to play with circle sizes
    var area = attrValue * scaleFactor;
    var radius = Math.sqrt(area/Math.PI);
    return radius
};

//sets the range of values for proprietor share circles.  Uses for equal interval classes.
function getShareCircleValues(map, attribute){
    var shareMin = Infinity,
        shareMax = -Infinity;
    map.eachLayer(function(layer){
        if (layer.feature) {
           var attributeValue = Number(layer.feature.properties[attribute]);
           if (attributeValue < shareMin){
               shareMin = attributeValue;
           };
           if (attributeValue > shareMax){
               shareMax = attributeValue;
           };
         };
    });
    
    var attrInc = (shareMax - shareMin) / 3;
    var shareVal2 = shareMin + attrInc;
    var shareVal3 = shareVal2 + attrInc;
    
   //four equal interval values
    return {
        shareMin: shareMin,
        shareVal2: shareVal2,
        shareVal3: shareVal3,
        shareMax: shareMax
    };
};

//sets the range of values for proprietor Income circles.  Uses for equal interval classes.
function getIncCircleValues(map, attribute){
    var incMin = Infinity,
        incMax = -Infinity;
    map.eachLayer(function(layer){
        if (layer.feature) {
           var attributeValue = Number(layer.feature.properties[attribute]);
           if (attributeValue < incMin){
               incMin = attributeValue;
           };
           if (attributeValue > incMax){
               incMax = attributeValue;
           };
         };
    });
    
    var attrInc = (incMax - incMin) / 4;
    var incVal2 = incMin + attrInc;
    var incVal3 = incVal2 + attrInc;
    
   // console.log (min)
    return {
       incMax: incMax,
       incVal3: incVal3,
       incVal2: incVal2,
       incMin: incMin
    };
};

//change size of circle values on map (and update legend)
function updatePropShareSymbols(propShareSymbols, map, attribute){   
    
    var scaleAdj = 1;// had orginally used this to play with adjusting symbols with changes to zoom level
 
      propShareSymbols.eachLayer(function(layer){
        if(layer.feature && layer.feature.properties[attribute]){
            var props = layer.feature.properties;
            var radius = calcPropShareRadius(props[attribute]);
            layer.setRadius(radius*scaleAdj);
   
            updatePropShareLegend(map, attribute);
            
            //set popup text for mouse events
            var perChar = "%";
            var shareChange = 0.0
            popupContent = "<p><b>Metro Area:</b> " + props.GeoName + " </p><p><b>" + "Proprietors as Percent of Total Employment" + ": </b>" + props[attribute] + perChar + "</p>";
            
             layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
             });
            
        };
    });
                
};

//change size of circle values on map (and update legend)
function updatePropIncomeSymbols(propIncSymbols, map, attribute){   

  var scaleAdj = 1;  // had orginally used this to play with adjusting symbols with changes to zoom level

    propIncSymbols.eachLayer(function(layer){
        if(layer.feature && layer.feature.properties[attribute]){
            var props = layer.feature.properties;
            var radius = calcPropIncRadius(props[attribute]);
            layer.setRadius(radius*scaleAdj);
            
            updatePropIncomeLegend(map, attribute);
            
            //set popup text for mouse events
            var dollarChar = "$";
            popupContent = "<p><b>Metro Area:</b> " + props.GeoName + " </p><p><b>" + "Average Proprietor Income" + ": </b>" + dollarChar + props[attribute] + "</p>";
          
             layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
             });
            
        };
    });
                
};

$(document).ready(createMap);
