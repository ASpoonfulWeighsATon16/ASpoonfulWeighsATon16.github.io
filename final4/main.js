(function() {

    // attributes in CSV file for mapping Left and Right Maps
    var attributeArrayLeft = ["mage00",	"mfg652000", "wrkAge2010", "urate07", "pRate00", "pRateFem00", "bach2000", "perstr02", "autoFrey"];
    var attributeArrayRight = ["medage16", "mfg652000", "wrkAge2030", "urate17", "pRate16", "pRateFem16", "bach2016", "perstr14", "autoBall"];
    
    
    //attribute full names for map/chart labels and dropdown menus
    var dropdownLabels = ["Median Age", "Share of Manufacturing Employees Age 55 and Older", "Share of Population Age 16 to 64", "Unemployment Rate", "Labor Participation Rate - Age 16 and Over","Female Labor Participation Rate", "Share of Population with a Bachelor's Degree or Higher", "Percent of Workers Commuting 50 Miles or More", "Job Automation Probability"];
    
    var labelArrayLeft = ["Median Age","Manufacturing Employees Age 55 and Over" ,"Share of Population Age 16 to 64", "Unemployment Rate", "Labor Participation Rate", "Female Labor Participation Rate", "Bachelor's Degree or Higher", "Workers Commuting 50 Miles or More", "Job Automation Probability"];
    
    var labelArrayRight = ["Median Age","Manufacturing Employees Age 55 and Over" ,"Share of Population Age 16 to 64", "Unemployment Rate", "Labor Participation Rate", "Female Labor Participation Rate", "Bachelor's Degree or Higher", "Workers Commuting 50 Miles or More", "Job Automation Probability"];
    
    var titlesLeft = ["Distribution in 2000","Distribution in 2000", "Distribution in 2010", "Distribution in 2007", "Distribution in 2000", "Distribution in 2000", "Distribution in 2000", "Distribution in 2002", "Distribution - Estimate 1"];
    
    var titlesRight = ["Distribution in 2016","Distribution in 2016", "Distribution in 2030", "Distribution in 2017", "Distribution in 2016", "Distribution in 2016", "Distribution in 2016", "Distribution in 2015", "Distribution - Estimate 2"];
   
    var legendDescription1 = ["How did we get here?","Wisconsin has traditionally been of the nation's ","older states. However, over the past several decades,", "median ages have increased throughout the state.", "In particular, Wisconsin's rural areas have been aging", " rapidly. As residents age, they are less likely to ", "participate in the labor force, reducing labor availability."];

    var legendDescription2 = ["How did we get here?", "An aging labor force has impacted some industries ","more than others. For instance, Wisconsin's ", "manufacturing sector now has 25 percent of its", "employees age 55 and over. The industry may have ", " to replace more than 125,000 workers in the coming ", "decade. Again, rural areas face the largest challenge."];
    
    var legendDescription3 = ["How did we get here?", "Unfortunately, Wisconsin will not become any younger","In the next 15 years. The state's share of working ", "age residents will decline as the share of", "residents age 65 and over continues to grow", "By 2030, every Wisconsin county will see its share of ", "working age residents decline dramatically"];
    
    var legendDescription4 = ["How did we get here?", "Unemployment rates in Wisconsin (and the Upper ","Midwest) have also declined dramatically, even in ", " comparison to the period prior to the start of the Great ", "Recession in 2007. Wisconsin's unemployment rate", "now sits at under 3.0%. In fact, all but several counties ", "now have an unemployment rate under 4.5%"];
    
    var legendDescription5 = ["How did we get here?", "Wisconsin also has the distinction of having one of the ", "nation's highest rates of labor participation, or the share ", "of people age 16 and over who either have a job or ", "are unemployed and actively looking for a job.", "Nonetheless, participation rates have declined as ", "the populaiton has aged.", ];
    
    var legendDescription6 = ["How did we get here?", "Wisconsin's labor participation rates are high "," among most demographic segments. As an example, ", "the participation rate among women is particularly ", "large compared to other places. Participation rates", "among working age women continue to grow across ", "Wisconsin's rural and urban areas alike."];
    
    var legendDescription7 = ["What does the Future Hold?", "Wisconsin likely needs to increase its rates of","educational attainment to become a more ", "productive economy that can benefit from new  ", "technologies that reduce labor demand. While the ", " share of residents with a college degree has grown", "in many counties, other areas have actually declined."];
    
    var legendDescription8 = ["What does the Future Hold?", "The share of workers commuting more than 50 ","miles each way has increased dramatically over the ", "past decade. While the reasons for these changes are", "still being explored, this growth is indicative of a society", "that has become less mobile. As a result Wisconsin", "faces future challenges in attracting new residents."];
    
    var legendDescription9 = ["What does the Future Hold?", "Job automation creates fear among elected officials,","workers and business owners alike. Several studies", "suggest that 30% to 60% (or more) of jobs have a", " notable probability of being automated in the coming", "decades. However, the automation of many tasks may ", "help relieve pressure on future labor force demands."];
    

    // color values from ColorBrewer
    
    var colorClasses = ["#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"];
    var colorClasses1 = ["#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"];
    var colorClasses2 = ["#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"];
    var colorClasses3 = ["#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"];
    
    colorScaleRight = [];

    
    // variables for legend text values
    var classValue1,
        classValue2,
        classValue3,
        classValue4,
        classValue5;
    
    var mapTitleLeft,
        mapTitleRight;
    
    var legendBoxColor1,
        legendBoxColor2,
        legendBoxColor3,
        legendBoxColor4,
        legendBoxColor5;
    
    var linkBoxColor;
    
    // indexes to track which attributes are selected
    var variableIndex = 0;
    var expressedLeft = attributeArrayLeft[0];
    var expressedRight = attributeArrayRight[0] 
    
    // variables for setting chart characteristcs
    var chartWidth = window.innerWidth * 0.9,
        chartHeight = window.innerHeight * 0.25,
        leftPadding = 90,
        rightPadding = 10,
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    
    var mapWidth = window.innerWidth * 0.35,
        mapHeight = window.innerHeight * 0.70
        mapScale =  mapWidth * 11;
    
    // variables for setting legend characteristcs
    var legendWidth = window.innerWidth * 0.25,
        legendHeight = window.innerHeight * 0.7,
        legendRectHeight = 20,
        legendRectWidth = 40,
        legendYOffset = 22,
        legendXOffset = 10,
        legendTextYOffset = 26;
        
    // used to format percentage values
    var percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
    });
    
    window.onload = setMapLeft(), setMapRight();
    
