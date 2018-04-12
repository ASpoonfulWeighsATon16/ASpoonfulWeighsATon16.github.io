(function() {


    var attributeArray = ["GDP_peremp",	"PCPI",	"Popchg", "PerRU1_2", "GINI", "College_Deg", "Permfg", "perprof", "Born_Diff", "For_born", "transpay"];
    
    //attribute full names for map/chart labels and dropdown menus
    var labelArray = ["Productivity (GDP per Worker)", "Per Capita Personal Income", "Population Change 2006 to 2016", "Percent of Population in a Metro Area", "GINI Coefficient", "Share of Population Age 16 to 64 with a College Degree", "Share of Total Employment in Manufacturing", "Share of Total Employment in Professional, Technical and Scientific Services", "Share of Population Born in Different State", "Share of Population that is Foreign Born", "Share of Income from Transfer Payments"];
    
    var variableIndex = 0;
    
    var expressed = attributeArray[0]; 
    
    var chartWidth = window.innerWidth * 0.425,
        chartHeight = 473,
        leftPadding = 50,
        rightPadding = 2,
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    
     var yScale = d3.scaleLinear()
        .range([463, 0])// range is the height of the chart - 10 or the padding
        .domain([0, 150000]);  // will need to change this based on values  min/max values from d3?
    
    //attribute full names for map/chart labels and dropdown menus

   var currencyFormatter = new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD',
       minimumFractionDigits: 0,
    });
    
    var percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
    });
    
 //   var thousandsFormatter = new Intl.NumberFormat('en-US'), {
 //       style: ''
 //   })



    window.onload = setMap();

    
//////////////////////////////////////////////////////////////////////////////////////////////   
    function setMap() {

        var width = window.innerWidth * 0.5,
            height = 460;

        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        var projection = d3.geoAlbersUsa()
            .translate([width/2, height/2])
            .scale([850]);

        var path = d3.geoPath()
            .projection(projection);


        d3.queue()
            .defer(d3.csv, "data/dynamism.csv")
            .defer(d3.json, "data/us_state.topojson")
            .await(callback);

        function callback(error, dynamismCSV, states){

            var us_states = topojson.feature(states, states.objects.us_state).features;  //remember to check your .topojson file to be sure you are using the correct objects

                   // var stateBorders = map.append("path")
                   //    .datum(us_states)
                   //    .attr("class", "stateBorders")
                   //     .attr("d", path);
            
            us_states = joinData(us_states, dynamismCSV);

            var colorScale = quantileColorScale(dynamismCSV);
            
            setEnumerationUnits(us_states, map, path, colorScale);
            
            setLegend();
            setChart(dynamismCSV, colorScale);
            
            createDropdown(dynamismCSV);
            
            console.log(error);
            console.log(dynamismCSV);
            console.log(states);
            
        };// callback function

    }; // setMap function
    
///////////////////////////////////////////////////////////////////////////////////////////////////    

    function setLegend(){
         var legend = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", ";legend");
        
        var chartBackground = legend.append("rect")
            .attr("class", "legendBackground")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
        
        //var bars = chart.selectAll(".bars")
       //     .data(dynamismCSV)
      //      .enter()
      //      .append("rect")
     //       .sort(function (a, b){
     //           return b[expressed] - a[expressed]
     //       })
     //       .attr("class", function(d){
      //          return "bars " + d.ST_ABBR;
       //     })
         
        
        var chartTitle = chart.append("text")
            .attr("x", 65)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Legend title");  
    }
    
    function createDropdown(dynamismCSV){
        var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                variableIndex = this.selectedIndex - 1;
                changeAttribute(this.value, dynamismCSV);
            });
        
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Select Attribute");
        
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(attributeArray)
            .enter()
            .append("option")
            .attr("value", function(d){ return d })
            .text(function(d){
                if (d == attributeArray[0]) {
                    d = labelArray[0];
                } else if (d == attributeArray[1]) {
                    d = labelArray[1];
                } else if (d == attributeArray[2]) {
                    d = labelArray[2];
                } else if (d == attributeArray[3]) {
                    d = labelArray[3];
                } else if (d == attributeArray[4]) {
                    d = labelArray[4];
                } else if (d == attributeArray[5]) {
                    d = labelArray[5];
                } else if (d == attributeArray[6]) {
                    d = labelArray[6];
                } else if (d == attributeArray[7]) {
                    d = labelArray[7];
                } else if (d == attributeArray[8]) {
                    d = labelArray[8];
                } else if (d == attributeArray[9]) {
                    d = labelArray[9];
                } else if (d == attributeArray[10]) {
                    d = labelArray[10];
                };
                return d;
            });
    };

