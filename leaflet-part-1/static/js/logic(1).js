// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
let myMap = L.map("map", {
    center: [0,0],
    zoom: 2
});
  
  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90]; // Example grades
    let labels = [];
    // Loop through the grades and generate a label with a colored square for each
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '; width: 20px; height: 20px; display: inline-block;"></i> ' + // Function to get color
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
//legend.onAdd = function() {
//    let div = L.DomUtil.create("div", "info legend");
//    div.innerHTML = '<i style="background: red; width: 20px; height: 20px; display: inline-block;"></i> Test Color';
//    return div;
//};
function getColor(d) {
    return d > 90 ? 'brown' :
           d > 70 ? 'red' :
           d > 50 ? 'orange' :
           d > 30 ? 'yellow' :
           d > 10 ? 'green' :
                    'blue';
}

legend.addTo(myMap);

function getColorByDepth(depth) {
    if (depth < 10) {
        return 'blue'; // Shallow depth
    } 
    else if (depth < 30) {
        return 'green'; // Moderate depth
    } 
    else if (depth < 50) {
        return 'yellow'; // Moderate depth
    }
    else if (depth < 70) {
        return 'orange'; // Moderate depth
    }
    else if (depth < 90) {
        return 'red'; // Moderate depth
    }
    else {
        return 'brown'; // Deep depth
    }
};
  
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

  // Getting our GeoJSON data
d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    let features = data.features
    features.forEach(element => {
        let coord = element.geometry.coordinates
        let marker = L.circleMarker([coord[1], coord[0]], {
            radius: Math.sqrt(element.properties.mag) * 3,
            fillColor: getColorByDepth(coord[2]),
            color: getColorByDepth(coord[2]),
            draggable: true
            }).addTo(myMap);
        marker.bindPopup('Location: ' + element.properties.place + '<br>Magnitude: ' + element.properties.mag + '<br>Depth: ' + coord[2] + '<br><a href="' + element.properties.url +'" target="_blank">More Info</a>');
        console.log(element.geometry.coordinates);
    });
});
  
