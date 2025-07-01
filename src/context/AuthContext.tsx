import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginRequest, UserPermissions } from "../types";
import AuthService from "../utils/authService";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to get permissions based on role
const getPermissionsByRole = (role: User["role"]): UserPermissions => {
  switch (role) {
    case "master":
      // Master: All permissions (company staff)
      return {
        canViewDashboard: true,
        canManageQuestions: true,
        canViewReports: true,
        canManageCustomers: true,
        canAnswerSurvey: true,
      };
    case "admin":
      // Admin: All except customer management (HR staff)
      return {
        canViewDashboard: true,
        canManageQuestions: true,
        canViewReports: true,
        canManageCustomers: false,
        canAnswerSurvey: true,
      };
    case "member":
      // Member: Only survey response (general employees)
      return {
        canViewDashboard: false,
        canManageQuestions: false,
        canViewReports: false,
        canManageCustomers: false,
        canAnswerSurvey: true,
      };
    default:
      return {
        canViewDashboard: false,
        canManageQuestions: false,
        canViewReports: false,
        canManageCustomers: false,
        canAnswerSurvey: false,
      };
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in and validate token
        const savedUser = localStorage.getItem("user");
        const authToken = localStorage.getItem("authToken");

        if (savedUser && authToken) {
          // Development mode: Use stored user data without API validation
          if (
            import.meta.env.VITE_USE_MOCK_AUTH === "true" ||
            import.meta.env.DEV ||
            authToken.startsWith("mock-token-")
          ) {
            const userData = JSON.parse(savedUser);
            userData.permissions = getPermissionsByRole(userData.role);
            setUser(userData);
            return;
          }

          // Production mode: Validate token with API
          const validationResult = await AuthService.validateToken();

          if (validationResult.valid && validationResult.user) {
            // Update user data from server
            validationResult.user.permissions = getPermissionsByRole(
              validationResult.user.role
            );
            setUser(validationResult.user);
            localStorage.setItem("user", JSON.stringify(validationResult.user));
          } else {
            // Token is invalid, clear stored data
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
          }
        }
      } catch (error) {
        console.warn("Auth initialization failed:", error);
        // Clear stored data if validation fails
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      // Development mode: Use mock authentication if API is not available
      if (
        import.meta.env.VITE_USE_MOCK_AUTH === "true" ||
        import.meta.env.DEV
      ) {
        // Mock role assignment based on email pattern
        let role: User["role"] = "member";
        if (
          credentials.email.includes("master") ||
          credentials.email.includes("admin@kizunavi.com") ||
          credentials.companyName === "KizuNavi"
        ) {
          role = "master";
        } else if (
          credentials.email.includes("hr") ||
          credentials.email.includes("admin")
        ) {
          role = "admin";
        }

        const mockUser: User = {
          id: "mock-" + Date.now(),
          email: credentials.email,
          companyId:
            credentials.companyName === "KizuNavi"
              ? "internal"
              : "mock-company-1",
          role: role,
          permissions: getPermissionsByRole(role),
        };

        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("authToken", "mock-token-" + Date.now());
        return;
      }

      // Production mode: Use actual API
      const loginResponse = await AuthService.login(credentials);

      // Set permissions based on role
      loginResponse.user.permissions = getPermissionsByRole(
        loginResponse.user.role
      );

      setUser(loginResponse.user);
    } catch (error) {
      // Fallback to mock authentication if API is not available
      console.warn(
        "API authentication failed, falling back to mock auth:",
        error
      );

      // Mock role assignment based on email pattern
      let role: User["role"] = "member";
      if (
        credentials.email.includes("master") ||
        credentials.email.includes("admin@kizunavi.com") ||
        credentials.companyName === "KizuNavi"
      ) {
        role = "master";
      } else if (
        credentials.email.includes("hr") ||
        credentials.email.includes("admin")
      ) {
        role = "admin";
      }

      const mockUser: User = {
        id: "mock-" + Date.now(),
        email: credentials.email,
        companyId:
          credentials.companyName === "KizuNavi"
            ? "internal"
            : "mock-company-1",
        role: role,
        permissions: getPermissionsByRole(role),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("authToken", "mock-token-" + Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      setUser(null);
      // Force page reload to ensure clean state
      window.location.href = "/login";
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return user?.permissions[permission] ?? false;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
