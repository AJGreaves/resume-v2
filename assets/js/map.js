/* Set which part of the world the map loads on, and the zoom level */
let mymap = L.map('map').setView([52.856, 5.545], 4);

/* Builds map with access token */
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY29kZWluc3RpdHV0ZSIsImEiOiJja2d4dXgzbXIwbmxvMnJyMXAwMmpuemI4In0.VLKabDve9EvypBPxhLOYCw', {
    attribution: false,
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

/* Sets markers */
let djangoCon = L.marker([55.683610, 12.563650]).addTo(mymap);
let reactEurope = L.marker([48.856613, 2.352222]).addTo(mymap);
let euroPython = L.marker([55.953251, -3.188267]).addTo(mymap);

/* Sets contents for popups on markers */
djangoCon.bindPopup("<b>DjangoCon</b><br>København, Denmark").openPopup();
reactEurope.bindPopup("<b>React Conf</b><br>Paris, France");
euroPython.bindPopup("<b>EuroPython</b><br>Edinburgh, Scotland ");