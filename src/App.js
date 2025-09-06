import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shorts, setShorts] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'error' or 'success'

  useEffect(() => {
    const stored = localStorage.getItem("shorts");
    if (stored) {
      setShorts(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shorts", JSON.stringify(shorts));
  }, [shorts]);

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  function mkShort() {
    if (!url.trim()) {
      setMsgType("error");
      setMsg("Please enter a URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setMsgType("error");
      setMsg("Invalid URL format.");
      return;
    }

    const shortcode = Math.random().toString(36).substring(2, 7);
    const newEntry = {
      full: url,
      short: shortcode,
      clk: 0,
      crt: new Date().toLocaleString(),
    };

    setShorts((prev) => [...prev, newEntry]);
    setUrl("");
    setMsgType("success");
    setMsg("URL shortened successfully.");
  }

  function openShort(shortcode) {
    const updated = shorts.map((entry) => {
      if (entry.short === shortcode) {
        entry.clk += 1;
        window.open(entry.full, "_blank");
      }
      return entry;
    });

    setShorts(updated);
  }

  return (
    <div className="container">
      <h2>🔗 URL Shortener</h2>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a valid URL (https://...)"
      />
      <button onClick={mkShort}>Shorten</button>

      {msg && <p className={`message ${msgType}`}>{msg}</p>}

      <h3>📄 Shortened URLs</h3>
      {shorts.length === 0 ? (
        <p>No URLs yet.</p>
      ) : (
        <ul>
          {shorts.map((entry, i) => (
            <li key={i}>
              <div>
                {entry.full} 👉{" "}
                <button
                  onClick={() => openShort(entry.short)}
                  className="short-btn"
                  aria-label={`Open short URL ${entry.short}`}
                >
                  /{entry.short}
                </button>
                <span className="stats">
                  | Clicks: {entry.clk} | Created: {entry.crt}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
