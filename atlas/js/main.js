var map;
var currentCenter = new google.maps.LatLng(40.199, -98.663);
var currentZoom = 4;
var swLatLng = new google.maps.LatLng(24.7, -124);
var neLatLng = new google.maps.LatLng(49.78, -67.9);
var startUpBounds = new google.maps.LatLngBounds(swLatLng, neLatLng);
var currentBounds = new google.maps.LatLngBounds();

var infowindow = new google.maps.InfoWindow();
var currentYear = 06;
var currentMapType = "P";
var currentNAICS = "311";
var currentOpacity = 0.8;
var tempCount = 1;
var legendValuesArray = [0.1, 0.05, 0.01, 0.0000];

var modal = document.getElementById('percentModal')

var currentTitle = '311 Food Manufacturing';
var currentSubtitle = 'Percent of Total Employment';
var yearTitle = '2006';
var mapTitle = document.createElement('div');
var legend = document.createElement('div');
mapTitle.id = "mapTitle";

var extraChar ="%";
var countyLayer = new google.maps.Data();
var currentJSON = 'data/cbp_naics3_31_per.json';
countyLayer.loadGeoJson(currentJSON);  //

chartWidth = document.getElementById('chartCard').offsetWidth;
chartHeight = document.getElementById('chartCard').offsetHeight;
var chartData = [];

console.log(chartWidth);

var stateLayer = new google.maps.Data();
stateLayer.loadGeoJson('data/us_state_wgs.json');

layerOpacity = 1.0;

function openModal() {
    var tempModal = modal;
    tempModal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      tempModal.style.display = "none";
   }

    window.onclick = function(event) {
       if (event.target == modal) {
         tempModal.style.display = "none";
       }
    }
}

function initialization() {
    mapInitialization();

  //   $("#myModal").modal('show');
    
}

function mapInitialization() {
    
    //var initBounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'), {
      center: currentCenter,
      zoom: currentZoom,
      
    //map.setCenter(currentCenter);
    //map.setZoom(currentZoom);
      styles:[
            {"elementType": "geometry",
                "stylers": [
                  {"color": "#f5f5f5"
                  }
                ]
            },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
      ]
    
    });
    
    stateLayer.setStyle(function(feature) {
        return {
            clickable: false,
            strokeColor: '#737373',
            fillColor: '',
            strokeWeight: 1.5,
            fillOpacity: 0.0,
            zIndex: 1
      };
    });

   stateLayer.setMap(map);
   setMap();
}

$("#yearSlider").on("change", yearChange);
$("#industryType").on("change", industryChange);
$("#opacitySlider").on("change", opacityChange);
$("#industry_measure").on("change", measureChange);
$("#openModal").on('click', openModal);

function yearChange(){
   tempYearSlider = document.getElementById("yearSlider");
   tempValue = tempYearSlider.value
   console.log(tempValue)
   currentYear = parseInt(tempValue);
   currentYear = currentYear + 5;
   if (currentYear < 10) {
        currentYearString = "0" + currentYear.toString();
    }
    else if (currentYear >=10 ) {
       currentYearString = currentYear.toString();
    }
   var yearLabel = document.getElementById("yearLabel");
   yearTitle = "20" + currentYearString;
   yearLabel.innerHTML = "Year: 20" + currentYearString;
   console.log(currentYear);
   setMap();
}

function industryChange(){
   tempIndustryDropdown = document.getElementById("industryType");
   tempNAICS = tempIndustryDropdown.value;
   currentTitle = tempNAICS;
    
   currentNAICS = tempNAICS.substring(0,3);
   currentNAICS3 = tempNAICS.substring(0,3);
   currentNAICS2 = tempNAICS.substring(0,2);
   currentNAICSString = currentNAICS2.toString();
    
   tempSuffix = '';
   
   if (currentMapType == "P") {
       tempSuffix ='per'
   }
   else if (currentMapType == "T") {
       tempSuffix ='ttl'
   }
   else if (currentMapType == "D") {
       tempSuffix ='dis'
   }
   else if (currentMapType == "A") {
       tempSuffix ='auto'
   }
   else if (currentMapType == "L") {
       tempSuffix ='lq'
   }
   
   tempJsonString = 'data/cbp_naics3_' + currentNAICSString + '_' + tempSuffix + '.json';
   currentJSON = tempJsonString;
   countyLayer.loadGeoJson(currentJSON);
    
   console.log(tempJsonString);
   setMap();
   naicsLinkChange();
}

