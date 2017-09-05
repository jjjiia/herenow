function makeCharts(){
    //  makePieChart("B02001")
   //    makePieChart("B08301")
   //    makePieChart("B08303")
   //    makePieChart("B15003")
   //
    makeBarChart("B02001",true)
    makeBarChart("B08301",true)
    makeBarChart("B08303",false)
    makeBarChart("B15003",false)
//   // makePieChart("B25003")
//   // makePieChart("B25002")
    makeBarChart("B23025",true)
// //   makePieChart("B19057")
     makeBarChart("B07201",true)
     makeBarChart("B15012",true)
     makeBarChart("B23025",true)
     makeBarChart("B19001",false)
   // console.log("charts")
}
function getTableName(tableCode){
   return returnedData["blockGroup"].tables[tableCode].title
}
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
function drawBarKey(){
    
    var legendKeys = ["blockGroup","tract","county"]
    var colors = geoColors
   // console.log(legendKeys)
    
    var text = ""
    for(var i in legendKeys){
        var key = legendKeys[i]
        var color = colors[key]
        text +="<span style=\"color:"+color+"; font-size = 30px\">&#9744; "+key+"</span>  "   
    }    
    d3.select("#key").html(text)
            
}
function makeBarChart(tableCode, sort){
    var data = getTableData(tableCode)
    var chartDiv = d3.select("#barCharts").append("div").html(getTableName(tableCode)+"</br/>").attr("id",tableCode)
    .attr("class","barChart")
    var max = 100
    
    var keys = []
    
    var keyCodes = []
    var maxKeyLength = 0
    if(sort == true){
        var sorted = data["blockGroup"].sort(function(a,b){
              return b[1]-a[1];})
    }else{
        sorted = data["blockGroup"]
    }
    
    
    //  var sorted = formattedGData.sort(function(a,b){
    //      return b[1]-a[1];
    //  });
    
    for(var i in sorted){
        var keyCode = sorted[i][0]
        var key = getTitle(keyCode)
        if(key.length>maxKeyLength){
            maxKeyLength = key.length
        }
        keyCodes.push(keyCode)
        keys.push(key)
    }
    
    var margin = {left:260,top:0}
    var barWidth = 80
    var height = barWidth*keys.length
    var width = window.innerWidth-20
    
    var xScale = d3.scale.linear().domain([0,max]).range([10,width-margin.left-50])
    var yScale = d3.scale.ordinal().domain(keys).rangeRoundBands([0, height-10],0);
//.rangePoints([0,height])
    
 
    //var xScale = d3.scale.ordinal().domain(["red","blue","orange","purple"]).range([0,width])
    // var xScale = d3.scale.ordinal().domain([new Date(2012, 0, 1), new Date(2013, 0, 1)])
//.range([0,width])
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
           
    var svg = chartDiv.append("svg")
        .attr("width",width)
        .attr("height",height)
        
//   svg.append('g')
//       .attr('class', 'x axis')
//       .attr("transform", "translate(" + margin.left + "," + height + ")")
//       .call(xAxis);
//
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (margin.left-5) + ",0 )")
        .call(yAxis)
        .selectAll(".tick text")
      .call(wrap, margin.left-5);
      
    var chart = svg.selectAll("rect")
        .data(keyCodes)
        .enter()
        .append("rect")
        .attr("y",function(d,i){return i*barWidth})
        .attr("x",function(d,i){return 0; })
        .attr("fill",geoColors["blockGroup"])
        .attr("height",function(d,i){return barWidth-4})
        .attr("width",function(d,i){
            var percent = getPercent(d,"blockGroup")
            return xScale(percent)})
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("opacity",.5)
    
    
    svg.selectAll(".tract").data(keyCodes)
        .enter()
        .append("rect")
        .attr("y",function(d,i){return i*barWidth})
        .attr("x",function(d,i){
            var percent = getPercent(d,"tract")
            return xScale(percent)
        })
        .attr("fill",geoColors["tract"])
        .attr("class","tract")
        .attr("height",function(d,i){return barWidth-4})
        .attr("width",function(d,i){
            return 4
            var percent = getPercent(d,"tract")
            return xScale(percent)
        })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("opacity",1)
    
    svg.selectAll(".county").data(keyCodes)
        .enter()
        .append("rect")
        .attr("y",function(d,i){return i*barWidth})
        .attr("x",function(d,i){
            var percent = getPercent(d,"county")
            return xScale(percent)
        })
        .attr("fill",geoColors["county"])
        .attr("class","county")
        .attr("height",function(d,i){return barWidth-4})
        .attr("width",function(d,i){
            return 4
        })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("opacity",1)
        
