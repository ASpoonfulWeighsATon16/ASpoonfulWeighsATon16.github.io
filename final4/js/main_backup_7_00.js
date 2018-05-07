(function() {

    // attributes in CSV file for mapping
    var attributeArray = ["age652010","age652040","Pop2010", "Pop2040",	"per652010", "per652040","RUCC"];
    
    //attribute full names for map/chart labels and dropdown menus
    var labelArray = ["age652010","age652040","Pop2010", "Pop2040",	"per652010", "per652040","RUCC"];
    
    
    // color values from ColorBrewer (Thanks Cynthia, Mark, Ben, Andy and David!)
    var colorClasses = ["#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"];
    
    // variables for legend text values
    var classValue1,
        classValue2,
        classValue3,
        classValue4,
        classValue5;
    
    // index to track which attribute is selected
    var variableIndex = 0;
    
    var expressed = attributeArray[0]; 
    
    // variables for setting chart characteristcs
    var chartWidth = window.innerWidth * 0.9,
        chartHeight = window.innerHeight * 0.25,
        leftPadding = 90,
        rightPadding = 10,
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    
    // variables for setting legend characteristcs
    var legendWidth = window.innerWidth * 0.4,
        legendHeight = window.innerHeight * 0.2,
        legendRectHeight = 20,
        legendRectWidth = 40,
        legendYOffset = 22,
        legendXOffset = 5,
        legendTextYOffset = 26;
        
    
    var yScale = d3.scaleLinear()
        .range([chartHeight - 10, 0])
        .domain([0, 80000]); // set for initial mapping of per capita income
    
   // used to format currency values
   var currencyFormatter = new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD',
       minimumFractionDigits: 0,
    });
    
    // used to format percentage values
    var percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
    });
    
    
    window.onload = setMapLeft(), setMapRight();

   
    
    
////////////////////////////////////////////////////////////////////////////////////////////// 
// sets the initial values/characteristics of the map    

    
    function setMapRight() {

         var width = window.innerWidth * 0.48,
            height = window.innerHeight * 0.70;

        var map = d3.select("#container")
            .append("svg")
            .attr("class", "#rightMap")
            .attr("width", width)
            .attr("height", height);

        var projection = d3.geoAlbers() 
           .rotate([90, 0])
           .center([0.0, 45])
           //.parallels([29.5, 45.5])
           .scale(width*8)
           .translate([width / 2, height / 2])
           .precision(.1);

         //   .scale(width*0.85); //adjust scale based on size of window

        var path = d3.geoPath()
            .projection(projection);

        d3.queue()
            .defer(d3.csv, "data/rightmap.csv")
            .defer(d3.json, "data/wicty2.topojson")
            .await(callback);

        function callback(error, rightmapCSV, rightCounties){

            var countyright = topojson.feature(rightCounties, rightCounties.objects.wicty2).features;  //remember to check .topojson file to be sure you are using the correct objects
            
            countyright = joinData(countyright, rightmapCSV); // join attribute data

            var colorScale = quantileColorScale(rightmapCSV);
            
            setEnumerationUnits(countyright, map, path, colorScale);
            
          setLegend(); // initialize legend
            
       //     setChart(rightmapCSV, colorScale); // initialize chart
            
            createDropdown(rightmapCSV); //initialize dropdown menu
            
            //console.log(error);
            //console.log(rightmapCSV);
            console.log(countyright);
            
        }; // callback function

    }; // setMap function
    
    
    function setMapLeft() {

        var width = window.innerWidth * 0.48,
            height = window.innerHeight * 0.70;

        var map = d3.select("#container")
            .append("svg")
            .attr("class", "#leftMap")
            .attr("width", width)
            .attr("height", height);

        var projection = d3.geoAlbers() 
           .rotate([90, 0])
           .center([0.0, 45])
           //.parallels([29.5, 45.5])
           .scale(width*8.2)
           .translate([width / 2, height / 2])
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
            
            countyLeft = joinData(countyLeft, leftmapCSV); // join attribute data

            var colorScale = quantileColorScale(leftmapCSV);
            
            setEnumerationUnits(countyLeft, map, path, colorScale);
            
            setLegend(); // initialize legend
            
         //  setChart(leftmapCSV, colorScale); // initialize chart
            
            createDropdown(leftmapCSV); //initialize dropdown menu
            
            //console.log(error);
            //console.log(leftmapCSV);
            console.log(countyLeft);
            
        }; // callback function

    }; // setMap function
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////    
    // sets the initial values/characteristics of the legend   
    
     function setLegend(){
         var legend = d3.select("#legendContain")
            .append("svg")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("class", "legend");
        
        // legend text variables
        var legendHeader1 = legend.append("text")
            .attr("class", "legendHeader1")
            .attr("x", legendXOffset)
            .attr("y", 25)
            .text("Per capita income is a basic measure of prosperity.");
        
        var legendHeader2 = legend.append("text")
            .attr("class", "legendHeader2")
            .attr("x", legendXOffset)
            .attr("y", 50)
            .text("It is calculated by aggregating all income in an area ");
        
        var legendHeader3 = legend.append("text")
            .attr("class", "legendHeader3")
            .attr("x", legendXOffset)
            .attr("y", 75)
            .text("and dividing it by the area's population. But are ");
        
        var legendHeader4 = legend.append("text")
            .attr("class", "legendHeader4")
            .attr("x", legendXOffset)
            .attr("y", 100)
            .text("there certain characteristics of states that are");
        
         var legendHeader5 = legend.append("text")
            .attr("class", "legendHeader5")
            .attr("x", legendXOffset)
            .attr("y", 125)
            .text("correlated with per capita income?");
        
        var legendHeader6 = legend.append("text")
            .attr("class", "legendHeader6")
            .attr("x", legendXOffset)
            .attr("y", 140)
            .text("");
        
        var legendHeader7 = legend.append("text")
            .attr("class", "legendHeader7")
            .attr("x", legendXOffset)
            .attr("y", 165)
            .text("Explore various state attributes and see.. ");
        
        var legendBackground = legend.append("rect")
            .attr("class", "legendBackground")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
        
        // legend map value characteristics
        var attributeLegendTitle = legend.append("text")
            .attr("x", legendXOffset)
            .attr("y", 210)
            .attr("class", "attributeLegendTitle")
            .text(labelArray[variableIndex]);
        
        var legendRectangle1 = legend.append("rect")
            .attr("class", "legendRectangle1")
            .attr("x", legendXOffset)
            .attr("y", 220)  
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .style("fill", colorClasses[0]);
        
        var legendValue1 = legend.append("text")
            .attr("class", "legendValue1")
            .attr("x", (legendXOffset + 60))
            .attr("y", 235) 
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
        
        var mapSources = legend.append("text")
            .attr("class", "mapSources")
            .attr("x", legendXOffset)
            .attr("y", (parseFloat(legendValue5.attr("y")) + legendYOffset))
            .text("Data Sources: U.S. Census Bureau and Bureau of Economic Analysis");
         
    };
    
    
    