////////////////////////////////////////////////////////////////////////////////////////////// 
// sets the initial values/characteristics of the map    
    function setMapRight() {

        var rightMap = d3.select("#container")
            .append("svg")
            .attr("class", "#rightMap")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        var projection = d3.geoAlbers() 
           .rotate([90, 0])
           .center([0.0, 44.8])
           .scale(mapScale)
           .translate([mapWidth / 2, mapHeight / 2])
           .precision(.1);

        var path = d3.geoPath()
            .projection(projection);

        d3.queue()
            .defer(d3.csv, "data/rightmap.csv")
            .defer(d3.json, "data/wicty2.topojson")
            .await(callback);

        function callback(error, rightmapCSV, rightCounties){

            var countyright = topojson.feature(rightCounties, rightCounties.objects.wicty2).features; 
            countyright = joinDataRight(countyright, rightmapCSV); // join attribute data
            setEnumerationUnitsRight(countyright, rightMap, path, colorScaleRight);
            
            //console.log(error);
            //console.log(rightmapCSV);
            //console.log(countyright);
            
        }; // callback function

    }; // setMapRight function
    
    
    function setMapLeft() {

        var leftmap = d3.select("#container")
            .append("svg")
            .attr("class", "leftMap")
            .attr("width", mapWidth)
            .attr("height", mapHeight);
        
        
        var projection = d3.geoAlbers() 
           .rotate([90, 0])
           .center([0.0, 44.8])
           .scale(mapScale)
           .translate([mapWidth / 2, mapHeight / 2])
           .precision(.1);

         //   .scale(width*0.85); //adjust scale based on size of window

        var path = d3.geoPath()
            .projection(projection);

        d3.queue()
            .defer(d3.csv, "data/leftmap.csv")
            .defer(d3.json, "data/wicty1.topojson")
            .await(callback);

        function callback(error, leftmapCSV, leftCounties){

            var countyLeft = topojson.feature(leftCounties, leftCounties.objects.wicty1).features;  //remember to check .topojson file to be sure you are using the correct objects
            
            countyLeft = joinDataLeft(countyLeft, leftmapCSV); // join attribute data

            var colorScaleLeft = quantileColorScale(leftmapCSV);
            
            colorScaleRight = colorScaleLeft;
            
            setEnumerationUnitsLeft(countyLeft, leftmap, path, colorScaleLeft);
            
            setLegend(); // initialize legend
            setMapTitles();
            createDropdown(leftmapCSV); //initialize dropdown menu
            
            //console.log(error);
            //console.log(leftmapCSV);
           // console.log(countyLeft);
            
        }; // callback function

    }; // setMap function
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////    
    // sets the initial values/characteristics of the legend   
    
    function setMapTitles (){
        var mapTitles = d3.select("#titleContainer")
            .append("svg")
            .attr("width",  window.innerWidth * 0.7)
            .attr("height", 15)
            .attr("class", "mapTitles");    
            
        var leftMapTitle = mapTitles.append("text")
            .attr("class", "leftMapTitle")
            .attr("x", window.innerWidth * 0.11)
            .attr("y", 15)
            .text(titlesLeft[variableIndex]);
        
        var rightMapTitle = mapTitles.append("text")
            .attr("class", "rightMapTitle")
            .attr("x", window.innerWidth * 0.46)
            .attr("y", 15)
            .text(titlesRight[variableIndex]);
    }
    
    function setLegend(){
   
         var legend = d3.select("#container")
            .append("svg")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("class", "legend");
        
        var linkBox = legend.append("rect")
            .attr("class", "linkBox")
            .attr("x", 0)
            .attr("y", 1)
            .attr("width", legendWidth - 10)
            .attr("height", legendHeight - 10)
            .style("fill", "#edf8e9")
            .style("stroke", "grey")
            .attr("rx", 10)
            .attr("ry", 10);
        
        var attributeLegendTitle = legend.append("text")
            .attr("x", legendXOffset)
            .attr("y", 18)
            .attr("class", "attributeLegendTitle")
            .text(labelArrayLeft[variableIndex]);
        
        var legendRectangle1 = legend.append("rect")
            .attr("class", "legendRectangle1")
            .attr("x", legendXOffset)
            .attr("y", 30)  
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .style("fill", colorClasses[0]);
        
        var legendValue1 = legend.append("text")
            .attr("class", "legendValue1")
            .attr("x", (legendXOffset + 60))
            .attr("y", 45) 
            .text(classValue1);
            
        var legendRectangle2 = legend.append("rect")
            .attr("class", "legendRectangle2")
            .attr("x", legendXOffset)
            .attr("y", (parseFloat(legendRectangle1.attr("y")) + legendYOffset))
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .style("fill", colorClasses[1]);
        
        var legendValue2 = legend.append("text")
            .attr("class", "legendValue2")
            .attr("x", (legendXOffset + 60))
            .attr("y", (parseFloat(legendValue1.attr("y")) + legendYOffset)) 
            .text(classValue2);
          
        var legendRectangle3 = legend.append("rect")
            .attr("class", "legendRectangle3")
            .attr("x", legendXOffset)
            .attr("y", (parseFloat(legendRectangle2.attr("y")) + legendYOffset))
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .style("fill", colorClasses[2]);
        
        var legendValue3 = legend.append("text")
            .attr("class", "legendValue3")
            .attr("x", (legendXOffset + 60))
            .attr("y", (parseFloat(legendValue2.attr("y")) + legendYOffset)) 
            .text(classValue3);
        
        var legendRectangle4 = legend.append("rect")
            .attr("class", "legendRectangle4")
            .attr("x", legendXOffset)
            .attr("y", (parseFloat(legendRectangle3.attr("y")) + legendYOffset))
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .style("fill", colorClasses[3]);
        
        var legendValue4 = legend.append("text")
            .attr("class", "legendRectangle5")
            .attr("x", legendXOffset)    
            .attr("class", "legendValue4")
            .attr("x", (legendXOffset + 60))
            .attr("y", (parseFloat(legendValue3.attr("y")) + legendYOffset)) 
            .text(classValue4);
        
        var legendRectangle5 = legend.append("rect")    
            .attr("class", "legendRectangle5")
            .attr("x", legendXOffset)
            .attr("y", (parseFloat(legendRectangle4.attr("y")) + legendYOffset))
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .style("fill", colorClasses[4]);
        
        var legendValue5 = legend.append("text")
            .attr("class", "legendValue5")
            .attr("x", (legendXOffset + 60))
            .attr("y", (parseFloat(legendValue4.attr("y")) + legendYOffset)) 
            .text(classValue5);
       
        var mapSources1 = legend.append("text")
            .attr("class", "mapSources1")                     
            .attr("x", legendXOffset)
            .attr("y", (parseFloat(legendValue5.attr("y")) + legendYOffset))
            .text("Data Sources: U.S. Census Bureau, Bureau of Labor Statistics,");
        
        var mapSources2 = legend.append("text")
            .attr("class", "mapSources2")                     
            .attr("x", legendXOffset)
            .attr("y", (parseFloat(mapSources1.attr("y")) + 16))
            .text("              Ball State University and UW-Extension");
        
        var legendHeader1 = legend.append("text")
            .attr("class", "legendHeader1")
            .attr("x", legendXOffset)
            .attr("y", 225)
            .text(legendDescription1[0]);
        
        var legendHeader2 = legend.append("text")
            .attr("class", "legendHeader2")
            .attr("x", legendXOffset)
            .attr("y", 250)
            .text(legendDescription1[1]);
        
        var legendHeader3 = legend.append("text")
            .attr("class", "legendHeader3")
            .attr("x", legendXOffset)
            .attr("y", 275)
            .text(legendDescription1[2]);
        
        var legendHeader4 = legend.append("text")
            .attr("class", "legendHeader4")
            .attr("x", legendXOffset)
            .attr("y", 300)
            .text(legendDescription1[3]);
        
         var legendHeader5 = legend.append("text")
            .attr("class", "legendHeader5")
            .attr("x", legendXOffset)
            .attr("y", 325)
            .text(legendDescription1[4]);
        
        var legendHeader6 = legend.append("text")
            .attr("class", "legendHeader6")
            .attr("x", legendXOffset)
            .attr("y", 350)
            .text(legendDescription1[5]);
        
        var legendHeader7 = legend.append("text")
            .attr("class", "legendHeader7")
            .attr("x", legendXOffset)
            .attr("y", 375)
            .text(legendDescription1[6]);
    };

