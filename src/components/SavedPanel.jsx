export default function SavedPanel({ savedPlaces, onClear }) {
  if (savedPlaces.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        <p className="text-4xl mb-3">🔖</p>
        <p>No saved places yet</p>
        <p className="text-xs mt-1">Hit "Save" on any place card</p>
      </div>
    );
  }

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">
          <span className="text-indigo-400 font-semibold">{savedPlaces.length} saved places</span>
        </p>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 transition"
        >
          Clear all
        </button>
      </div>
      {savedPlaces.map((place, i) => (
        <div key={place.place_id || i} className="bg-gray-800 border border-gray-700 rounded-xl p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white text-sm">{place.name}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{place.vicinity}</p>
              <div className="flex items-center gap-2 mt-1">
                {place.rating && (
                  <span className="text-yellow-400 text-xs">★ {place.rating}</span>
                )}
                {place.price_level && (
                  <span className="text-green-400 text-xs">{"$".repeat(place.price_level)}</span>
                )}
              </div>
            </div>
            <span className="text-2xl">🔖</span>
          </div>
        </div>
      ))}
    </div>
  );
}