const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

const authStorage = {
  setAccessToken(token) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      token
    );
  },

  getAccessToken() {
    return localStorage.getItem(
      ACCESS_TOKEN_KEY
    );
  },

  setRefreshToken(token) {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      token
    );
  },

  getRefreshToken() {
    return localStorage.getItem(
      REFRESH_TOKEN_KEY
    );
  },

  setUser(user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  },

  getUser() {
    const user = localStorage.getItem(
      USER_KEY
    );

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(
      ACCESS_TOKEN_KEY
    );

    localStorage.removeItem(
      REFRESH_TOKEN_KEY
    );

    localStorage.removeItem(
      USER_KEY
    );
  }
};

export default authStorage;