////////////////////////////////////////////////////////////////////////////////////////////////////
// sets the values/characteristics of the attribute dropdown menu   
    
    function createDropdown(leftmapCSV){
        var dropdown = d3.select("#dropdownContain")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                variableIndex = this.selectedIndex - 1;
                changeAttribute(this.value, leftmapCSV);
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
                if (d == attributeArray[0]) {  // get label values from array based on index of attribute array
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
                };
                return d;
            });
    };

////////////////////////////////////////////////////////////////////////////////////////////////
// following  two functions control highlighting of map and chart features
    
    function highlight(props){
        var selected = d3.selectAll("." + props.FIPSF)
            .style("fill-opacity", "0.1");
          //  .style("stroke-width", "1");
        
        setLabel(props);
    };
    
    function dehighlight(props){
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
// uses label array values to change the text and formating functions to format attribute values
    
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
           };
        
        var labelAttribute = "<h1>" + tempValue + "</h1>"; // <b>" + tempLabelName + "</b>";
        
        //console.log(props[expressed])
       // console.log(expressed);
        
        var infoLabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", props.FIPSF + "_label")
            .html(labelAttribute);
        
        var countyName = infoLabel.append("div")
            .attr("class", "labelname")
            .html(tempLabelName + " in " + props.NAME)
       // console.log(props.COUNTY)
    };

////////////////////////////////////////////////////////////////////////////////////////////////
// changes label positions to be responsive to position on the page.
    
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
// change the map/chart attibute based on change to dropdown menu selection
    
    function changeAttribute(attribute, leftmapCSV) {
        expressed = attribute;
        
        var attributeMax = d3.max(leftmapCSV,function(d){
            return +d[expressed];
        });
        
       var attributeMin = d3.min(leftmapCSV, function(d){
            return +d[expressed];  // double-check this
        });
    
        yScale.range([chartHeight - 10, 0])// range is the height of the chart - 10 or the padding
        yScale.domain([0, attributeMax + (attributeMax * 0.1)]); 
        
        var colorScale = quantileColorScale(leftmapCSV);
        
        var countyBorders = d3.selectAll(".countyBorders")
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
        
        updateChart(bars, leftmapCSV.length, colorScale);  //update the chart values/appeaance
        
    }; // changeAttribute function
        
