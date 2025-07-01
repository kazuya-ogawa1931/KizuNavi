import React, { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navigation from "./Navigation";
import Header from "./Header";
import { THEME_COLORS } from "../types";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Different layout handling based on user role
  const isOnlyMember = user?.role === "member";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: THEME_COLORS.background }}
    >
      {/* Fixed Header */}
      <Header onMenuToggle={handleMenuToggle} />

      {/* Navigation - Only show for non-member users or if member has survey access */}
      {!isOnlyMember && (
        <Navigation isOpen={mobileMenuOpen} onClose={handleMenuClose} />
      )}

      {/* Main Content */}
      <main
        className={`pt-16 ${!isOnlyMember ? "pb-20 lg:pb-6 lg:ml-64" : "pb-6"}`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

      {/* Role-specific overlay for restricted access */}
      {isOnlyMember && window.location.pathname !== "/survey-response" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 m-4 max-w-md text-center"
            style={{ borderColor: THEME_COLORS.border, borderWidth: "1px" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${THEME_COLORS.accent}20` }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: THEME_COLORS.accent }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              アクセス制限
            </h3>
            <p className="text-gray-600 mb-4">
              この画面を表示する権限がありません。
              <br />
              メンバー権限ではアンケート回答のみ利用可能です。
            </p>
            <button
              onClick={() => navigate("/survey-response")}
              className="w-full text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: THEME_COLORS.accent }}
            >
              アンケート回答画面へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
