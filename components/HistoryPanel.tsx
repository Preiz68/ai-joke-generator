"use client";


interface HistoryPanelProps {
  history: string[];
}

export default function HistoryPanel({ history }: HistoryPanelProps) {
  return (
    <div>
      <h4 className="font-semibold mb-2">History</h4>
      {history.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {history.map((h, i) => (
            <div key={i} className="p-2 truncate">
              {h}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No Jokes yet.</div>
      )}
    </div>
  );
}
