import { useState } from "react";
import AutomatonGraph from "./AutomatonGraph";
import { compileBoth } from "./api";
import { Search, Cpu } from "lucide-react";

export default function App() {
  const [regex, setRegex] = useState("a(b|c)*");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==== Regular Expression Validation ==== //

  const validateRegex = (pattern) => {
    if (!pattern) {
      return "The Pattern cannot be empty";
    }

    // Check for balanced parenthesis.
    let balance = 0;

    for (let char of pattern) {
      if (char == "(") balance++;
      if (char == ")") balance--;

      if (balance < 0) return "Unbalanced Parenthsis extra closing bracket";
    }

    if (balance !== 0)
      return "Unbalanced Parenthesis: Missing closing parenthesis";

    // Checking for empty parenthesis.
    if (/\(\)/.test(pattern)) return "Empty Parenthesis are not allowed";

    // Invalid starting or ending parenthesis.
    if (/^[|*]/.test(pattern))
      return "Regex cannot start with an operator ('|' or '*').";

    if (/\|$/.test(pattern))
      return "Regex cannot start with an Alternation symbol";

    // Checking for invalid operator combinations

    if (/\|\|/.test(pattern)) return "Consecutive Alternation are not allowed";

    if (/\(\*/.test(pattern))
      return "Kleen star cannot be used directly into the ";

    if (/\(\|/.test(pattern))
      return "Aletration operator cannot be used directly followed by opening parenthesis.";

    if (/\|\)/.test(pattern))
      return "Aletration operator cannot be used directly after closing parenthesis. ";

    if (/\|\*/.test(pattern))
      return "Kleen star cannot be used directly after the aletration closure. ";

    if (/\*\*/.test(pattern)) return "Consecutive Kleen start are not allowed.";

    // When no error is found.
    return null;
  };

  const handleCompile = async (e) => {
    e.preventDefault();
    const cleanRegex = regex.trim();
    if (!cleanRegex) return;

    // ==== Running the Validation checks ==== //

    const validationError = validateRegex(cleanRegex);
    console.log(validationError)

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Connecting to the FastAPI backend; see src/api.js for the endpoint.
      const result = await compileBoth(cleanRegex);
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
              color: "#000000",
              background: "#ffffff",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
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
