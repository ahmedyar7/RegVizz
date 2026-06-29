// Determine if we are running locally or in production
const IS_DEVELOPMENT = import.meta.env.DEV;

// In development, target the local Uvicorn server (port 8000).
// In production, use a relative path because Vercel proxies /api to the backend.
export const API_BASE_URL = IS_DEVELOPMENT ? "http://127.0.0.1:8000" : "";

/**
 * Compiles a regular expression into both its NFA and DFA graph
 * representations in a single request.
 *
 * @param {string} pattern - The regular expression to compile.
 * @returns {Promise<{regex: string, postfix: string, nfa: object, dfa: object}>}
 */
export async function compileBoth(pattern) {
  const response = await fetch(
    `${API_BASE_URL}/api/compile/both?regex=${encodeURIComponent(pattern)}`,
  );

  if (!response.ok) {
    let detail = "Failed to parse regex";
    try {
      const errBody = await response.json();
      detail = errBody.detail || detail;
    } catch {
      // Response had no JSON body; fall back to the default message.
    }
    throw new Error(detail);
  }

  return response.json();
}