function naicsLinkChange() {
  tempLink = document.getElementById("naicsLink");
  newLink = "https://www.census.gov/cgi-bin/sssd/naics/naicsrch?input=" + currentNAICS + "&search=2017+NAICS+Search&search=2017"
  console.log(newLink);
  $("#naicsButton").attr("href", newLink);
}

function measureChange(){
   tempMeasureDropdown = document.getElementById("industry_measure");
   tempMeasure = tempMeasureDropdown.value;
   yearLabel = yearTitle + " - " + yearLabel;
   if (tempMeasure == 'Percent of County Employment') {
       currentMapType = "P";
       currentSubtitle = 'Percent of Total County Employment';
       extraChar = "%";
   }
   else if (tempMeasure == "Total Employment") {
       currentMapType = "T";
       currentSubtitle = 'Total Industry Employment by County';
       extraChar = "";
       modal = document.getElementById('totalModal');
   }
   else if (tempMeasure == "Percent of Employment in 100 Mile Radius") {
       currentMapType = "D";
       extraChar = "%";
       currentSubtitle = 'Percent of U.S. Industry Employment in a 100 Mile Radius';
   }
   else if (tempMeasure == "Spatial Clustering") {
       currentMapType = "A";
       extraChar = ""
       currentSubtitle = "Spatial Autocorrelation: Local Moran's I";
       modal = document.getElementById('autoModal');
   }
   else if (tempMeasure == "Location Quotient") {
       currentMapType = "L";
       extraChar = ""
       currentSubtitle = "Industry Location Quotient by County";
       modal = document.getElementById('lqModal');
   }
   
   industryChange();
   setMap();
}

function opacityChange(){
   tempOpacitySlider = document.getElementById("opacitySlider");
   currentOpacity = parseFloat(1-(tempOpacitySlider.value/10));
   console.log(currentOpacity);
   setMap();
}

function changeTitle(){
    $("#mapTitle").remove();
    var mapTitle = document.createElement('div');
    mapTitle.id = "mapTitle";
    var divTitle = document.createElement('div');
    divTitle.id = "divTitle";
    divTitle.innerHTML = currentTitle ;
    var divSubTitle = document.createElement('div');
    divSubTitle.id = "divSubTitle";
    divSubTitle.innerHTML = currentSubtitle + " - " + yearTitle;
    mapTitle.appendChild(divTitle);
    mapTitle.appendChild(divSubTitle);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(mapTitle);
}

function setChart(tempData){
    $(".chartContainer").remove();
     var chartContainer = d3.select("#chartCard")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chartContainer");
    
    var innerChart = chartContainer.append("rect")
        .datum(chartWidth)
        .attr("width", function(d){
            return d - 6;
        })
        .attr("height", chartHeight-6)
        .attr("class", innerChart)
        .attr("x", 5)
        .attr("y", 5)
        .style("fill", "#FFFFFF");
        
        
    var minPop = d3.min(tempData, function(d){
        return d.population;
    });
    
    var maxPop = d3.max(tempData, function(d){
        return d.population;
    });
    
    var maxValue = d3.max(tempData, function(d){
        return d.value;
    });
    
    console.log(maxPop);
    console.log(maxValue);
    
    var y = d3.scaleLinear()
        .range([chartHeight - 10, 0])
        .domain([0, 900000]);
     
    var x = d3.scaleLinear()
        .range([60, chartWidth - 20])
        .domain([0, 0.4]);
    
     var yAxis = d3.axisLeft()
        .scale(y);
    
    var xAxis = d3.axisBottom()
        .scale(x);
    
    var axisY = chartContainer.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50,0)")
        .call(yAxis);
    
    var axisX = chartContainer.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (chartHeight - 50)  + ")")
        .call(xAxis);
    
    var circles = chartContainer.selectAll(".circles")
        .data(tempData)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("r", function(d){
            //console.log("d:", d, "i:", i)
            var area = 3
            return area;
        })
        .attr("cx", function(d,i){
            return x(d.value);
        })
        .attr("cy", function (d){
            return y(d.population); 
        });
    
}

