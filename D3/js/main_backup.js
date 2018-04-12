window.onload = setMap();

function setMap() {
   
    var width = 960,
        height = 460;
    
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);
    
    var projection = d3.geoAlbersUsa()
        .translate([width/2, height/2]);
    
    var path = d3.geoPath()
        .projection(projection);
    
    
    d3.queue()
        .defer(d3.csv, "data/dynamism.csv")
        .defer(d3.json, "data/us_states.topojson")
        .await(callback);
    
    function callback(error, dynamismCSV, states){
        var us_states = topojson.feature(states, states.objects.us_state_EPSG4326).features;  //remember to check your .topojson file to be sure you are using the correct objects
        
        
        var attributeArray = ["P_2006", "P_2016", "Pchange"];
        
        for (var i=0; i< dynamismCSV.length; i++) {
            var attributeState = dynamismCSV[i];
            var attributePrimaryKey = attributeState.STATE_NAME;
            
            for (var j=0; j<us_states.length; j++) {
                var spatialDataProperties = us_states[j].properties;
                var spatialDataPrimaryKey = spatialDataProperties.STATE_NAME;
                
                if (spatialDataPrimaryKey == attributePrimaryKey){
                    attributeArray.forEach(function(attr){
                        var val = parseFloat(attributeState[attr]);
                        spatialDataProperties[attr] = val;
                    }); //function
                }; // if statement block
            }; // inner for loop
        }; // outer for loop
        
       // var stateBorders = map.append("path")
        //    .datum(us_states)
        //    .attr("class", "stateBorders")
       //     .attr("d", path);
        
        var stateBorders = map.selectAll(".stateBorders")
           .data(us_states)
           .enter()
            .append("path")
            .attr("class", function(d){
                return "stateBorders " + d.properties.STATE_NAME;
         })
         .attr("d", path);
   //     
        
      //  console.log(error);
      //  console.log(csvData);
      //  console.log(states);
    };
};

