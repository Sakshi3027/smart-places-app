import { useEffect, useState } from "react";
import { loadGoogleMaps } from "./utils/loadGoogleMaps";
import { getUserLocation, searchNearbyPlaces } from "./hooks/usePlaces";
import SearchBar from "./components/SearchBar";
import MapView from "./components/MapView";
import PlaceCard from "./components/PlaceCard";
import SavedPanel from "./components/SavedPanel";

function App() {
  const [mapsReady, setMapsReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vibeLabel, setVibeLabel] = useState("");
  const [route, setRoute] = useState([]);
  const [activeTab, setActiveTab] = useState("results");
  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedPlaces") || "[]");
    } catch { return []; }
  });
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    loadGoogleMaps().then(() => {
      setMapsReady(true);
      getUserLocation()
        .then(setUserLocation)
        .catch(() => setUserLocation({ lat: 40.7128, lng: -74.006 }));
    });

    // Load shared vibe from URL
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("vibe");
    if (shared) {
      try {
        const decoded = JSON.parse(atob(shared));
        setVibeLabel(decoded.vibe || "");
      } catch {}
    }
  }, []);

  async function handleSearch(filters, rawInput) {
    if (!userLocation) return;
    setLoading(true);
    setVibeLabel(rawInput);
    setActiveTab("results");
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

  function handleShare() {
    const data = btoa(JSON.stringify({
      vibe: vibeLabel,
      places: places.map((p) => ({ name: p.name, vicinity: p.vicinity })),
    }));
    const url = `${window.location.origin}?vibe=${data}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    setActiveTab("share");
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
          {route.length >= 2 && (
            <span className="text-xs text-green-400 ml-1">🚶 Route ready!</span>
          )}
          <button onClick={() => setRoute([])} className="text-xs text-red-400 hover:text-red-300 ml-auto">
            Clear
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
        {/* Left panel */}
        <div className="w-full md:w-96 flex flex-col border-r border-gray-800">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {["results", "saved", "share"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold capitalize transition ${
                  activeTab === tab
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "results" ? `🔍 Results ${places.length > 0 ? `(${places.length})` : ""}` : ""}
                {tab === "saved" ? `🔖 Saved ${savedPlaces.length > 0 ? `(${savedPlaces.length})` : ""}` : ""}
                {tab === "share" ? "🔗 Share" : ""}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-1">
            {/* Results tab */}
            {activeTab === "results" && (
              <>
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
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400">
                        Found <span className="text-indigo-400 font-semibold">{places.length} places</span> for "{vibeLabel}"
                      </p>
                      <button
                        onClick={handleShare}
                        className="text-xs bg-indigo-900 hover:bg-indigo-800 text-indigo-300 px-3 py-1 rounded-full transition"
                      >
                        🔗 Share this vibe
                      </button>
                    </div>
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
              </>
            )}

            {/* Saved tab */}
            {activeTab === "saved" && (
              <SavedPanel
                savedPlaces={savedPlaces}
                onClear={() => {
                  setSavedPlaces([]);
                  localStorage.removeItem("savedPlaces");
                }}
              />
            )}

            {/* Share tab */}
            {activeTab === "share" && (
              <div className="p-4 flex flex-col gap-4">
                <div className="text-center">
                  <p className="text-4xl mb-2">🔗</p>
                  <p className="text-white font-semibold">Share this vibe!</p>
                  <p className="text-gray-400 text-xs mt-1">Anyone with this link sees your search</p>
                </div>
                {shareUrl ? (
                  <div className="flex flex-col gap-2">
                    <div className="bg-gray-800 rounded-xl p-3 break-all text-xs text-indigo-300">
                      {shareUrl}
                    </div>
                    <div className="bg-green-900 border border-green-700 rounded-xl p-3 text-center">
                      <p className="text-green-400 text-xs font-semibold">✅ Copied to clipboard!</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Copy again
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    <p>Search for a vibe first, then click</p>
                    <p className="text-indigo-400">"🔗 Share this vibe"</p>
                    <p>in the results panel</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="hidden md:flex flex-1 p-3">
          {mapsReady && userLocation ? (
            <MapView
              center={userLocation}
              places={places}
              onSelectPlace={() => {}}
              route={route}
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