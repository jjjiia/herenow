var tables = []
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(usePosition);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function formatLocation(position){
    var lng = position.coords.longitude
    var lat = position.coords.latitude        
    var alt = position.coords.altitude 
    pub.coordinates = [lat,lng]
    d3.select("#coordinates").html("<strong>Lat:</strong> "+Math.round(lat*1000000)/1000000+" <strong>Lng:</strong> "+Math.round(lng*10000)/10000+" <strong>Alt:</strong> "+Math.round(alt*1000000)/1000000)//+"<br/>"+speed+"<br/>"+alt+"<br/>"+heading)
    return [lat,lng]
}

//var sampleLocation = [40.718914, -73.9547791]  
//var sampleUrl_fcc = "https://data.fcc.gov/api/block/2010/find?format=jsonp&latitude=40.718914&longitude=-73.9547791"
//var smapleUrl_census = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Suitland%2C+MD+20746&benchmark=9&format=json"

function usePosition(position) {
    var latLng = formatLocation(position)
    var lat = latLng[0]
    var lng = latLng[1]
    var fccUrl = "https://data.fcc.gov/api/block/2010/find?format=jsonp&latitude="+lat+"&longitude="+lng       
    getCensusId(fccUrl,"jsonp","formatCensusIds")
    
//var censusUrl =" https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Suitland%2C+MD+20746&benchmark=9&format=jsonp"
//getJson(censusUrl,"jsonp","censusGeography")
}
function getCensusId(url,type,callBack){
    $.ajax({
    url: url,
    dataType: type,
    jsonpCallback: callBack
    });
}
//employeement B23025
//income  B19001
//education B15002
//language B16007
//place of birth B05006
//mobility B07003
//realestate B25075
var t1 = "B01003,B01002,B25002,B02001,B25003,B07201,B15003"
var t2 = ",B08301,B08302,B08303"
var t3 = ",B25064,B15012,B16002,B19001,B27010,B19013"
var t4 = ",B19057"
var t5 = ",B23025"

var saveForLater = "C15010,B19055,B24080,B25004,B25006,B25034,B08134,B25035,B25041,B25065,B25069,B19053,B19059,B25061,C24030,B25081,B16004,"

allTables = t1+t2+t3+t4+t5
console.log("showing this many tables: "+allTables.split(",").length)

function makeParagraph(){
var paragraph = "<strong>You are at </strong> a place where the median age is "
+formatValues(getValue("B01002001"))+". "

+formatPercents(getPercent("B02001002",0))+" residents are white, "
+formatPercents(getPercent("B02001003",0))+" are black or african american, "
+formatPercents(getPercent("B02001004",0))+" are american indian or alaska native, and "
+formatPercents(getPercent("B02001005",0))+" are asian. Where "
+formatPercents(getPercent("B16002002",0))+" of households speak only English"
+", and "+ formatPercents(getPercent("B07201002",0))+ " lived in the same house last year. "
+formatPercents(getPercent("B08301010",0))+" commute on public transportation, "
+formatPercents(getPercentSum(["B08302003","B08302002","B08302004"],0))+ " leave for work before 6am. Where "
//+formatPercents(getPercentSum(["B15003022","B15003023","B15003024","B15003025"]))+" of residents graduated college,"
//+" their most popular majors were "+ formatValues(getTopRanked("B15012",3))+". "
//+formatPercents(getPercent("B23025005",0))+" are unemployed. "
//+formatPercents(getPercentSum(["B27010017","B27010033","B27010050","B27010066"]))+" have no insurance coverage. "
//+ "The median household income is "+ formatMoney(getValue("B19013001",0))+", and "
//+ formatPercents(getPercentSum(["B19001014","B19001015","B19001016","B19001017"]))+" of households make more than $100,000."
//
d3.select("#paragraph").html(paragraph)
}
var colors = ["#de4645","#4dbb31","#ea4a73","#45b865","#e64821","#87b733","#b3324f","#5b821d","#a5361a","#b1a930","#d77231","#d1902e"]


function getPercent(code,geoGroup){
    var table = code.substr(0, code.length -3)
    var codeValue = returnedData[geoGroup].data[Object.keys(returnedData[geoGroup].data)][table].estimate[code]
    var totalCode = table+"001"
    var totalValue = returnedData[geoGroup].data[Object.keys(returnedData[geoGroup].data)][table].estimate[totalCode]
    var percent = codeValue/totalValue*100
    return percent
}

function formatPercents(percent){
    var color = colors[Math.round(Math.random()*colors.length)]
    return "<span style=\"color:"+color+"\"><strong>"+Math.round(percent)+"%</strong></span>"
}
function formatMoney(money){
    var color = colors[Math.round(Math.random()*colors.length)]
    money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "<span style=\"color:"+color+"; font-size = 24px\"><strong>$"+money+"</strong></span>"
}
function formatValues(value){
    var color = colors[Math.round(Math.random()*colors.length)]
    return "<span style=\"color:"+color+"\"><strong>"+value+"</strong></span>"
}

