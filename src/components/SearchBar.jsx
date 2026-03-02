import { useState } from "react";
import { parseVibe } from "../hooks/useVibe";

const SUGGESTIONS = [
  "quiet cafe with wifi to work",
  "romantic dinner spot tonight",
  "cheap and quick lunch nearby",
  "fun place for a date",
  "park or chill outdoor spot",
];

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);

  async function handleSearch() {
    if (!input.trim()) return;
    setParsing(true);
    try {
      const filters = await parseVibe(input);
      onSearch(filters, input);
    } catch (err) {
      console.error("Claude parse error:", err);
    }
    setParsing(false);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Describe your vibe... e.g. quiet cafe to read"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
        />
        <button
          onClick={handleSearch}
          disabled={parsing || loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
        >
          {parsing ? "Thinking..." : "Find"}
        </button>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mt-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1 rounded-full text-gray-400 hover:text-white transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}