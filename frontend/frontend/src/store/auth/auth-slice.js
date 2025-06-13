export const createAuthSlice = (set, get) => ({
  userInfo: undefined,

  setUserInfo: (userInfo) => set({ userInfo }),

  fetchUserInfo: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Not logged in');

      const data = await res.json();

      // ✅ Retain existing token from state (from Zustand persist)
      const existingToken = get().userInfo?.token;

      set({ userInfo: { ...data, token: existingToken || null } });
    } catch (error) {
      set({ userInfo: null });
      console.error('Auto-login failed:', error.message);
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();

      // ✅ Save token from login response
      set({ userInfo: { ...data.user, token: data.token } });
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error.message);
    } finally {
      set({ userInfo: null });
    }
  },
});
