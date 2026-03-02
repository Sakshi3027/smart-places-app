import { useEffect, useState } from "react";
import { loadGoogleMaps } from "./utils/loadGoogleMaps";
import { getUserLocation, searchNearbyPlaces } from "./hooks/usePlaces";
import SearchBar from "./components/SearchBar";
import MapView from "./components/MapView";
import PlaceCard from "./components/PlaceCard";

function App() {
  const [mapsReady, setMapsReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vibeLabel, setVibeLabel] = useState("");
  const [route, setRoute] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState(() => {
    const stored = localStorage.getItem("savedPlaces");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    loadGoogleMaps().then(() => {
      setMapsReady(true);
      getUserLocation()
        .then(setUserLocation)
        .catch(() => setUserLocation({ lat: 40.7128, lng: -74.006 }));
    });
  }, []);

  async function handleSearch(filters, rawInput) {
    if (!userLocation) return;
    setLoading(true);
    setVibeLabel(rawInput);
    try {
      const results = await searchNearbyPlaces(filters, userLocation);
      setPlaces(results.slice(0, 8));
    } catch (err) {
      console.error("Places error:", err);
    }
    setLoading(false);
  }

  function handleSave(place) {
    const updated = [place, ...savedPlaces.filter((p) => p.place_id !== place.place_id)];
    setSavedPlaces(updated);
    localStorage.setItem("savedPlaces", JSON.stringify(updated));
  }

  function handleAddToRoute(place) {
    if (route.find((p) => p.place_id === place.place_id)) return;
    setRoute([...route, place]);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="p-4 border-b border-gray-800 text-center">
        <h1 className="text-2xl font-bold text-indigo-400">📍 Smart Places</h1>
        <p className="text-gray-400 text-xs mt-0.5">Find the perfect spot for any vibe</p>
      </header>

      <div className="p-4 border-b border-gray-800 flex justify-center">
        {mapsReady ? (
          <SearchBar onSearch={handleSearch} loading={loading} />
        ) : (
          <p className="text-yellow-400 text-sm">Loading maps...</p>
        )}
      </div>

      {route.length > 0 && (
        <div className="px-4 py-2 bg-indigo-950 border-b border-indigo-800 flex items-center gap-2 flex-wrap">
          <span className="text-indigo-400 text-xs font-semibold">🗺 Route:</span>
          {route.map((p, i) => (
            <span key={p.place_id} className="text-xs bg-indigo-800 text-white px-2 py-0.5 rounded-full">
              {i + 1}. {p.name}
            </span>
          ))}
          <button onClick={() => setRoute([])} className="text-xs text-red-400 hover:text-red-300 ml-auto">
            Clear
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
        {/* Left panel */}
        <div className="w-full md:w-96 flex flex-col border-r border-gray-800 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-indigo-400 animate-pulse">
              🔍 Finding places for "{vibeLabel}"...
            </div>
          )}
          {!loading && places.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">
              <p className="text-4xl mb-3">🗺</p>
              <p>Search for a vibe to discover nearby places</p>
            </div>
          )}
          {!loading && places.length > 0 && (
            <div className="p-3 flex flex-col gap-3">
              <p className="text-xs text-gray-400">
                Found <span className="text-indigo-400 font-semibold">{places.length} places</span> for "{vibeLabel}"
              </p>
              {places.map((place, i) => (
                <PlaceCard
                  key={place.place_id}
                  place={place}
                  index={i}
                  userLocation={userLocation}
                  onSave={handleSave}
                  onAddToRoute={handleAddToRoute}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="hidden md:flex flex-1 p-3">
          {mapsReady && userLocation ? (
            <MapView
              center={userLocation}
              places={places}
              onSelectPlace={() => {}}
            />
          ) : (
            <div className="flex-1 bg-gray-900 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Map loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;