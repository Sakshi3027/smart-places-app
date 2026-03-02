import { formatDistance } from "../utils/haversine";

export default function PlaceCard({ place, index, userLocation, onAddToRoute, onSave }) {
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();
  const distance = userLocation
    ? formatDistance(
        Math.sqrt(
          Math.pow((lat - userLocation.lat) * 111, 2) +
          Math.pow((lng - userLocation.lng) * 111, 2)
        )
      )
    : null;

  const stars = "★".repeat(Math.round(place.rating || 0)) +
    "☆".repeat(5 - Math.round(place.rating || 0));

  const priceLabel = place.price_level
    ? "$".repeat(place.price_level)
    : null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-indigo-500 transition cursor-pointer">
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-3">
          <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div>
            <h3 className="font-semibold text-white text-sm">{place.name}</h3>
            <p className="text-gray-400 text-xs mt-0.5">{place.vicinity}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400 text-xs">{stars}</span>
              {place.rating && (
                <span className="text-gray-400 text-xs">{place.rating}</span>
              )}
              {priceLabel && (
                <span className="text-green-400 text-xs">{priceLabel}</span>
              )}
              {distance && (
                <span className="text-indigo-400 text-xs">📍 {distance}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              place.opening_hours?.isOpen()
                ? "bg-green-900 text-green-400"
                : "bg-red-900 text-red-400"
            }`}
          >
            {place.opening_hours?.isOpen() ? "Open" : "Closed"}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onSave(place)}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition"
        >
          🔖 Save
        </button>
        <button
          onClick={() => onAddToRoute(place)}
          className="text-xs bg-indigo-900 hover:bg-indigo-800 text-indigo-300 px-3 py-1 rounded-full transition"
        >
          🗺 Add to route
        </button>
      </div>
    </div>
  );
}