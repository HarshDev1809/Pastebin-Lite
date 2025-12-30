"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TTL_OPTIONS = [
  { value: 1, label: "1 second" },
  { value: 2, label: "2 seconds" },
  { value: 3, label: "3 seconds" },
  { value: 5, label: "5 seconds" },
  { value: 10, label: "10 seconds" },
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 45, label: "45 seconds" },
  { value: 60, label: "1 minute" },
  { value: 120, label: "2 minutes" },
  { value: 180, label: "3 minutes" },
  { value: 300, label: "5 minutes" },
  { value: 600, label: "10 minutes" },
  { value: 900, label: "15 minutes" },
  { value: 1800, label: "30 minutes" },
  { value: 2700, label: "45 minutes" },
  { value: 3600, label: "1 hour" },
  { value: 7200, label: "2 hours" },
  { value: 10800, label: "3 hours" },
  { value: 21600, label: "6 hours" },
  { value: 43200, label: "12 hours" },
  { value: 86400, label: "1 day" },
  { value: 172800, label: "2 days" },
  { value: 259200, label: "3 days" },
  { value: 604800, label: "1 week" },
  { value: 2592000, label: "30 days" },
];

export default function Home() {
  const [paste, setPaste] = useState("");
  const [ttl, setTtl] = useState("");
  // const [expiredAt, setExpiresAt] = useState(null)
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicLink, setPublicLink] = useState(null);
  const [copied, setCopied] = useState(false)
  const MIN_COL = 5;
  const MIN_ROW = 20;

  const handlePasteChange = (e) => {
    setPaste(e.target.value);
  };

  const handleTtlInputChange = (e) => {
    const { value } = e.target;

    if (value < 1) {
      toast.error("TTL can't be a less than 1 sec");
      setTtl("");
      return;
    }

    setTtl(value);
  };

  const handleMaxViewsChange = (e) => {
    const { value } = e.target;



    if(isNaN(parseInt(value))){
      toast.error("Max Views Can only be a positive number");
      setMaxViews("");
      return;
    }

    if (value < 1) {
      toast.error("Max Views Can't be less than 1");
      setMaxViews("");
      return;
    }
    setMaxViews(value);
  };

  const createLink = async () => {
    setLoading(true);
      if (!paste.trim()) {
    toast.error("Paste content is required!");
    return;
  }   
    try {
      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: paste,
          ttl_seconds: ttl,
          max_views: maxViews,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Failed to create paste");
        return;
      }
      const { id } = data;
      toast.success("Paste Saved Successfully.")

      setPublicLink(`${process.env.NEXT_PUBLIC_APP_URL}/p/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen min-w-screen bg-white p-2 flex flex-col gap-2">
      {/* <Navbar /> */}
      <main className="px-2 mt-2 flex flex-col gap-2 md:px-80">
        <div className="flex flex-col md:flex-row md:gap-2">
          <label htmlFor="paste-textarea" className="text-gray-800">
            New Paste:{" "}
          </label>
          <textarea
            id="paste-textarea"
            placeholder="Enter you Paste..."
            rows={MIN_ROW}
            cols={MIN_COL}
             className="border rounded bg-white text-gray-900 border-gray-300 p-2 md:grow font-semibold"
             style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '16px' }}
            onChange={handlePasteChange}
            value={paste}
            required
          ></textarea>
        </div>
        <div className="flex flex-col md:flex-row md:gap-2">
          <label className="text-gray-800 text-nowrap">
            Time To Live (TTL):
          </label>
          <div className="flex justify-center w-full flex-row gap-1 ">
            <div className="flex flex-col justify-start items-start grow w-1/2 min-w-1/2">
              {useCustomTime ? (
                <input
                  className="border text-gray-800 rounded p-2 w-full"
                  min={0}
                  placeholder="TTL in Seconds"
                  onChange={handleTtlInputChange}
                  type="number"
                  value={ttl}
                ></input>
              ) : (
                <select
                  name="ttl-options"
                  className="border grow p-2 text-gray-800 rounded w-full"
                  id="ttl-options"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                >
                  <option value={""}>Never expire (optional)</option>{" "}
                  {TTL_OPTIONS.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {" "}
                      {label}
                    </option>
                  ))}
                </select>
              )}
              <button
                className="text-blue-500  text-start flex "
                type="button"
                onClick={() => setUseCustomTime((prev) => !prev)}
              >
                {useCustomTime ? "Use Quick Options" : "Use Custom time"}
              </button>
            </div>
            <button
              className="border grow border-red-500 text-red-500 hover:bg-red-50 w-1/2 rounded min-w-1/2 cursor-pointer"
              type="button"
              onClick={() => setTtl("")}
            >
              Clear TTL
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:gap-2">
          <label className="text-nowrap text-gray-800">Max Views:</label>
          <div className="flex justify-center  w-full flex-row gap-1">
            <input
              className="border rounded text-gray-800 p-2 w-1/2"
              value={maxViews}
              type="number"
              placeholder="Max Views..."
              onChange={handleMaxViewsChange}
            ></input>
            <button
              className="border grow w-1/2 border-red-500 text-red-500 hover:bg-red-50 cursor-pointer  rounded"
              type="button"
              onClick={() => setMaxViews("")}
            >
              Clear Max Views
            </button>
          </div>
        </div>

        <button
          className="border rounded w-full p-2 bg-blue-500 cursor-pointer text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={createLink}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              Creating
              <span className="flex gap-0.5">
                <span className="animate-bounce delay-0">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </span>
            </span>
          ) : (
            "Create Public Link"
          )}
        </button>

        {publicLink && (
          <div className="border border-gray-300 rounded flex p-2 bg-gray-100 items-center">
            <div className="grow font-semibold text-gray-900" style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '16px' }}>{publicLink}</div>
            <button
              className={`border border-gray-300 rounded ${copied ? "bg-green-500 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-700"} text-white  cursor-pointer px-4 py-2 whitespace-nowrap`}
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(publicLink);
                  setCopied(true)
                  toast.success("Link copied!");
                } catch (err) {
                  setCopied(false)
                  toast.error("Failed to copy");
                  console.error(err);
                }
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