svg.selectAll(".percentLabel")
        .data(keyCodes)
        .enter()
        .append("text")
        .attr("class","percentLabel")
        .attr("y",function(d,i){return i*barWidth+barWidth/2})
        .attr("x",function(d,i){
            return 0
            var percent = getPercent(d,"blockGroup")
            return xScale(percent)+5})
        .attr("fill",geoColors["blockGroup"])
            .attr("opacity",.8)
        .text(function(d,i){
            var percent = getPercent(d,"blockGroup")
            return Math.round(percent)+"%"})
        .attr("transform", "translate(" + (width-50) + "," + margin.top + ")")

}
function drawMap(geoData){
    var svg = d3.select("#map").append("svg").attr("width",300).attr("height",300)
//    
    var center = [Math.round(pub.coordinates[1]*10000)/10000,Math.round(pub.coordinates[0]*10000)/10000]
//    console.log(center)
//  var center = [-122.4183, 37.7750]
    var div = "map"
//
    var width = window.innerWidth
      height = window.innerWidth
//    var width = 300
//    var height = 300
//
    drawBaseMap(width,height,div,center)  
    drawMapLayer(geoData,width,height)  
    drawBarKey()
    
}
function drawBaseMap(width,height,div,center){

    var tiler = d3.geo.tile()
        .size([width, height]);

    var projection = d3.geo.mercator()
        .center(center)
        .scale((1 << 23) / 2 / Math.PI)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#"+div+" svg")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("g")
        .data(tiler
          .scale(projection.scale() * 2 * Math.PI)
          .translate(projection([0, 0])))
      .enter().append("g")
        .each(function(d) {
          var g = d3.select(this);
          d3.json("https://vector.mapzen.com/osm/roads/" + d[2] + "/" + d[0] + "/" + d[1] + ".json?api_key=vector-tiles-LM25tq4", function(error, json) {
            if (error) throw error;

            g.selectAll("path")
              .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
            .enter().append("path")
              .attr("class", function(d) { return d.properties.kind+" basemap"; })
              .attr("d", path);
          });
        });
}

function drawMapLayer(geoData,width,height){
    
//    var width = 300
//    var height = 300
    
    var colors = geoColors
    var svg = d3.select("#map svg")
        
        //need to generalize projection into global var later
    var center = [pub.coordinates[1],pub.coordinates[0]]
    var lat = center[1]
    var lng = center[0]
    
    var projection = d3.geo.mercator()
        .scale((1 << 23) / 2 / Math.PI)
    .center(center)		    
        .translate([width/2,height/2])

        //d3 geo path uses projections, it is similar to regular paths in line graphs
    var path = d3.geo.path().projection(projection);
    var lineFunction = d3.svg.line()
        .x(function(d){
            return projection([d[0],d[1]])[0]
        })
        .y(function(d){
           // console.log(projection([d[0],d[1]])[1])
            return projection([d[0],d[1]])[1]})
        .interpolate("linear");
        //push data, add path
        //[topojson.object(geoData, geoData.geometry)]   
         
	svg.selectAll("path")
        .append("path")
		.attr("class","county")
		.attr("d",lineFunction(geoData["countyGeo"].geometry.coordinates[0]))
		.attr("stroke",colors.county)
        .attr("stroke-width",5)
        .attr("fill",colors.county) 
        .attr("opacity",1)    

	svg
        .append("path")
		.attr("class","tract")
		.attr("d",lineFunction(geoData["tractGeo"].geometry.coordinates[0]))
		.attr("stroke",colors.tract)
        .attr("fill","none")  
        .attr("stroke-width",4)
        .attr("opacity",1)        
        
	svg
        .append("path")
		.attr("class","blockGroup")
		.attr("d",lineFunction(geoData["blockGeo"].geometry.coordinates[0]))
		.attr("stroke",colors.blockGroup)
        .attr("stroke-width",2)
        .attr("fill",colors.blockGroup)
        .attr("opacity",.7)

    var cross = d3.svg.symbol().type('cross')
			.size(20);
            
    svg.append("path").attr("class","location")
        .attr("d",cross)
		.attr('transform',function(d,i){
            var projectedLng = projection([lng,lat])[0]
            var projectedLat = projection([lng,lat])[1]
             return "translate("+projectedLng+","+projectedLat+") rotate(-45)"; 
             });
}

function makePieChart(tableCode){
    var data = getTableData(tableCode)
    var width = 400
    var height = 400
    var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b",  "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
    var radius = width/8
    
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { 
            console.log(d[1]);
            return d[1]; 
        });
    var path = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);
        
    var labelArc = d3.svg.arc()
        .outerRadius(width/5+10)
        .innerRadius(0);
        
    var chartDiv = d3.select("#charts").append("div").html(getTableName(tableCode)+"</br/>")
    var svg = chartDiv.append("svg")
        .attr("width",width)
        .attr("height",height)
    
    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var arc = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
        .attr("class", "arc"); 
        
   arc.append("path")
        .attr("d", path)
        .attr("stroke","#fff")
        .attr("stroke-width",1)
        .attr("fill", function(d,i) { 
            return "#000"
            return colors[i]; });

    arc.append("text")
        .attr("transform", function(d) { 
	  	    var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
	  	    return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(90) rotate(" + (midAngle * 180/Math.PI) + ")"; 
        })
	    .attr("dy", ".35em")
        .attr("font-size",12)
        .text(function(d) { 
            return getTitle(d.data[0])
            return d.data[0] });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}