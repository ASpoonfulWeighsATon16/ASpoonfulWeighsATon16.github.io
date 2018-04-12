(function() {


    var attributeArray = ["P_2006", "P_2016", "Pchange"];
    var expressed = attributeArray[0];


    window.onload = setMap();

    function setMap() {

        var width = window.innerWidth * 0.5,
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

                   // var stateBorders = map.append("path")
                   //    .datum(us_states)
                   //    .attr("class", "stateBorders")
                   //     .attr("d", path);
            
            us_states = joinData(us_states, dynamismCSV);

            var colorScale = quantileColorScale(dynamismCSV);
            
            
            setEnumerationUnits(us_states, map, path, colorScale);
            
            setChart(dynamismCSV, colorScale);
            
            console.log(error);
            console.log(dynamismCSV);
            console.log(states);
            
        };// callback function


    }; // setMap function

        
    function setChart(dynamismCSV, colorScale) {
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 460;
        
      // Start looking around here
        
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");
        
        var yScale = d3.scaleLinear()
            .range([0, chartHeight])
            .domain([0, 37000000]);  // set this to 
        
        var bars = chart.selectAll(".bars")
            .data(dynamismCSV)
            .enter()
            .append("rect")
            .sort(function (a, b){
                return b[expressed] - a[expressed]
            })
            .attr("class", function(d){
                return "bars " + d.STATE_NAME;
            })
            .attr("width", chartWidth / dynamismCSV.length - 1) // set width of bar to chart width divided by number of elements
            .attr("x", function(d, i){
                return i * (chartWidth / dynamismCSV.length);  // set x position of bar using chart width and number of elements in chart
            })
            .attr("height", function(d){
                return yScale(parseFloat(d[expressed]));
            
            })
           .attr("y", function(d){
              return chartHeight - yScale(parseFloat(d[expressed]));  
           })
          .style("fill", function(d){
                return checkChoropleth(d, colorScale);
          });
    };
    
    
    function quantileColorScale (data){
        
        var colorClasses = ["#D4B9DA", "#C994C7", "#DF65B0", "#DD1C77", "#980043"];
        
        var colorScale = d3.scaleQuantile()
        .range(colorClasses);
        
        var domainArray = [];
        for (var i=0; i<data.length; i++) {
            var val = parseFloat(data[i][expressed]); //first value in attribute array declared earlier
            domainArray.push(val);
        };  //for loop
        
        colorScale.domain(domainArray);
        
        return colorScale
        
    }; // quantileColorScale function
    
    
    function joinData(us_states, dynamismCSV){    
        
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
                    });
                }; // if statement block
            }; // inner for loop
        }; // outer for loop
        
        return us_states;
        
    };//joinData function

        
    
    function setEnumerationUnits (us_states, map, path, colorScale) {
        
        var stateBorders = map.selectAll(".stateBorders")
           .data(us_states)
           .enter()
           .append("path")
           .attr("class", function(d){
                return "stateBorders " + d.properties.STATE_NAME;
         })
         .attr("d", path)
         .style("fill", function(d){
             return  checkChoropleth(d.properties, colorScale);//colorScale(d.properties[expressed]);
         });

    
    }; // setEnumerationUnits function
    
    function checkChoropleth(props, colorScale){
         var val = parseFloat(props[expressed]);
         if (typeof val == 'number' && !isNaN(val)){
             return colorScale(val);
         } else {
             return "#CCC";
         }; //if else block
    };// checkChoropleth Function
    
        


})();