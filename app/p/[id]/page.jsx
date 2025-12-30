"use client";

import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ViewPaste({ params }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [pastes, setPastes] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [expiresAtEpoch, setExpiresAtEpoch] = useState(null);
  const [viewsRemaining, setViewsRemaining] = useState(null);
  const [remainingSec, setRemainingSec] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatTime = (seconds) => {
    if (seconds === null) return "-";
    if (seconds <= 0) return "00:00:00 (Expired)";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  };

  const fetchData = async (id) => {
    try {
      const res = await fetch(`/api/pastes/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        toast.error(data.error || "Failed to fetch Paste");
        return;
      }

      setPastes(data.content);
      setExpiresAt(data.expired_at);
      setExpiresAtEpoch(data.expires_at_epoch);
      setViewsRemaining(data.remaining_views);

      if (data.expires_at_epoch) {
        const expiryTime = data.expires_at_epoch;
        const now = Date.now();
        const diffInSeconds = Math.floor((expiryTime - now) / 1000);
        setRemainingSec(diffInSeconds > 0 ? diffInSeconds : 0);
        // setRemainingSec(Number(data.expiresAtEpoch) - Date.now());
      }

      toast.success(`Paste fetched successfully`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (remainingSec === 0) setError("Paste Expired");
    if (remainingSec !== null && remainingSec > 0) {
      const interval = setInterval(() => {
        setRemainingSec((prev) => Number(prev) - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingSec]);

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pastes);
      setCopied(true);
      toast.success("Paste copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
      console.error(err);
    }
  };
  return (
    <div className="py-2 w-screen bg-white flex justify-center">
      {loading ? (
        <div className="text-center text-gray-900 max-w-md min-h-[80vh] pt-10">
          <span className="flex items-center justify-center gap-1">
            Loading
            <span className="flex gap-0.5">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
          </span>
        </div>
      ) : error ? (
        <div className="text-center max-w-md min-h-[80vh] pt-10">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-2">Paste not found</p>
          <p className="text-sm text-gray-500 mb-8">{error}</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Create New Paste
          </a>
        </div>
      ) : (
        <div className="px-2 flex flex-col gap-2 w-full md:w-1/2 text-gray-900">
          <div className="flex flex-col w-full gap-2 flex-wrap">
            <div>
              <label>Paste : </label>
              <input
                type="text"
                value={id}
                className="border px-2 rounded border-gray-300"
                disabled
              />
            </div>
            <div>
              <label>Expires In : </label>
              <input
                type="text"
                value={formatTime(remainingSec)}
                className="border px-2 rounded border-gray-300"
                disabled
              />
            </div>
            <div>
              <label>Views Remaining : </label>
              <input
                type="text"
                value={viewsRemaining ?? "-"}
                className="border px-2 rounded border-gray-300"
                disabled
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 w-full">
            <label className="font-medium text-gray-700">Paste Content:</label>
            <button
              className={`px-4 py-2 rounded font-medium transition-colors ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="border-2 rounded min-h-[50vh] w-full p-2 border-gray-300">
            <textarea
              value={pastes}
              cols={50}
              rows={20}
              className="w-full font-semibold grow"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "16px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