function getPercentSum(codes,geoGroup){
    var sum = 0
    for(var c in codes){
        var code = codes[c]
        sum+=getPercent(code,geoGroup)
    }
    return sum
}
function getTitle(code){
    var table = code.substr(0, code.length -3)
    if(returnedData.length>1){
        var codeTitle = returnedData[0].tables[table].columns[code].name    
    }else{
        var codeTitle = returnedData.tables[table].columns[code].name
    }
    return codeTitle
}
function getTableData(tableCode){
    var list = []
    var codes = Object.keys(returnedData.data[Object.keys(returnedData.data)][tableCode].estimate)
    var totalCode = tableCode+"001"
    var tableCodeIndex = codes.indexOf(totalCode)
    codes.splice(tableCodeIndex,1)
    for(var c in codes){
        var code = codes[c]
        var codeValue = returnedData.data[Object.keys(returnedData.data)][tableCode].estimate[code]
        if(codeValue>0){
            list.push([code,codeValue])
        }
    }
    var sorted = list.sort(function(a,b){
        return b[1]-a[1];
    });
    return sorted
}

function getTopRanked(tableCode,ranks){
    
   var sorted = getTableData(tableCode)
    
    
    var tops = sorted.slice(0,ranks)
    
    var s =""
    for(var t in tops){
       // console.log(t)
        var code = tops[t][0]
        var codeValue = Math.round(getPercent(code))
        var codeTitle = getTitle(code)
        
        s+=codeTitle+"("+codeValue+"%), "
    }
    
    s = s.slice(0,s.lastIndexOf(", "))
    s = s.substring(0,s.lastIndexOf(","))+", and "+s.substring(s.lastIndexOf(",")+1)
    return s
}
function getValue(code){
    var table = code.substr(0, code.length -3)
    if(returnedData.length>1){
        var codeValue = returnedData[0].data[Object.keys(returnedData[0].data)][table].estimate[code]
    }else{
        var codeValue = returnedData.data[Object.keys(returnedData.data)][table].estimate[code]        
    }
    return codeValue
}
var returnedData = null
function formatCensusIds(json){
    var blockGroupid = "15000US"+json.Block.FIPS.slice(0,12)
    var county = "050|04000US"+json.County.FIPS
    var tractId = "14000US"+json.Block.FIPS.slice(0,11)
    
    d3.select("#censusLabelFCC").html("<strong>Block Group:</strong> "+blockGroupid)
    pub.censusId = blockGroupid
    getCensusData(pub.censusId,tractId,county,allTables)
//    var tableName = "B01002"
}

//https://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=16000US5367000

function getCensusData(geoid,tractId,county,tableCode){
    var allData = []
    var censusReporter = "https://api.censusreporter.org/1.0/data/show/latest?table_ids="+tableCode+"&geo_ids="+county
    $.getJSON( censusReporter, function( blockGroupData ) {
        allData.push(blockGroupData)
        var censusReporter = "https://api.censusreporter.org/1.0/data/show/latest?table_ids="+tableCode+"&geo_ids="+tractId
        $.getJSON( censusReporter, function( tractData ) {
            allData.push(tractData)
            var censusReporter = "https://api.censusreporter.org/1.0/data/show/latest?table_ids="+tableCode+"&geo_ids="+geoid            
            $.getJSON( censusReporter, function( countyData ) {
                allData.push(countyData)
                returnedData = allData
                formatCensusData(countyData)                
            });    
        });
    });
}

var columnsToDisplay = []


function displayDataText(data){
    var displayText = ""
    
    for(var i in data){
        var title = data[i].title
        var columns = data[i].columns
        //console.log(title)
        displayText+="<br/><strong>"+title+"</strong><br/>"
        for(var c in columns){
            var columnTitle = columns[c].title
            var value = columns[c].value
            displayText += c+": "+columnTitle+": "+value
            if(columns[c].percent!=undefined){
                displayText+=" or "+columns[c].percent+"%"+"<br/>"
            }else{
                displayText+="<br/>"
            }
           // console.log([columnTitle,value])
        }
    }
    
    d3.select("#data").html(displayText)
}
function formatCensusData(data){
    //returnedData = data
var color = d3.scale.ordinal()
	.range(["#888","#555","red"]);
	
var radarChartOptions = {
  w: 600,
  h: 600,
  margin: {top: 100, right: 100, bottom: 100, left: 100},
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};
//Call function to draw the Radar chart
RadarChart(".charts", formatDataRadar("B02001"), radarChartOptions);
//RadarChart(".charts", formatDataRadar("B08301"), radarChartOptions);
//RadarChart(".charts", formatDataRadar("B08303"), radarChartOptions);
//RadarChart(".charts", formatDataRadar("B15003"), radarChartOptions);

    //   displayDataText(formattedData)
    makeParagraph()
    //makeCharts()
}
function formatDataRadar(tableCode){
   // console.log(returnedData)
    var radarData = []
    for(var g in returnedData){
        var gData = returnedData[g]
        var geoId = Object.keys(gData.data)
        var tableData = gData.data[geoId][tableCode].estimate
        var formattedGData = []
        for(var i in tableData){
            var key = i
            var value = getPercent(key,g)
            var keyTitle = getTitle(key)
            if(value!=100){
                formattedGData.push({axis:keyTitle,value:value/100})
            }
        }
        radarData.push(formattedGData)
    }
    var sorted =  radarData[0].sort(function(a,b){
        return b["value"]-a["value"];
    });
    radarData[0]=sorted
    //getrid of 0 categories
    //console.log(radarData)
    return radarData
}

getLocation()