

function makeCharts(){
    
        makePieChart("B02001")
        makePieChart("B08301")
        makePieChart("B08303")
        makePieChart("B15003")
   // console.log("charts")
}
function getTableName(tableCode){
   return returnedData.tables[tableCode].title
}

function makePieChart(tableCode){
    
    var data = getTableData(tableCode)
    console.log(data)
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