////////////////////////////////////////////////////////////////////////////////////////////////
//set the map characteristics
    
    function setEnumerationUnits (countyLeft, map, path, colorScale) {
        
        var countyBorders = map.selectAll(".countyBorders")
           .data(countyLeft)
           .enter()
           .append("path")
           .attr("class", function(d){
                return "countyBorders " + d.properties.FIPSF;
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
        
        var desc = countyBorders.append("desc")
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
            .on("mouseover", highlight)
            .on("mouseout", dehighlight)
            .on("mousemove", moveLabel);
        
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
        
        updateChart(bars, leftmapCSV.length, colorScale);
            
    };// setChart function
    
    
    function updateChart(bars, n, colorScale){
        
        bars.attr("x", function(d, i){
            return i * (chartInnerWidth / n) + leftPadding;
        })
            .attr("height", function(d, i){
                return chartHeight - 10 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d, i){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            .style("fill", function(d){
                return checkChoropleth(d, colorScale)
            });
        var chartTitle = d3.select(".chartTitle")
            .text(labelArray[variableIndex] + " by County");
        
        var yAxis = d3.axisLeft()
            .scale(yScale);
        
        d3.selectAll("g.axis")   
            .call(yAxis); 
      
    };// updateChart function

////////////////////////////////////////////////////////////////////////////////////////////
// updates the legend text and legend class values when attributes are changed.    

    function updateLegendValues(){
        
        //console.log (variableIndex);

        if (variableIndex == 0) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("Per capita income is a basic measure of prosperity.");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("It is calculated by aggregating all income in an area ");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("and dividing it by the area's population. But are ");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("there certain characteristics of states that are");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("correlated with per capita income?");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Explore various state attributes and see.. ");
        } else if (variableIndex == 1) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("GDP per worker is a simple measure of productivity.");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("Productive places tend to have higher incomes");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("which is not suprising as higher productivity ");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("tends to lead to higher earnings for workers.");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("Productivity and PCI have a strong positive correlation.");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  0.80 ");
        } else if (variableIndex == 2) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("The Gini coefficient is a measure of income inequality.");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("A Gini coefficient of 0 means perfect income equality");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("while a Gini coefficient of 1 means complete inequality.");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("Places with high PCIs do not necessarily have income equality");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("as state Gini coefficients and PCIs have minimal correlation");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  0.20 ");
        } else if (variableIndex == 3) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("A state's share of its population found in metro areas is an");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("indicator of economic agglomeration and concentration.");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("However, overall metro area population has a weak correlation");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("with state PCI. Instead, a state's share of residents in");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("very large metros is a better indicator of prosperity.");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  0.34");
        } else if (variableIndex == 4) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("A state's share of its working age population (age 18 to 64)");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("with a college degree is a measure of state human capital.");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("As individuals with high levels of human capital often");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("earn higher wages, it should not be suprising that a state's");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("college educated population and PCI are highly correlated");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  0.86");
        } else if (variableIndex == 5) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("A state's share of employment working in the manufacturing");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("sector has a moderate negative correlation with state PCI.");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("While manufacturing can be a highly productive industry,");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("productivity, wages and growth can vary significantly ");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("across differnt manufacturing categories. ");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  -0.42");
        } else if (variableIndex == 6) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("A state's share of employment working professional, technical");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("and scientific services is modestly/strongly correlated with PCI.");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("These jobs involve many occupations that require significant");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("amounts of education and training. As a result, these jobs ");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("often offer high wages and earnings for workers.");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient = 0.66");
        } else if (variableIndex == 7) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("A state's share of residents born in other states is a");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("measure of population churn and leftmap over time.");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("States with high shares of residents from elsewhere have");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("more opporunities for knowledge spillovers and information");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("sharing. This measure has a weak correlation with PCI.");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  0.33");
        } else if (variableIndex == 8) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("Similar to a state's share of residents born in other states,");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("the share of residents who are foreign born is another ");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text("measure of population leftmap. Again, these residents create");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("more opporunities for knowledge spillovers and information");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("sharing. This measure has a modest correlation with PCI.");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  0.51");
        } else if (variableIndex == 9) {
             var legendHeader1 = d3.select(".legendHeader1")
                 .text("Transfer payments include payments from the government");
             var legendHeader2 = d3.select(".legendHeader2")
                 .text("such as Social Security, Medicaid, Medicare, veterans' benefits");
             var legendHeader3 = d3.select(".legendHeader3")
                 .text(" and unemployment insurance. Many of these payments are to ");
             var legendHeader4 = d3.select(".legendHeader4")
                 .text("people who are not working, resulting in a strongly negative");
             var legendHeader5 = d3.select(".legendHeader5")
                 .text("correlation between transfer payment levels and state PCI.");
             var legendHeader6 = d3.select(".legendHeader6")
                 .text("");
             var legendHeader7 = d3.select(".legendHeader7")
                 .text("Pearson correlation coefficient:  -0.74");
        };
        
    
        var attributeLegendTitle = d3.select(".attributeLegendTitle")
            .text(labelArray[variableIndex]);
        
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
        
    };
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    
    function quantileColorScale(data){
                
    
        
           var colorScale = d3.scaleQuantile()
              .range(colorClasses)
              .domain([1, 5000, 25000, 110000]);
        
       var domainArray = [];
       for (var i=0; i<data.length; i++) {
            var val = parseFloat(data[i][expressed]); //first value in attribute array declared earlier
            domainArray.push(val);
        };  //for loop
        
      //  colorScale.domain(domainArray);
        
        var quantileValues = colorScale.quantiles();
   //     console.log(quantileValues);
        
        var tempMax = d3.max(data,function(d){
            return +d[expressed];
        });
        
        var tempMin = d3.min(data, function(d){
            return +d[expressed];  // double-check this
        }); 
        
        //update the legend values based on attribute changes. 
        
        if (variableIndex <= 1) {
            tempValue1 = currencyFormatter.format(tempMin);
            tempValue2 = currencyFormatter.format(Math.round(quantileValues[0]));
            tempValue3 = currencyFormatter.format(Math.round(quantileValues[1]));
            tempValue4 = currencyFormatter.format(Math.round(quantileValues[2]));
            tempValue5 = currencyFormatter.format(Math.round(quantileValues[3]));
            tempValue6 = currencyFormatter.format(tempMax);
         } else if (variableIndex == 2){
            tempValue1 = tempMin.toString();
            tempValue2 = quantileValues[0].toString();
            tempValue3 = quantileValues[1].toString();
            tempValue4 = quantileValues[2].toString();
            tempValue5 = quantileValues[3].toString();
            tempValue6 = tempMax.toString();
        } else if (variableIndex > 2){
            tempValue1 = percentFormatter.format(tempMin/100);
            tempValue2 = percentFormatter.format(quantileValues[0]/100);
            tempValue3 = percentFormatter.format(quantileValues[1]/100);
            tempValue4 = percentFormatter.format(quantileValues[2]/100);
            tempValue5 = percentFormatter.format(quantileValues[3]/100);
            tempValue6 = percentFormatter.format(tempMax/100);
        };
        
        classValue1 = tempValue1 + " to " + tempValue2;
        classValue2 = tempValue2 + " to " + tempValue3;
        classValue3 = tempValue3 + " to " + tempValue4;
        classValue4 = tempValue4 + " to " + tempValue5;
        classValue5 = tempValue5 + " to " + tempValue6;
        
        updateLegendValues();
        
        return colorScale
        
    }; // quantileColorScale function
    
 ///////////////////////////////////////////////////////////////////////////////
// joins attribute data to spatial data
    
    function joinData(countyLeft, leftmapCSV){    
        
        for (var i=0; i< leftmapCSV.length; i++) {
            var attributeFIPS = leftmapCSV[i];
            var attributePrimaryKey = attributeFIPS.FIPSF;
            
            for (var j=0; j<countyLeft.length; j++) {
                var spatialDataFIPS = countyLeft[j].properties;
                var spatialDataPrimaryKey = spatialDataFIPS.FIPSF;
                
                if (spatialDataPrimaryKey == attributePrimaryKey){
                    attributeArray.forEach(function(attr){
                        var val = parseFloat(attributeFIPS[attr]);
                        spatialDataFIPS[attr] = val;
                    });
                }; // if statement block
            }; // inner for loop
        }; // outer for loop
        
        return countyLeft;
        
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