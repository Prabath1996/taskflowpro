export const SessionManager = {
  // Store user session data
  setUserSession: (userData) => {
    localStorage.setItem(
      "userSession",
      JSON.stringify({
        ...userData,
        loginTime: new Date().toISOString(),
        isLoggedIn: true,
      })
    );
  },

  // Get user session data
  getUserSession: () => {
    const session = localStorage.getItem("userSession");
    return session ? JSON.parse(session) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const session = SessionManager.getUserSession();
    const token = localStorage.getItem("authToken");
    return !!(session && session.isLoggedIn && token);
  },

  // Clear user session (logout)
  clearSession: () => {
    localStorage.removeItem("userSession");
    localStorage.removeItem("authToken");
  },

  // Get current user info
  getCurrentUser: () => {
    const session = SessionManager.getUserSession();
    return session
      ? {
          email: session.email,
          name: session.name || session.email.split("@")[0],
          loginTime: session.loginTime,
          token: session.token,
        }
      : null;
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },
};
