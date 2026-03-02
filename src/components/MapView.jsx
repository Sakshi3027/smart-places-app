import { useEffect, useRef } from "react";

export default function MapView({ center, places, selectedPlace, onSelectPlace }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

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

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl" />
  );
}