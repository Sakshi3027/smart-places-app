export function searchNearbyPlaces(filters, location) {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 2000,
      type: filters.type || "cafe",
      keyword: filters.keyword || "",
      openNow: filters.openNow || false,
    };

    if (filters.maxPrice) request.maxPriceLevel = filters.maxPrice;

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject("Location denied")
    );
  });
}