function setMap() {
 //console.log("Rucc1 Count 1 ", rucc1Count1);
    
    if (currentYear < 10) {
        tempMapColumn = currentMapType + currentNAICS + "_0" + currentYear.toString();
        console.log(tempMapColumn)
    }
    else if (currentYear >=10 ) {
        tempMapColumn = currentMapType + currentNAICS + "_" + currentYear.toString();
        console.log(tempMapColumn)
    }
    
    var attributeLabel;
    
    var chartValues = [];

    // stores values for depicting tract fill colors; color values from ColorBrewer (Thanks Cynthia, Mark, Ben, Andy and David!)
    
    var colorArrayPercent = ['#006d2c', '#31a354', '#74c476', '#bae4b3','#edf8e9',  '#fff'];
    var colorArrayTotal = ['#b2182b', '#e34a33', '#fc8d59', '#fdbb84', '#fdd49e', '#fef0d9', '#fff'];
    var colorArrayLQ = ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac','#fff' ];
    var colorArray100Mile = ['#0c2c84', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4','#ffffcc','#fff' ];
    var colorArrayCluster = ['#e66101', '#fdb863', '#92c5de', '#0571b0', '#fff'];
   
    var valuePercentArray = [0.1, 0.05, 0.01, 0.005, 0.001, 0.000];
    var valueArrayTotal = [1000, 500, 250, 100, 50, 1, 0];
    var valueArray100Mile = [0.080, 0.040, 0.020, 0.010, 0.005, 0.001, 0.000]
    var valueArrayLQ = [1.5, 1.25, 1.00, 0.75, 0.50, 0.001, 0.0];
    var valueArrayCluster = ["HH", "HL", "LH", "LL","NN"];
     
      
    // returns a color based on the value given when the function is called
    function getColor (val, population) {
        popTemp = population.replace(",", "");
        popInt = parseInt(popTemp);
        
        //console.log(val);
        if (currentMapType == "P")   {
            legendValuesArray = valuePercentArray;
          //  if ((isNaN(popInt) == false) && (isNaN(val) == false))  {
          //      chartValues.push({ population: popInt, value: val });
            return val >= valuePercentArray[0] ? colorArrayPercent[0] :
                   val >  valuePercentArray[1] ? colorArrayPercent[1] :
                   val >  valuePercentArray[2] ? colorArrayPercent[2] :
                   val >  valuePercentArray[3] ? colorArrayPercent[3] :
                   val >  valuePercentArray[4] ? colorArrayPercent[4] :
                   colorArrayPercent[5];
            
        }
        if (currentMapType == "L")   {
            legendValuesArray = valueArrayLQ;
            return val >= valueArrayLQ[0] ? colorArrayLQ[0] :
                   val >  valueArrayLQ[1] ? colorArrayLQ[1] :
                   val >  valueArrayLQ[2] ? colorArrayLQ[2] :
                   val >  valueArrayLQ[3] ? colorArrayLQ[3] :
                   val >  valueArrayLQ[4] ? colorArrayLQ[4] :
                   val >  valueArrayLQ[5] ? colorArrayLQ[5] :
                   colorArrayLQ[6];
        }
        if (currentMapType == "T")   {
            legendValuesArray = valueArrayTotal;
            return val >= valueArrayTotal[0] ? colorArrayTotal[0] :
                   val >  valueArrayTotal[1] ? colorArrayTotal[1] :
                   val >  valueArrayTotal[2] ? colorArrayTotal[2] :
                   val >  valueArrayTotal[3] ? colorArrayTotal[3] :
                   val >  valueArrayTotal[4] ? colorArrayTotal[4] :
                   val >  valueArrayTotal[5] ? colorArrayTotal[5] :
                  colorArrayTotal[6];
        }
        
        if (currentMapType == "D")   {
            legendValuesArray = valueArray100Mile;
            return val >= valueArray100Mile[0] ? colorArray100Mile[0] :
                   val >  valueArray100Mile[1] ? colorArray100Mile[1] :
                   val >  valueArray100Mile[2] ? colorArray100Mile[2] :
                   val >  valueArray100Mile[3] ? colorArray100Mile[3] :
                   val >  valueArray100Mile[4] ? colorArray100Mile[4] :
                   val >  valueArray100Mile[5] ? colorArray100Mile[5] :
                   val >  valueArray100Mile[6] ? colorArray100Mile[6] :
                  colorArray100Mile[6];
        }
        
        if (currentMapType == "A")   {
            legendValuesArray = valueArrayCluster;
            return val ===  valueArrayCluster[0] ? colorArrayCluster[0] :
                   val ===  valueArrayCluster[1] ? colorArrayCluster[1] :
                   val ===  valueArrayCluster[2] ? colorArrayCluster[2] :
                   val === valueArrayCluster[3] ? colorArrayCluster[3] :
                  colorArrayCluster[4];
        }

     }// getColor() function
   
    countyLayer.setStyle(function(feature) {   
        return {
            fillColor: getColor(feature.getProperty(tempMapColumn), feature.getProperty("Population")), // sets color and class breaks 
            fillOpacity: currentOpacity,
            strokeColor: '#b3b3b3',
            strokeWeight: 0.2,
            zIndex: -1
        };
    });
       
    countyLayer.setMap(map); // add the demographic layer to the map

    // highlight county on mouse over
    countyLayer.addListener('mouseover', function(e) {
        countyLayer.overrideStyle(e.feature, {
            strokeColor: '#ffffff',
            strokeWeight: 1,
            zIndex: 2
        });
    });

    // reset layer on mouseout
    countyLayer.addListener('mouseout', function(e) {
        countyLayer.revertStyle()
    });

    // popup with info
    countyLayer.addListener('click', function(e) {
        console.log(e);
        var tempLabel =  e.feature.getProperty(tempMapColumn);
        tempLabel = tempLabel;
        if (currentMapType == "P" || currentMapType =="D"){
            tempLabel = tempLabel * 100;
            tempLabelString = tempLabel.toFixed(2);
        }
        if (currentMapType == "L"){
            tempLabelString = tempLabel.toFixed(2);
        }
        if (currentMapType == "T"){
            tempLabelString = tempLabel.toString();
        }
        if (currentMapType == "A"){
            if (tempLabel == "HH") {
                tempLabelString = "High-High"
            }
             if (tempLabel == "HL") {
                tempLabelString = "High-Low"
            }
            if (tempLabel == "LH") {
                tempLabelString = "Low-High"
            }
            if (tempLabel == "LL") {
                tempLabelString = "Low-Low"
            }
            if (tempLabel == "NN") {
                tempLabelString = "Not Significant"
            }
            
        }
        
        tempLabelString = tempLabelString + extraChar;
        
        infowindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;">' +
        '<p><b>' + 'County' + ':</b>&nbsp' +  e.feature.getProperty('County_Nam') + ',</b>&nbsp' + e.feature.getProperty('State') + '</p>' + 
        '<p><b>' + currentSubtitle + ':</b>&nbsp' +  yearTitle + '</p>' +
        '<p><b>' + currentTitle + ':</b>&nbsp' +  tempLabelString + '</p></div>');
  
        var anchor = new google.maps.MVCObject();
        anchor.set("position", e.latLng);
        infowindow.open(map, anchor);
    });
   

    //console.log(chartValues);
    changeTitle();
    createLegend(legendValuesArray);
    //d3.queue()
   //     .defer(d3.csv(chartValues))
   //     .await(callback);
   // function callback(error, chartValues){ 
   //    setChart(chartValues);
  //  }

}// setMap function

