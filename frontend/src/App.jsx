import React, { useState } from "react";
import AutomatonGraph from "./AutomatonGraph";
import { Search, Cpu } from "lucide-react";

export default function App() {
  const [regex, setRegex] = useState("a(b|c)*");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompile = async (e) => {
    e.preventDefault();
    if (!regex.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Connecting to your running FastAPI backend query parameter endpoint
      const response = await fetch(
        `http://127.0.0.1:8000/compile/both?regex=${encodeURIComponent(regex)}`,
      );

      if (!response.ok) {
        const errDetail = await response.json();
        throw new Error(errDetail.detail || "Failed to parse regex");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}>
      {/* Top Navbar Dashboard Control Unit */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#1e293b",
          color: "#ffffff",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Cpu color="#3b82f6" />
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
            Automata Engine Visualizer
          </h2>
        </div>

        <form onSubmit={handleCompile} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            placeholder="Enter Regex (e.g. a(b|c)* )"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              width: "250px",
              fontSize: "1rem",
              color: "#ffffff",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "#white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}>
            <Search size={16} /> {loading ? "Compiling..." : "Compile"}
          </button>
        </form>
      </header>

      {/* Main Dashboard Interactive Split Windows */}
      <main
        style={{
          flex: 1,
          display: "flex",
          padding: "20px",
          gap: "20px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
        {error && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              left: "20px",
              right: "20px",
              padding: "12px",
              background: "#fef2f2",
              border: "1px solid #ef4444",
              color: "#b91c1c",
              borderRadius: "6px",
              fontWeight: "bold",
              zIndex: 10,
            }}>
            Error: {error}
          </div>
        )}

        {data ? (
          <>
            <div style={{ flex: 1, height: "100%" }}>
              <AutomatonGraph
                graphData={data.nfa}
                type="Nondeterministic (NFA)"
              />
            </div>
            <div style={{ flex: 1, height: "100%" }}>
              <AutomatonGraph graphData={data.dfa} type="Deterministic (DFA)" />
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              flexDirection: "column",
            }}>
            <p style={{ fontSize: "1.2rem" }}>
              Enter a regex pattern up top and click Compile to compute the
              graph architectures.
            </p>
            {data === null && !loading && (
              <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                Postfix expression and extracted alphabets will process
                instantly.
              </span>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
