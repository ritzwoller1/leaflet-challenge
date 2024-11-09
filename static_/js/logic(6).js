// Store our API endpoints
var boundariesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

var esri = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }); 

// Define baseMaps Object to Hold Base Layers
let baseMaps = {
    street:street,
    topo: topo,
    esri:esri
};

// Create an overlay object to hold our overlay.
let overlayMaps = {
    "Earthquakes": earthquakes,
    "BoundaryLines" : tectonicPlates
  }
  

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street,topo ]  //earthquakes
  });

  


  d3.json(boundariesUrl).then(function(plateData){
      L.geoJson(plateData,{
          color:"red",
          weight:2
      }).addTo(tectonicPlates)
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Retrieve earthquakesURL (USGS Earthquakes GeoJSON Data) with D3

d3.json(earthquakesURL).then(function(earthquakeData){

    // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 5;
    }

    // Function to Determine Color of Marker Based on the depth of the Earthquake
    function chooseColor(depth) {
        
        if (depth > 90)
            return "#1f306e";
        else if (depth > 70)
            return "#553772";
        else if (depth > 50)
            return "#8f3b76";
        else if (depth > 30)
            return "#c7417b";
        else if (depth > 10)
            return "#f5487f";
        else
            return "#fa9ebb";
        
    }

    // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 1.5
        };
    }

    L.geoJson(earthquakeData,{
        pointToLayer:function(feature,latlang){
            return L.circleMarker(latlang);
        },
        style:styleInfo,
    
    }).addTo(earthquakes);

    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        depthLevels = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3>Depth</h3>"

        for (var i = 0; i < depthLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(depthLevels[i] + 1) + '"></i> ' +
                depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
});

earthquakes.addTo(myMap)
    



  









    
  



  