function createLegend(valueArray){
     $("#legend").remove();
     $("#divName").remove();
     $("#divSource").remove();
    
    var percentIcons = ['data/white.png', 'data/green1.png','data/green2.png','data/green3.png','data/green4.png', 'data/green5.png'];
    var totalIcons = ['data/white.png','data/total1.png','data/total2.png','data/total3.png','data/total4.png','data/total5.png', 'data/total6.png' ];
    var lqIcons = ['data/white.png','data/lq_red3.png','data/lq_red2.png','data/lq_red1.png','data/lq_blue1.png','data/lq_blue2.png', 'data/lq_blue3.png' ];
    var miIcons = ['data/white.png','data/100mi_1.png','data/100mi_2.png','data/100mi_3.png','data/100mi_4.png','data/100mi_5.png', 'data/100mi_6.png', 'data/100mi_7.png' ];
    var autoIcons = ['data/cluster1.png','data/cluster2.png','data/cluster3.png','data/cluster4.png','data/white.png'];
  

    var legendTextArray = [];
    var tempIcons = [];
    var legendTitle;
    
    
    if (currentMapType == "P") {
        var tempText5 = (valueArray[0]) * 100;
        var tempText4 = (valueArray[1]) * 100;
        var tempText3 = (valueArray[2]) * 100;
        var tempText2 = (valueArray[3]) * 100;
        var tempText1 = valueArray[4] * 100;

        var legText1 = "No Employment";
        var legText2 = "0.01% to 0.05%";
        var legText3 = "0.06% to 1.00%";
        var legText4 = "1.01% to 5.00%";
        var legText5 = "5.01% to 10.00%";
        var legText6 = "10.01%  or More";

        legendTextArray = [legText1, legText2, legText3, legText4, legText5, legText6];
        tempIcons = percentIcons;
        legendTitle = "Percent of Total County Employment";
    }
        
    if (currentMapType == "T") {
        var tempText6 = valueArray[0];
        var tempText5 = valueArray[1];
        var tempText4 = valueArray[2];
        var tempText3 = valueArray[3];
        var tempText2 = valueArray[4];
        var tempText1 = valueArray[5];

        var legText1 = "No Employment";
        var legText2 = tempText1 + extraChar + " to " + tempText2 + extraChar;
        var legText3 = tempText2 + extraChar + " to " + tempText3 + extraChar;
        var legText4 = tempText3 + extraChar + " to " + tempText4 + extraChar;
        var legText5 = tempText4 + extraChar + " to " + tempText5 + extraChar;
        var legText6 = tempText5 + extraChar + " to " + tempText6 + extraChar;
        var legText7 = tempText6 + extraChar + " or More";

        legendTextArray = [legText1, legText2, legText3, legText4, legText5, legText6, legText7];
        tempIcons = totalIcons;
        legendTitle = "Total County Employment";
    }
    
    if (currentMapType == "L") {
        var tempText6 = valueArray[0];
        var tempText5 = valueArray[1];
        var tempText4 = valueArray[2];
        var tempText3 = valueArray[3];
        var tempText2 = valueArray[4];
        var tempText1 = valueArray[5];

        var legText1 = "No Employment";
        var legText2 = "1.51 or More";
        var legText3 = "1.26 to 1.50"
        var legText4 = "1.00 to 1.25"
        var legText5 = "0.75 to 0.99"
        var legText6 = "0.50 to 0.74"
        var legText7 = "0.01 to 0.49"

        legendTextArray = [legText1, legText2, legText3, legText4, legText5, legText6, legText7];
        tempIcons = lqIcons;
        legendTitle = "Industry Location Quotient";
    }
    
    if (currentMapType == "D") {
        var tempText7 = valueArray[0]* 100;
        var tempText6 = valueArray[1]* 100;
        var tempText5 = valueArray[2]* 100;
        var tempText4 = valueArray[3]* 100;
        var tempText3 = valueArray[4]* 100;
        var tempText2 = valueArray[5]* 100;
        var tempText1 = valueArray[6]*100;

        var legText1 = "No Employment";
        var legText2 = tempText1  +  ".00" + extraChar + " to " + tempText2  +  "0"+ extraChar;
        var legText3 = tempText2  +  "0" + extraChar + " to " + tempText3  +  "0"+ extraChar;
        var legText4 = tempText3  +  "0" + extraChar + " to " + tempText4  +  ".00"+ extraChar;
        var legText5 = tempText4  +  ".00" + extraChar + " to " + tempText5  +  ".00"+ extraChar;
        var legText6 = tempText5  +  ".00" + extraChar + " to " + tempText6  +  ".00"+ extraChar;
        var legText7 = tempText6  +  ".00" + extraChar + " to " + tempText7  +  ".00"+ extraChar;
        var legText8 = tempText7  +  ".00" + extraChar + " or More";

        legendTextArray = [legText1, legText2, legText3, legText4, legText5, legText6, legText7, legText8];
        tempIcons = miIcons;
        legendTitle = "Percent of U.S. Employment within 100 Miles";
    }
    
    if (currentMapType == "A") {
        var tempText1 = "High-High";
        var tempText2 = "High-Low";
        var tempText3 = "Low-High";
        var tempText4 = "Low-Low";
        var tempText5 = "Not Significant";

        legendTextArray = [tempText1, tempText2, tempText3, tempText4, tempText5];
        tempIcons = autoIcons;
        legendTitle = "Type of Spatial Clustering";
    }
        
    var legend = document.createElement('div');
    legend.innerHTML = '<H4>' + legendTitle + '</H4>';
    var div = document.createElement('div');
    div.innerHTML = "<H4>(" + yearTitle + ")</H4)";
    legend.appendChild(div);
    legend.id = "legend";

    for (i = 0; i < legendTextArray.length; i++){
        var name = legendTextArray[i];
        var icon = tempIcons[i];
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + icon + '" height="25" width="50" class="legendText"> ' + name;
        legend.appendChild(div);
    }
    
    var newCard = document.getElementById('chartCard');
     newCard.appendChild(legend);
    
    var divName = document.createElement('div');
    divName.id = "divName";
    divName.innerHTML = "<H5>Created by Matt Kures, Spring 2019</H5>";
    newCard.appendChild(divName);
    
    var divSource = document.createElement('div');
    divSource.id = "divSource";
    divSource.innerHTML = "<H5>Data Source: U.S. Census Bureau County Business Patterns</H5>";
    
    newCard.appendChild(divSource);
    //map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
}

google.maps.event.addDomListener(window, 'load', initialization);
