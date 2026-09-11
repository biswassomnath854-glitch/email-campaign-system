import api from "./api";
import authStorage from "../utils/authStorage";

const login = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  const data = response.data?.data;

  if (data?.accessToken) {
    authStorage.setAccessToken(
      data.accessToken
    );
  }

  if (data?.refreshToken) {
    authStorage.setRefreshToken(
      data.refreshToken
    );
  }

  if (data?.user) {
    authStorage.setUser(data.user);
  }

  return response.data;
};

const refreshAccessToken = async () => {
  const refreshToken =
    authStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error(
      "Refresh token not found"
    );
  }

  const response = await api.post(
    "/auth/refresh",
    {
      refreshToken
    }
  );

  const newAccessToken =
    response.data?.data?.accessToken;

  if (!newAccessToken) {
    throw new Error(
      "Access token was not returned"
    );
  }

  authStorage.setAccessToken(
    newAccessToken
  );

  return newAccessToken;
};

const logout = async () => {
  const refreshToken =
    authStorage.getRefreshToken();

  try {
    if (refreshToken) {
      await api.post(
        "/auth/logout",
        {
          refreshToken
        }
      );
    }
  } finally {
    authStorage.clear();
  };
};

const getCurrentUser = () => {
  return authStorage.getUser();
};

const isAuthenticated = () => {
  return Boolean(
    authStorage.getAccessToken()
  );
};

const authService = {
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService;