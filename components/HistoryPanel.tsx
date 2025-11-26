"use client";

import { jokeStore } from "../store/useStore";

export default function HistoryPanel({ searchTerm }: { searchTerm: string }) {
  const { history, setJoke } = jokeStore();

  const filteredHistory = history.filter((item) =>
    item.joke.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full overflow-y-auto">
      <h4 className="font-semibold mb-2">History</h4>
      {filteredHistory.length > 0 ? (
        <div className="flex flex-col gap-1">
          {filteredHistory.map((h, i) => (
            <div
              key={i}
              onClick={() => setJoke(h.joke)}
              className="p-2 truncate cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {h.joke}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No Jokes yet.</div>
      )}
    </div>
  );
}
