// API configuration and utilitie
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
      }
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
      }
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
  getcustomerById: async (id) => {
    return fetchWithCredentials(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
    });
  },
};
