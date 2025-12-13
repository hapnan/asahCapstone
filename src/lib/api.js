// API configuration and utilitie

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Custom fetch wrapper that automatically includes credentials (cookies)
 * and handles common error cases
 */
export async function fetchWithCredentials(url, options = {}) {
  const defaultOptions = {
    credentials: "include", // Always include cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...options,
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  return response;
}

/**
 * API endpoints for authentication
 */
export const authAPI = {
  // Check current session
  checkSession: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/auth/session/check`, {
      method: "GET",
    });
  },

  // Login with passkey
  getLoginOptions: async (username) => {
    return fetchWithCredentials(
      `${API_BASE_URL}/auth/login/options?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
      },
    );
  },

  verifyLogin: async (authenticationResponse, username) => {
    return fetchWithCredentials(`${API_BASE_URL}/auth/login/verify`, {
      method: "POST",
      body: JSON.stringify({ authenticationResponse, username }),
    });
  },

  // Register with passkey
  getRegisterOptions: async (username, name) => {
    return fetchWithCredentials(
      `${API_BASE_URL}/auth/register/options?username=${encodeURIComponent(username)}&name=${encodeURIComponent(name)}`,
      {
        method: "GET",
      },
    );
  },

  verifyRegister: async (registrationResponse, username) => {
    return fetchWithCredentials(`${API_BASE_URL}/auth/register/verify`, {
      method: "POST",
      body: JSON.stringify({ registrationResponse, username }),
    });
  },

  // Logout
  logout: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    });
  },
};

export const customerAPI = {
  getAllCustomers: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/customers`, {
      method: "GET",
    });
  },

  getAllCustomersFull: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/customers/predict`, {
      method: "GET",
    });
  },

  getcustomerById: async (id) => {
    return fetchWithCredentials(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
    });
  },
};

export const predictionAPI = {
  getPrediction: async (customerData) => {
    return fetchWithCredentials(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: JSON.stringify({
        data: customerData,
      }),
    });
  },

  /**
   * Batch prediction with chunking to avoid payload size limits
   * @param {Array} customerData - Array of customer objects
   * @param {number} chunkSize - Number of customers per batch (default: 500)
   * @param {Function} onProgress - Callback for progress updates (current, total)
   * @returns {Promise<Array>} - Combined prediction results
   */
  getPredictionBatch: async (
    customerData,
    chunkSize = 500,
    onProgress = null,
  ) => {
    const chunks = [];

    // Split data into chunks
    for (let i = 0; i < customerData.length; i += chunkSize) {
      chunks.push(customerData.slice(i, i + chunkSize));
    }

    const allResults = [];

    // Process chunks sequentially to avoid overwhelming the server
    for (let i = 0; i < chunks.length; i++) {
      try {
        const currentChunk = chunks[i];

        // Log chunk info for debugging
        console.log(
          `Processing chunk ${i + 1}/${chunks.length} with ${currentChunk.length} customers`,
        );

        // Validate and sanitize chunk data
        const sanitizedChunk = currentChunk
          .map((customer, idx) => {
            // Check for invalid data that might cause 422
            if (!customer || typeof customer !== "object") {
              console.warn(
                `Chunk ${i + 1}, index ${idx}: Invalid customer object`,
                customer,
              );
              return null;
            }

            // Remove undefined/null values and sanitize
            const sanitized = {};
            for (const [key, value] of Object.entries(customer)) {
              if (value !== undefined && value !== null && value !== "") {
                // Handle NaN, Infinity, and other problematic values
                if (typeof value === "number" && !isFinite(value)) {
                  sanitized[key] = 0;
                } else {
                  sanitized[key] = value;
                }
              }
            }

            return Object.keys(sanitized).length > 0 ? sanitized : null;
          })
          .filter((customer) => customer !== null);

        if (sanitizedChunk.length === 0) {
          console.warn(
            `Chunk ${i + 1} has no valid customers after sanitization, skipping...`,
          );
          if (onProgress) {
            onProgress(i + 1, chunks.length);
          }
          continue;
        }

        const response = await fetchWithCredentials(`${API_BASE_URL}/predict`, {
          method: "POST",
          body: JSON.stringify({
            data: sanitizedChunk,
          }),
        });

        if (!response.ok) {
          // Capture detailed error information
          let errorDetails = `${response.status} ${response.statusText}`;
          try {
            const errorBody = await response.json();
            errorDetails += `: ${JSON.stringify(errorBody)}`;
            console.error(`Batch ${i + 1} error details:`, errorBody);

            // Log problematic data samples
            if (response.status === 422) {
              console.error(
                `Chunk ${i + 1} sample data (first 2 customers):`,
                JSON.stringify(sanitizedChunk.slice(0, 2), null, 2),
              );
            }
          } catch (e) {
            const errorText = await response.text();
            errorDetails += `: ${errorText}`;
            console.error(`Batch ${i + 1} error text:`, errorText);
          }

          throw new Error(`Batch ${i + 1} failed: ${errorDetails}`);
        }

        const result = await response.json();
        allResults.push(...(Array.isArray(result) ? result : [result]));

        // Report progress
        if (onProgress) {
          onProgress(i + 1, chunks.length);
        }
      } catch (error) {
        console.error(`Error processing chunk ${i + 1}:`, error);
        console.error(`Chunk ${i + 1} had ${chunks[i].length} customers`);
        throw error;
      }
    }

    return allResults;
  },
};

export const reportAPI = {
  getAllReports: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/analitics`, {
      method: "GET",
    });
  },

  getReportById: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/analitics/user`, {
      method: "GET",
    });
  },

  addReport: async (reportData) => {
    return fetchWithCredentials(`${API_BASE_URL}/analitics`, {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  },
};

/**
 * API endpoints for Twilio Voice
 */
export const voiceAPI = {
  // Get access token for Twilio Device
  getToken: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/voice/token`, {
      method: "GET",
    });
  },
};

export const userAPI = {
  getUser: async () => {
    return fetchWithCredentials(`${API_BASE_URL}/user`, {
      method: "GET",
    });
  },
};