////////////////////////////////////////////////////////////////////////////////////////////////////
// sets the values/characteristics of the attribute dropdown menu   
    
    function createDropdown(leftmapCSV){
        var dropdown = d3.select("#dropdownContain")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                variableIndex = this.selectedIndex - 1;
                changeAttributeLeft(attributeArrayLeft[variableIndex], leftmapCSV)
                changeAttributeRight(attributeArrayRight[variableIndex]);
            });
        
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Explore Wisconsin's Labor Market Characterics");
        
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(attributeArrayLeft)
            .enter()
            .append("option")
            .attr("value", function(d){ return d })
            .text(function(d){
                if (d == attributeArrayLeft[0]) {  // get label values from array based on index of attribute array
                    d = dropdownLabels[0];
                } else if (d == attributeArrayLeft[1]) {
                    d = dropdownLabels[1];
                } else if (d == attributeArrayLeft[2]) {
                    d = dropdownLabels[2];
                } else if (d == attributeArrayLeft[3]) {
                    d = dropdownLabels[3];
                } else if (d == attributeArrayLeft[4]) {
                    d = dropdownLabels[4];
                } else if (d == attributeArrayLeft[5]) {
                    d = dropdownLabels[5];
                } else if (d == attributeArrayLeft[6]) {
                    d = dropdownLabels[6];
                } else if (d == attributeArrayLeft[7]) {
                    d = dropdownLabels[7];
                } else if (d == attributeArrayLeft[8]) {
                    d = dropdownLabels[8];
                } else if (d == attributeArrayLeft[9]) {
                    d = dropdownLabels[9];
                };
                return d;
            });
    };


    
 ////////////////////////////////////////////////////////////////////////////////////////////////
