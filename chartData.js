

function makeCharts(){
    
    //  makePieChart("B02001")
   //    makePieChart("B08301")
   //    makePieChart("B08303")
   //    makePieChart("B15003")
   //
    drawBarKey()
    makeBarChart("B02001")
    makeBarChart("B08301")
    makeBarChart("B08303")
    makeBarChart("B15003")
//   // makePieChart("B25003")
//   // makePieChart("B25002")
    makeBarChart("B23025")
// //   makePieChart("B19057")
     makeBarChart("B07201")
     makeBarChart("B15012")
     //makeBarChart("B16002")
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
    var colors = {
        county:"blue",
        blockGroup:"#aaa",
        tract:"red"
    }
    console.log(legendKeys)
    var svg = d3.select("#barCharts").append("svg").attr("width",100).attr("height",60)
    svg.selectAll(".key")
    .data(legendKeys)
    .enter()
    .append("rect")
    .attr("width",10)
    .attr("height",10)
    .attr("x",10)
    .attr("y",function(d,i){console.log(d); return i*20})
    .attr("fill",function(d){return colors[d]})
    
    svg.selectAll(".key")
    .data(legendKeys)
    .enter()
    .append("text")
    .text(function(d){return d})
    .attr("x",30)
    .attr("y",function(d,i){console.log(d); return i*20+10})
    .attr("fill",function(d){return colors[d]})
    .attr("font-size",12)
            
}
function makeBarChart(tableCode){
    var data = getTableData(tableCode)
    var chartDiv = d3.select("#barCharts").append("div").html(getTableName(tableCode)+"</br/>").attr("id",tableCode)
    .attr("class","barChart")
    var max = 100
    
    var keys = []
    
    var keyCodes = []
    var maxKeyLength = 0
    for(var i in data["blockGroup"]){
        var keyCode = data["blockGroup"][i][0]
        var key = getTitle(keyCode)
        if(key.length>maxKeyLength){
            maxKeyLength = key.length
        }
        keyCodes.push(keyCode)
        keys.push(key)
    }
    
    var margin = {left:180,top:0}
    var barWidth = 40
    var height = barWidth*keys.length
    var width = 450+margin.left
    
    var xScale = d3.scale.linear().domain([0,max]).range([10,width-margin.left])
    var yScale = d3.scale.ordinal().domain(keys)    .rangeRoundBands([0, height-10],0);
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
        .attr("fill","#aaa")
        .attr("height",function(d,i){return barWidth-4})
        .attr("width",function(d,i){
            var percent = getPercent(d,"blockGroup")
            return xScale(percent)})
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("opacity",.2)
            
    svg.selectAll(".tract").data(keyCodes)
        .enter()
        .append("rect")
        .attr("y",function(d,i){return i*barWidth})
        .attr("x",function(d,i){
            var percent = getPercent(d,"tract")
            return xScale(percent)
        })
        .attr("fill","red")
        .attr("class","tract")
        .attr("height",function(d,i){return barWidth-4})
        .attr("width",function(d,i){
            return 2
            var percent = getPercent(d,"tract")
            return xScale(percent)
        })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("opacity",.1)
    
    svg.selectAll(".county").data(keyCodes)
        .enter()
        .append("rect")
        .attr("y",function(d,i){return i*barWidth})
        .attr("x",function(d,i){
            var percent = getPercent(d,"county")
            return xScale(percent)
        })
        .attr("fill","blue")
        .attr("class","county")
        .attr("height",function(d,i){return barWidth-4})
        .attr("width",function(d,i){
            return 2
        })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("opacity",.1)

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