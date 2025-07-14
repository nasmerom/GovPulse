// utils/fetchWithError.js

export async function fetchWithError(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let message = `Request failed: ${response.status}`;
      try {
        const data = await response.json();
        if (data && data.error) message = data.error;
      } catch {}
      throw new Error(message);
    }
    return response;
  } catch (error) {
    // Network or other error
    throw new Error(error.message || 'Network error');
  }
} 