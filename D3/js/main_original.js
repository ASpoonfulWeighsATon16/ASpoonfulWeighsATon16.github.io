var w = 900, h = 500;

//window.onload = setMap();
    
  var container = d3.select("body")
    .append("svg")
    .attr ("width", w)
    .attr ("height", h)
    .attr ("class", "container")
    .style("background-color", "rgba(0,0,0,0.2)");
    
  var innerRect = container.append("rect")
    .datum(400)  
    .attr("width", function(d) {
        return d * 2;
    })
    .attr("height", function(d){
        return d;
    })
    .attr("class", "innerRect")
    .attr("x", 50)
    .attr("y", 50)
    .style("fill", "#FFFFFF");
    console.log(container)

  //var dataArray = [10, 20, 30, 40, 50];
   
  var cityPop = [
        { 
            city: 'Madison',
            population: 233209
        },
        {
            city: 'Milwaukee',
            population: 594833
        },
        {
            city: 'Green Bay',
            population: 104057
        },
        {
            city: 'Superior',
            population: 27244
        }
    ];



var minPop = d3.min(cityPop, function(d){
      return d.population;
  });

 var maxPop = d3.max(cityPop, function(d){
      return d.population; 
  });

  var x = d3.scaleLinear()
    .range([90, 750])
    .domain([0, 3]);

  var y = d3.scaleLinear()
    .range([450, 50])
    .domain([0, 700000]);

var color = d3.scaleLinear()
   .range ([
       "#FDBE85",
       "#D94701"
   ])
   .domain([
       minPop,
       maxPop
   ]);


  var circles = container.selectAll(".circles")
    .data(cityPop)
    .enter()
    .append("circle")
    .attr("class", "circles")
    .attr("id", function(d){
        return d.city;
    })
    .attr("r", function(d){
       var area = d.population * 0.01;
       return Math.sqrt(area/Math.PI);
    })
    .attr("cx", function(d, i){  // i is the index of the array element
        return x(i);  // x is the variable used to set the scale generator
    })
    .attr("cy", function(d){
        return y(d.population);
    })
    
    .style("fill", function(d,i){
        return color(d.population);
    })
    
    .style("stroke", "#000");
    
  var yAxis = d3.axisLeft(y)
    .scale(y);
  
  var axis = container.append("g")
    .attr("class", axis)
    .attr("transform", "translate(50,0)")
    .call(yAxis);
  
  var title = container.append("text")
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .attr("x", 450)
    .attr("y", 30)
    .text("City Populations");

  var labels = container.selectAll(".labels")
    .data(cityPop)
    .enter()
    .append("text")
    .attr("class", "labels")
    .attr("text-anchor", "left")
    .attr("y", function(d){
        return y(d.population);
    });
 
  var nameLine = labels.append("tspan")
    .attr("class", "nameLine")
    .attr("x", function(d,i){
        return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
    })
    .text(function(d){
        return d.city;
    });
  
  var format = d3.format(",");
  
  var popLine = labels.append("tspan")
    .attr("class", "popLine")
    .attr("x", function(d,i){
        return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
    })
    .attr("dy", "15")
    .text(function(d){
        return "Pop. " + format(d.population);
    });
    
   