// following  two functions control highlighting of map and chart features
    
    function highlightLeft(props){
        var selected = d3.selectAll("." + props.FIPSF)
            .style("fill-opacity", "0.1");
          //  .style("stroke-width", "1");
        
        setLabelLeft(props);
    };
    
    function dehighlightLeft(props){
        var selected = d3.selectAll("." + props.FIPSF)
            .style("fill-opacity", function(){
                return getStyle(this, "fill-opacity")
            });
     
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
// following  two functions control highlighting of map and chart features
    
    function highlightRight(props){
        var selected = d3.selectAll("." + props.FIPSF)
            .style("fill-opacity", "0.1");
          //  .style("stroke-width", "1");
        
        setLabelRight(props);
    };
    
    function dehighlightRight(props){
        var selected = d3.selectAll("." + props.FIPSF)
            .style("fill-opacity", function(){
                return getStyle(this, "fill-opacity")
            });
     
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
// sets the values/characteristics of labels
// uses label array values to change the text and formatting functions to format attribute values
    
    function setLabelLeft(props){
        
       var tempLabelName;
       var tempValue = props[expressedLeft].toFixed(1);
       
        if (variableIndex > 0) {
            tempValue = percentFormatter.format((props[expressedLeft])/100);
         };
       if (expressedLeft == attributeArrayLeft[0]) {
           tempLabelName = labelArrayLeft[0];
       } else if (expressedLeft == attributeArrayLeft[1]){
            tempLabelName = labelArrayLeft[1];
       } else if (expressedLeft == attributeArrayLeft[2]){
            tempLabelName = labelArrayLeft[2];
       } else if (expressedLeft == attributeArrayLeft[3]){
            tempLabelName = labelArrayLeft[3];
       } else if (expressedLeft == attributeArrayLeft[4]){
            tempLabelName = labelArrayLeft[4];
       } else if (expressedLeft == attributeArrayLeft[5]){
            tempLabelName = labelArrayLeft[5];
       } else if (expressedLeft == attributeArrayLeft[6]){
            tempLabelName = labelArrayLeft[6];
       } else if (expressedLeft == attributeArrayLeft[7]){
            tempLabelName = labelArrayLeft[7];
       } else if (expressedLeft == attributeArrayLeft[8]){
            tempLabelName = labelArrayLeft[8];
       } else if (expressedLeft == attributeArrayLeft[9]){
            tempLabelName = labelArrayLeft[9];
       };

        var labelAttribute = "<h1>" + tempValue + "</h1>";
        
        var infoLabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", props.FIPSF + "_label")
            .html(labelAttribute);
        
        var countyName = infoLabel.append("div")
            .attr("class", "labelname")
            .html(tempLabelName + " in " + props.NAME + " County")
       // console.log(props.COUNTY)
    };

    function setLabelRight(props){
        
       var tempLabelName;
       var tempValue = props[expressedRight].toFixed(1);
        
        if (variableIndex > 0) {
            tempValue = percentFormatter.format((props[expressedRight])/100);
         };
        
           if (expressedRight == attributeArrayRight[0]) {
               tempLabelName = labelArrayRight[0];
           } else if (expressedRight == attributeArrayRight[1]){
                tempLabelName = labelArrayRight[1];
           } else if (expressedRight == attributeArrayRight[2]){
                tempLabelName = labelArrayRight[2];
           } else if (expressedRight == attributeArrayRight[3]){
                tempLabelName = labelArrayRight[3];
           } else if (expressedRight == attributeArrayRight[4]){
                tempLabelName = labelArrayRight[4];
           } else if (expressedRight == attributeArrayRight[5]){
                tempLabelName = labelArrayRight[5];
           } else if (expressedRight == attributeArrayRight[6]){
                tempLabelName = labelArrayRight[6];
           } else if (expressedRight == attributeArrayRight[7]){
                tempLabelName = labelArrayRight[7];
           } else if (expressedRight == attributeArrayRight[8]){
                tempLabelName = labelArrayRight[8];
           } else if (expressedRight == attributeArrayRight[9]){
                tempLabelName = labelArrayRight[9];
           };
        
        var labelAttribute = "<h1>" + tempValue + "</h1>"; // <b>" + tempLabelName + "</b>";
                
        var infoLabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", props.FIPSF + "_label")
            .html(labelAttribute);
        
        var countyName = infoLabel.append("div")
            .attr("class", "labelname")
            .html(tempLabelName + " in " + props.NAME + " County")
       // console.log(props.COUNTY)
    };
    
    
    
////////////////////////////////////////////////////////////////////////////////////////////////
// changes label positions to be responsive to position on the page.
    
    function moveLabelLeft() {
        
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
    
    
    function moveLabelRight() {
        
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
// change the map/chart attibute based on change to dropdown menu selection
    
    function changeAttributeLeft(attribute, leftmapCSV) {
        expressedLeft = attribute;
        
        var attributeMax = d3.max(leftmapCSV,function(d){
            return +d[expressedLeft];
        });
        
       var attributeMin = d3.min(leftmapCSV, function(d){
            return +d[expressedLeft];  // double-check this
        });
    
        colorScaleLeft = quantileColorScale(leftmapCSV);
        colorScaleRight = colorScaleLeft;
        
        var countyBordersLeft = d3.selectAll(".countyBordersLeft")
            .transition()
            .duration(1000)
            .style("fill", function(d){
                return checkChoroplethLeft(d.properties, colorScaleLeft)
            });
                
    }; // changeAttribute function
    
    
    function changeAttributeRight(attribute) {
        expressedRight = attribute;
    
     //   yScale.range([chartHeight - 10, 0])// range is the height of the chart - 10 or the padding
      //  yScale.domain([0, attributeMax + (attributeMax * 0.1)]); 
        
       //colorScaleRight = colorScaleLeft;
        
        var countyBordersLeft = d3.selectAll(".countyBordersRight")
            .transition()
            .duration(1000)
            .style("fill", function(d){
                return checkChoroplethRight(d.properties, colorScaleRight)
            });
                
    }; // changeAttribute function
        
////////////////////////////////////////////////////////////////////////////////////////////////
//set the map characteristics
    
    function setEnumerationUnitsLeft (countyLeft, map, path, colorScaleLeft) {
        
        var countyBordersLeft = map.selectAll(".countyBordersLeft")
           .data(countyLeft)
           .enter()
           .append("path")
           .attr("class", function(d){
                return "countyBordersLeft " + d.properties.FIPSF;
           })
           .attr("d", path)
           .style("fill", function(d){
             return  checkChoroplethLeft(d.properties, colorScaleLeft);
           })
           .on("mouseover", function(d) {
             highlightLeft(d.properties);
           })
           .on("mouseout", function(d) {
             dehighlightLeft(d.properties);
           })
           .on("mousemove", moveLabelLeft);
        
        var desc = countyBordersLeft.append("desc")
            .text('{"stroke": "white", "stroke-width": "2px"}');  // make sure these match your .css properties 

    }; // setEnumerationUnits function

    
    //set the map characteristics
    
    function setEnumerationUnitsRight (countyRight, map, path, colorScaleRight) {
        
        var countyBordersRight = map.selectAll(".countyBordersRight")
           .data(countyRight)
           .enter()
           .append("path")
           .attr("class", function(d){
                return "countyBordersRight " + d.properties.FIPSF;
           })
           .attr("d", path)
           .style("fill", function(d){
             return  checkChoroplethRight(d.properties, colorScaleRight);
           })
           .on("mouseover", function(d) {
             highlightRight(d.properties);
           })
           .on("mouseout", function(d) {
             dehighlightRight(d.properties);
           })
           .on("mousemove", moveLabelRight);
        
        var desc = countyBordersRight.append("desc")
            .text('{"stroke": "white", "stroke-width": "2px"}');  // make sure these match your .css properties 

    }; // setEnumerationUnits function

//////////////////////////////////////////////////////////////////////////////////////////// 
// the following two functions set and update the values of the chart
    
    function setChart(leftmapCSV, colorScale) {
        
        var chart = d3.select("#leftMap")
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
            .data(leftmapCSV)
            .enter()
            .append("rect")
            .sort(function (a, b){
                return b[expressed] - a[expressed]
            })
            .attr("class", function(d){
                return "bars " + d.FIPSF;
            })
         
            .attr("width", chartInnerWidth / leftmapCSV.length - 1) // set width of bar to chart width divided by number of elements
            .on("mouseover", highlightLeft)
            .on("mouseout", dehighlightLeft)
            .on("mousemove", moveLabelLeft);
        
        var desc = bars.append("desc")
            .text('{"stroke": "none", "stroke-width": "0px"}');
        
        var chartTitle = chart.append("text")
            .attr("x", 160)
            .attr("y", 15)
            .attr("class", "chartTitle")
            .text("Number of Variable " + expressed + " by County");  
        
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
        
     //   updateChart(bars, leftmapCSV.length, colorScale);
            
    };// setChart function
    
////////////////////////////////////////////////////////////////////////////////////////////
// updates the legend text and legend class values when attributes are changed.    

    function updateLegendValues(){
        
        //console.log (variableIndex);

        if (variableIndex == 0) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription1[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription1[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription1[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription1[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription1[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription1[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription1[6]);
        } else if (variableIndex == 1) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription2[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription2[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription2[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription2[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription2[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription2[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription2[6]);
        } else if (variableIndex == 2) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription3[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription3[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription3[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription3[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription3[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription3[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription3[6]);
        } else if (variableIndex == 3) {
            var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription4[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription4[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription4[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription4[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription4[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription4[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription4[6]);
        } else if (variableIndex == 4) {
              var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription5[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription5[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription5[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription5[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription5[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription5[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription5[6]);
        } else if (variableIndex == 5) {
               var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription6[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription6[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription6[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription6[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription6[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription6[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription6[6]);
        } else if (variableIndex == 6) {
              var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription7[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription7[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription7[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription7[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription7[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription7[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription7[6]);
        } else if (variableIndex == 7) {
               var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription8[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription8[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription8[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription8[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription8[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription8[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription8[6]);
        } else if (variableIndex == 8) {
          var legendHeader1 = d3.select(".legendHeader1")
                 .text(legendDescription9[0]);
             var legendHeader2 = d3.select(".legendHeader2")
                 .text(legendDescription9[1]);
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(legendDescription9[2]);
             var legendHeader4 = d3.select(".legendHeader4")
                 .text(legendDescription9[3]);
             var legendHeader5 = d3.select(".legendHeader5")
                 .text(legendDescription9[4]);
             var legendHeader6 = d3.select(".legendHeader6")
                 .text(legendDescription9[5]);
             var legendHeader7 = d3.select(".legendHeader7")
                 .text(legendDescription9[6]);
        };
        
    
        var attributeLegendTitle = d3.select(".attributeLegendTitle")
            .text(labelArrayLeft[variableIndex]);
        
        var legendValue1 = d3.select(".legendValue1")
            .text(classValue1);
        
        var legendValue2 = d3.select(".legendValue2")
            .text(classValue2);
                
        var legendValue3 = d3.select(".legendValue3")
            .text(classValue3);
        
        var legendValue4 = d3.select(".legendValue4")
            .text(classValue4);
        
        var legendValue5 = d3.select(".legendValue5")
            .text(classValue5);
        
        var legendRectangle1 = d3.select(".legendRectangle1")
             .style("fill", legendBoxColor1);
        
         var legendRectangle2 = d3.select(".legendRectangle2")
             .style("fill", legendBoxColor2);
        
         var legendRectangle3 = d3.select(".legendRectangle3")
             .style("fill", legendBoxColor3);
        
         var legendRectangle4 = d3.select(".legendRectangle4")
             .style("fill", legendBoxColor4);
        
         var legendRectangle5 = d3.select(".legendRectangle5")
             .style("fill", legendBoxColor5);
        
        var  leftMapTitle = d3.select(".leftMapTitle")
            .text(mapTitleLeft);
        
         var  leftMapTitle = d3.select(".rightMapTitle")
            .text(mapTitleRight);
        
        var linkBox = d3.select(".linkBox")
            .style("fill", linkBoxColor);
        

    };
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    
    function quantileColorScale(data){
            
        if (variableIndex <= 2) {
            colorClasses = colorClasses1;
        } else if (variableIndex >= 6 ) {
            colorClasses = colorClasses3;
        } else {
            colorClasses = colorClasses2;
        };
           var colorScale = d3.scaleQuantile()
              .range(colorClasses);
             // .domain([1, 5000, 25000, 110000]);
        
       var domainArray = [];
       for (var i=0; i<data.length; i++) {
            var val = parseFloat(data[i][expressedLeft]); //first value in attribute array declared earlier
            domainArray.push(val);
        };  //for loop
        
        colorScale.domain(domainArray);
        
        var quantileValues = colorScale.quantiles();
        console.log(quantileValues);
        
        var tempMax = d3.max(data,function(d){
            return +d[expressedLeft];
        });
        
        var tempMin = d3.min(data, function(d){
            return +d[expressedLeft];  // double-check this
        }); 
        
        //update the legend values based on attribute changes. 
        
       if (variableIndex == 0) {
            tempValue1 = tempMin.toFixed(1);
            tempValue2 = (quantileValues[0]).toFixed(1);
            tempValue3 = (quantileValues[1]).toFixed(1);
            tempValue4 = (quantileValues[2]).toFixed(1);
            tempValue5 = (quantileValues[3]).toFixed(1);
            tempValue6 = tempMax.toFixed(1); 
            }
        if (variableIndex > 0){
            tempValue1 = percentFormatter.format(tempMin/100);
            tempValue2 = percentFormatter.format(quantileValues[0]/100);
            tempValue3 = percentFormatter.format(quantileValues[1]/100);
            tempValue4 = percentFormatter.format(quantileValues[2]/100);
            tempValue5 = percentFormatter.format(quantileValues[3]/100);
            tempValue6 = percentFormatter.format(tempMax/100);
        };
        
        classValue1 = "Less Than " + tempValue2;
        classValue2 = tempValue2 + " to " + tempValue3;
        classValue3 = tempValue3 + " to " + tempValue4;
        classValue4 = tempValue4 + " to " + tempValue5;
        classValue5 = tempValue5 + " or More ";
        
        mapTitleLeft = titlesLeft[variableIndex];
        mapTitleRight = titlesRight[variableIndex];
        
        legendBoxColor1 = colorClasses[0];
        legendBoxColor2 = colorClasses[1];
        legendBoxColor3 = colorClasses[2];
        legendBoxColor4 = colorClasses[3];
        legendBoxColor5 = colorClasses[4];
        
       if (variableIndex == 0) {
           linkBoxColor = "#edf8e9";
        }
        if (variableIndex > 0  && variableIndex < 3) {
            linkBoxColor = "#edf8e9"; 
        }
        if (variableIndex >=3  && variableIndex < 6) {
            linkBoxColor = "#eff3ff"; 
        }
        if (variableIndex >= 6) {
            linkBoxColor = "#feedde"; 
        };

        console.log(linkBoxColor);
        console.log(variableIndex);
        
        updateLegendValues();
        
        return colorScale
        
    }; // quantileColorScale function
    
 ///////////////////////////////////////////////////////////////////////////////
// joins attribute data to spatial data
    
    function joinDataLeft(countyLeft, leftmapCSV){    
        
        for (var i=0; i< leftmapCSV.length; i++) {
            var attributeFIPS = leftmapCSV[i];
            var attributePrimaryKey = attributeFIPS.FIPSF;
            
            for (var j=0; j<countyLeft.length; j++) {
                var spatialDataFIPS = countyLeft[j].properties;
                var spatialDataPrimaryKey = spatialDataFIPS.FIPSF;
                
                if (spatialDataPrimaryKey == attributePrimaryKey){
                    attributeArrayLeft.forEach(function(attr){
                        var val = parseFloat(attributeFIPS[attr]);
                        spatialDataFIPS[attr] = val;
                    });
                }; // if statement block
            }; // inner for loop
        }; // outer for loop
        
        return countyLeft;
        
    };//joinData function


    
    function joinDataRight(countyRight, rightmapCSV){    
        
        for (var i=0; i< rightmapCSV.length; i++) {
            var attributeFIPS = rightmapCSV[i];
            var attributePrimaryKey = attributeFIPS.FIPSF;
            
            for (var j=0; j<countyRight.length; j++) {
                var spatialDataFIPS = countyRight[j].properties;
                var spatialDataPrimaryKey = spatialDataFIPS.FIPSF;
                
                if (spatialDataPrimaryKey == attributePrimaryKey){
                    attributeArrayRight.forEach(function(attr){
                        var val = parseFloat(attributeFIPS[attr]);
                        spatialDataFIPS[attr] = val;
                    });
                }; // if statement block
            }; // inner for loop
        }; // outer for loop
        
        return countyRight;
        
    };//joinData function
    
    function checkChoroplethLeft(props, colorScaleLeft){
         var val = parseFloat(props[expressedLeft]); //This
         if (typeof val == 'number' && !isNaN(val)){
             return colorScaleLeft(val);
         } else {
             return "#CCC";
         }; //if else block
    };// checkChoropleth Function
    
    function checkChoroplethRight(props, colorScaleRight){
         var val = parseFloat(props[expressedRight]); //This
         if (typeof val == 'number' && !isNaN(val)){
             return colorScaleRight(val);
         } else {
             return "#CCC";
         }; //if else block
    };// checkChoropleth Function
    
        


})();