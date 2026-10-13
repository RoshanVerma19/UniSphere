
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  initialStudentData,
  initialFacultyData,
} from '../data/mockData';

const AuthContext = createContext(null);

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080'
).replace(/\/+$/, '');

const USER_KEY = 'unisphere_user';
const ACCESS_KEY = 'unisphere_access_token';
const REFRESH_KEY = 'unisphere_refresh_token';

const readStoredUser = () => {
  try {
    const accessToken = localStorage.getItem(ACCESS_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    // Do not restore old mock-only sessions.
    if (!accessToken || !savedUser) return null;

    return JSON.parse(savedUser);
  } catch {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot connect to UniSphere backend at ${API_BASE_URL}. Check that the backend is running.`
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    const detail =
      result.detail ||
      result.error?.message ||
      (typeof result.error === 'string' ? result.error : null) ||
      'Request failed. Please try again.';

    throw new Error(
      typeof detail === 'string' ? detail : 'Request failed.'
    );
  }

  return result.data ?? result;
}

function makeDashboardUser(role, backendUser, accessToken) {
  // Keep existing dashboard sample content until real profile and
  // academic-data endpoints are connected.
  const demo =
    role === 'student' ? initialStudentData : initialFacultyData;

  const nameFromEmail = backendUser.email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return {
    ...demo,
    name: nameFromEmail,
    email: backendUser.email,
    role: backendUser.role,
    token: accessToken,
    backendUserId: backendUser.id,
    timezone: backendUser.timezone,
    isActive: backendUser.is_active,
    lastLogin: new Date().toISOString(),
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [selectedPortal, setSelectedPortal] = useState('student');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const accessToken = localStorage.getItem(ACCESS_KEY);

      if (!accessToken) {
        clearSession();
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const backendUser = await apiRequest('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (cancelled) return;

        if (
          backendUser.role !== 'student' &&
          backendUser.role !== 'faculty'
        ) {
          throw new Error('Unsupported account role.');
        }

        const restoredUser = makeDashboardUser(
          backendUser.role,
          backendUser,
          accessToken
        );

        localStorage.setItem(USER_KEY, JSON.stringify(restoredUser));
        setUser(restoredUser);
        setSelectedPortal(backendUser.role);
      } catch {
        if (!cancelled) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (role, identifier, password) => {
    setIsLoading(true);

    try {
      if (role !== 'student' && role !== 'faculty') {
        throw new Error('Please select a valid portal.');
      }

      const email = identifier.trim().toLowerCase();

      if (!email.includes('@')) {
        throw new Error(
          'Please use your registered email address. Student ID and Faculty ID login are not supported by the backend yet.'
        );
      }

      const data = await apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          portal: role,
        }),
      });

      const tokens = data.tokens ?? data;

      if (!tokens.access_token || !tokens.refresh_token) {
        throw new Error('The server did not return valid login tokens.');
      }

      if (tokens.role !== role) {
        throw new Error('The account role does not match the selected portal.');
      }

      // Verify the access token and obtain the real backend user.
      const backendUser = await apiRequest('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (backendUser.role !== role) {
        throw new Error('The server returned an unexpected account role.');
      }

      localStorage.setItem(ACCESS_KEY, tokens.access_token);
      localStorage.setItem(REFRESH_KEY, tokens.refresh_token);

      const authUser = makeDashboardUser(
        role,
        backendUser,
        tokens.access_token
      );

      localStorage.setItem(USER_KEY, JSON.stringify(authUser));

      setUser(authUser);
      setSelectedPortal(role);

      return {
        success: true,
        user: authUser,
      };
    } catch (error) {
      clearSession();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);

    // Clear the local session immediately.
    clearSession();
    setUser(null);
    setSelectedPortal('student');

    // Revoke the refresh token on the backend.
    if (refreshToken) {
      apiRequest('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      }).catch(() => {
        // Local logout remains complete even if the server is offline.
      });
    }
  };

  // Switching portals must not grant another role.
  const switchRole = (newRole) => {
    if (newRole === 'student' || newRole === 'faculty') {
      setSelectedPortal(newRole);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        selectedPortal,
        setSelectedPortal,
        login,
        logout,
        switchRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
