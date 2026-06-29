// Determine if we are running locally or in production
const IS_DEVELOPMENT = import.meta.env.DEV;

// In development, target the local Uvicorn port (usually 8000)
// In production, use a relative path because Vercel proxies it automatically
export const API_BASE_URL = IS_DEVELOPMENT 
  ? 'http://localhost:8000' 
  : ''; 

/**
 * Example helper function for compiling regex strings
 */
export async function compileRegex(pattern) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pattern }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}