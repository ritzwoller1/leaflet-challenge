// Create the map
var myMap = L.map("map").setView([37.8, -96], 4);

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(myMap);

// Fetch the GeoJSON data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(response => response.json())
    .then(data => {
        // Create a function to determine the marker size based on magnitude
        function markerSize(magnitude) {
            return magnitude * 3; // Adjust multiplier for size
        }

        // Create a function to determine the marker color based on depth
        function markerColor(depth) {
            return depth > 100 ? "#ff0000" :
                   depth > 50  ? "#ff7f00" :
                   depth > 20  ? "#ffff00" :
                   depth > 0   ? "#7fff00" :
                                 "#00ff00";
        }

        // Loop through the features and create markers
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coords[2];

            // Create a circle marker
            L.circleMarker([coords[1], coords[0]], {
                radius: markerSize(magnitude),
                fillColor: markerColor(depth),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`)
              .addTo(myMap);
        });

        // Create a legend
        var legend = L.control({position: "bottomleft"});

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                depthLabels = [0, 20, 50, 100];
        
            // Loop through the depth intervals and generate a label with a colored square
            for (var i = 0; i < depthLabels.length; i++) {
                div.innerHTML +=
                    '<div>' + // Add a div for each legend item
                    '<i style="background:' + markerColor(depthLabels[i] + 1) + '"></i> ' +
                    depthLabels[i] + (depthLabels[i + 1] ? '&ndash;' + depthLabels[i + 1] + ' km' : '+ km') +
                    '</div>'; // Close the div
            }
        
            return div;
        };
        
        legend.addTo(myMap);

    });

    // I was struggling with getting the legend to add correctly for a while, but then I realized that I was saying legend.addTo(map) instead of legend.addTo(myMap);
    // I also used xPert Learning Assist to help me with the spacing of the legend as initially my color squares were not aligned. Once I created a div for each legend item, this issue was fixed.
