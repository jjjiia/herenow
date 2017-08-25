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
    d3.select("#coordinates").html("Lat: "+lat+"<br/>Lng: "+lng+"<br/>Alt: "+alt)//+"<br/>"+speed+"<br/>"+alt+"<br/>"+heading)
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
var t3 = ",B25064,B15012,B16002,B16004,B25081,B19001,B27010,B19013"
var t4 = ",C15010,B19057,C24030"
var t5 = ",B23025"

var saveForLater = "B19055,B24080,B25004,B25006,B25034,B08134,B25035,B25041,B25065,B25069,B19053,B19059,B25061"

allTables = t1+t2+t3+t4+t5
console.log("showing this many tables: "+allTables.split(",").length)
var returnedData = null
function formatCensusIds(json){
    var blockGroupid = "15000US"+json.Block.FIPS.slice(0,12)
    d3.select("#censusLabelFCC").html("Block: "+json.Block.FIPS+"<br/>Block Group: "+blockGroupid ) 
    pub.censusId = blockGroupid
    getCensusData(pub.censusId,allTables)
//    var tableName = "B01002"
}

//https://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=16000US5367000

function getCensusData(geoid,tableCode){
    var censusReporter = "https://api.censusreporter.org/1.0/data/show/latest?table_ids="+tableCode+"&geo_ids="+geoid
    console.log(censusReporter)
    $.getJSON( censusReporter, function( data ) {
        formatCensusData(data)
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
    returnedData = data
    var formattedData = formatDataSingle(data)
       displayDataText(formattedData)
}
function formatDataSingle(data){
    var geoid = Object.keys(data.data)
    var geoData = data.data[geoid]
    //var tables = Object.keys(codeDictionary)
    var tables = data.tables
    
    var formattedData = {}
    
    for(var i in tables){
        var tableCode = i
        var table = tables[i]        

        formattedData[tableCode]={}
        formattedData[tableCode]["title"]=table.title
        formattedData[tableCode]["columns"]={}
        //console.log(table)
        var columns = Object.keys(table["columns"])
        for(var c in columns){
            var columnCode = columns[c]
            var columnName = table["columns"][columnCode].name
            var columnValue = geoData[tableCode].estimate[columnCode]
            //&& columnValue!=0
            if(columnValue!=undefined && columnValue!=0){
                if(columnCode.substr(columnCode.length -3)!="001"){
                    var totalCode = columnCode.substr(0, columnCode.length -3)+"001"
                    console.log([columnCode,totalCode])
                    var totalValue = geoData[tableCode].estimate[totalCode]
                    var percent = Math.round(columnValue/totalValue*100)
                    console.log("percent: "+percent+" column value: "+columnValue+" totalValue: "+totalValue)
                    formattedData[tableCode]["columns"][columnCode]={"title":columnName,"value":columnValue,"percent":percent}   
                }else{
                    formattedData[tableCode]["columns"][columnCode]={"title":columnName,"value":columnValue}   
                }
                
            }            
        }
    }
    return formattedData
}

getLocation() 