////////////////////////////////////////////////////////////////////////////////////////////////
    
    function highlight(props){
        var selected = d3.selectAll("." + props.ST_ABBR)
            .style("fill-opacity", "0.1");
          //  .style("stroke-width", "1");
         
        
        setLabel(props);
    };
    
    function dehighlight(props){
        var selected = d3.selectAll("." + props.ST_ABBR)
            .style("fill-opacity", function(){
                return getStyle(this, "fill-opacity")
            });
           // .style("stroke-width", function(){
         //       return getStyle(this, "stroke-width")
      //      });
      
         
        function getStyle(element, styleName) {
            var styleText = d3.select(element)
                .select("desc")
                .text();
            
            var styleObject = JSON.parse(styleText);
            
            return styleObject[styleName];
        };
        
        d3.select(".infolabel")
            .remove();
    };

////////////////////////////////////////////////////////////////////////////////////////////////
    
    function setLabel(props){
        
       var tempLabelName;
       var tempValue = props[expressed];
        
           if (expressed == attributeArray[0]) {
               tempLabelName = labelArray[0];
               tempValue = currencyFormatter.format(props[expressed]);
           } else if (expressed == attributeArray[1]){
                tempLabelName = labelArray[1];
                tempValue = currencyFormatter.format(props[expressed]);
           } else if (expressed == attributeArray[2]){
                tempLabelName = labelArray[2];
                tempValue = percentFormatter.format((props[expressed])/100);
           } else if (expressed == attributeArray[3]){
                tempLabelName = labelArray[3];
                tempValue = percentFormatter.format((props[expressed])/100);
           } else if (expressed == attributeArray[4]){
                tempLabelName = labelArray[4];
           } else if (expressed == attributeArray[5]){
                tempLabelName = labelArray[5];
                tempValue = percentFormatter.format((props[expressed])/100);
           } else if (expressed == attributeArray[6]){
                tempLabelName = labelArray[6];
                tempValue = percentFormatter.format((props[expressed])/100);
           } else if (expressed == attributeArray[7]){
                tempLabelName = labelArray[7];
                tempValue = percentFormatter.format((props[expressed])/100);
           } else if (expressed == attributeArray[8]){
                tempLabelName = labelArray[8];
                tempValue = percentFormatter.format((props[expressed])/100);
           } else if (expressed == attributeArray[9]){
                tempLabelName = labelArray[9];
                tempValue = percentFormatter.format((props[expressed])/100);
           } else if (expressed == attributeArray[10]){
                tempLabelName = labelArray[10];
                tempValue = percentFormatter.format((props[expressed])/100);
           };
        

        
        var labelAttribute = "<h1>" + tempValue + "</h1>"; // <b>" + tempLabelName + "</b>";
        
        console.log(props[expressed])
        console.log(expressed);
        
        var infoLabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", props.ST_ABBR + "_label")
            .html(labelAttribute);
        
        var stateName = infoLabel.append("div")
            .attr("class", "labelname")
            .html(tempLabelName + " in " + props.STATE_NAME)
        
    };
    
    function moveLabel() {
        
        var labelWidth = d3.select(".infolabel")
            .node()
            .getBoundingClientRect()
            .width;
        
        var x1 = d3.event.clientX + 10,
            y1 = d3.event.clientY - 75,
            x2 = d3.event.clientX - labelWidth - 10,
            y2 = d3.event.clientY + 25;
            
        var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
        var y = d3.event.clientY < 75 ? y2 : y1;   
        
        d3.select(".infolabel")
            .style("left", x + "px")
            .style("top", y + "px");
    };
    
