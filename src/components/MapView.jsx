import { useEffect, useRef } from "react";

export default function MapView({ center, places, onSelectPlace, route = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRendererRef = useRef(null);

  useEffect(() => {
    if (!center || !mapRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e3a5f" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c1a2e" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#334155" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#162032" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0d2137" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#162032" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1e3a5f" }] },
        { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
        ],
    });

    // User location marker
    new window.google.maps.Marker({
      position: center,
      map: mapInstanceRef.current,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#6366f1",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
      },
      title: "You are here",
    });
  }, [center]);

  useEffect(() => {
    if (!mapInstanceRef.current || !places.length) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    places.forEach((place, i) => {
      const marker = new window.google.maps.Marker({
        position: place.geometry.location,
        map: mapInstanceRef.current,
        title: place.name,
        label: {
          text: String(i + 1),
          color: "white",
          fontWeight: "bold",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 18,
          fillColor: "#6366f1",
          fillOpacity: 0.9,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => onSelectPlace(place));
      markersRef.current.push(marker);
    });

    if (places[0]) {
      mapInstanceRef.current.panTo(places[0].geometry.location);
    }
  }, [places]);

  useEffect(() => {
  if (!mapInstanceRef.current) return;

  if (routeRendererRef.current) {
    routeRendererRef.current.setMap(null);
  }

  if (route.length < 2) return;

  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer({
    map: mapInstanceRef.current,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "#6366f1",
      strokeWeight: 4,
      strokeOpacity: 0.8,
    },
  });

  routeRendererRef.current = directionsRenderer;

  const waypoints = route.slice(1, -1).map((p) => ({
    location: p.geometry.location,
    stopover: true,
  }));

  directionsService.route(
    {
      origin: route[0].geometry.location,
      destination: route[route.length - 1].geometry.location,
      waypoints,
      travelMode: window.google.maps.TravelMode.WALKING,
      optimizeWaypoints: true,
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      }
    }
  );
}, [route]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl" />
  );
}