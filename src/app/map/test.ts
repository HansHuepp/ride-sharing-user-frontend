displayRoute() {
  // Clear previous route
  if (this.map.getSource('route')) {
    this.map.removeLayer('route');
    this.map.removeSource('route');
  }

  // Split pickup and dropoff locations into lat, lng arrays
  const pickup = this.pickupLocation.split(',').map(Number);
  const dropoff = this.dropoffLocation.split(',').map(Number);

  // Fetch route from Mapbox Directions API
  fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
    .then(response => response.json())
    .then(data => {
      const route = data.routes[0].geometry;

      // Add a new source and layer to the map for the route
      this.map.addSource('route', {
        'type': 'geojson',
        'data': route
      });

      this.map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#1db7dd',
          'line-width': 8
        }
      });
    })
    .catch(error => console.error('Error:', error));
}