////////////////////////////////////////////////////////////////////////////////////////////////
    
    function changeAttribute(attribute, dynamismCSV) {
        expressed = attribute;
        
         var attributeMax = d3.max(dynamismCSV,function(d){
            return +d[expressed];
        });
        
       var attributeMin = d3.min(dynamismCSV, function(d){
            return +d[expressed];  // double-check this
        });
    
         yScale.range([463, 0])// range is the height of the chart - 10 or the padding
         yScale.domain([0, attributeMax]); 
        
        var colorScale = quantileColorScale(dynamismCSV);
        
        var stateBorders = d3.selectAll(".stateBorders")
        .transition()
        .duration(1000)
        .style("fill", function(d){
                return checkChoropleth(d.properties, colorScale)
            });
        
        var bars = d3.selectAll(".bars")
            .sort(function(a, b) {
                return b[expressed] - a[expressed];
            })
            .transition()
        .delay(function(d, i){
            return i * 20
        })
        .duration(500);
        
        updateChart(bars, dynamismCSV.length, colorScale);
        
    }; // changeAttribute function
        
////////////////////////////////////////////////////////////////////////////////////////////////
    
    function setEnumerationUnits (us_states, map, path, colorScale) {
        
        var stateBorders = map.selectAll(".stateBorders")
           .data(us_states)
           .enter()
           .append("path")
           .attr("class", function(d){
                return "stateBorders " + d.properties.ST_ABBR;
         })
         .attr("d", path)
         .style("fill", function(d){
             return  checkChoropleth(d.properties, colorScale);
         })
         .on("mouseover", function(d) {
             highlight(d.properties);
         })
         .on("mouseout", function(d) {
             dehighlight(d.properties);
         })
         .on("mousemove", moveLabel);
        
        var desc = stateBorders.append("desc")
            .text('{"stroke": "white", "stroke-width": "2px"}');  // make sure these match your .css properties 

    }; // setEnumerationUnits function
    
   //////////////////////////////////////////////////////////////////////////////////////////// 

    
    function setChart(dynamismCSV, colorScale) {
        
        
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");
        
        var chartBackground = chart.append("rect")
            .attr("class", "chartBackground")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
        
        var bars = chart.selectAll(".bars")
            .data(dynamismCSV)
            .enter()
            .append("rect")
            .sort(function (a, b){
                return b[expressed] - a[expressed]
            })
            .attr("class", function(d){
                return "bars " + d.ST_ABBR;
            })
         
            .attr("width", chartInnerWidth / dynamismCSV.length - 1) // set width of bar to chart width divided by number of elements
            .on("mouseover", highlight)
            .on("mouseout", dehighlight)
            .on("mousemove", moveLabel);
        
        var desc = bars.append("desc")
            .text('{"stroke": "none", "stroke-width": "0px"}');
        
        var chartTitle = chart.append("text")
            .attr("x", 65)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Number of Variable " + expressed + " by State");  
        
        var yAxis = d3.axisLeft()
            .scale(yScale);
        
        var axis = chart.append("g")
            .attr("class", "axis")
            .attr("transform", translate)
            .call(yAxis);
        
        var chartFrame = chart.append("rect")
            .attr("class", "chartFrame")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
        
        
        updateChart(bars, dynamismCSV.length, colorScale);
            
    };
    
    
    function updateChart(bars, n, colorScale){
        
        bars.attr("x", function(d, i){
            return i * (chartInnerWidth / n) + leftPadding;
        })
            .attr("height", function(d, i){
                return 463 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d, i){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            .style("fill", function(d){
                return checkChoropleth(d, colorScale)
            });
        var chartTitle = d3.select(".chartTitle")
            .text(labelArray[variableIndex] + " by State");
        
        var yAxis = d3.axisLeft()
            .scale(yScale);
        
        d3.selectAll("g.axis")   
            .call(yAxis); 
      
    };

    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    
    function quantileColorScale(data){
        
        var colorClasses = ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"];
        
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
            var attributePrimaryKey = attributeState.ST_ABBR;
            
            for (var j=0; j<us_states.length; j++) {
                var spatialDataProperties = us_states[j].properties;
                var spatialDataPrimaryKey = spatialDataProperties.ST_ABBR;
                
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


    
    function checkChoropleth(props, colorScale){
         var val = parseFloat(props[expressed]);
         if (typeof val == 'number' && !isNaN(val)){
             return colorScale(val);
         } else {
             return "#CCC";
         }; //if else block
    };// checkChoropleth Function
    
        


})();