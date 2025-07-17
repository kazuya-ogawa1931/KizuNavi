import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { THEME_COLORS } from "../types";

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  permission:
    | "canViewDashboard"
    | "canManageQuestions"
    | "canViewReports"
    | "canManageCustomers"
    | "canAnswerSurvey";
  color: string;
  bgColor: string;
  subItems?: { name: string; href: string }[];
}

interface NavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navigationItems = [
    {
      name: "KizuNavi",
      href: "/dashboard",
      icon: "home",
      permission: "canViewDashboard" as const,
      color: "text-[#2C9AEF]",
      bgColor: "bg-[#71D3D8]/10",
    },
    {
      name: "配信",
      href: "/questions",
      icon: "send",
      permission: "canManageQuestions" as const,
      color: "text-[#2C9AEF]",
      bgColor: "bg-[#71D3D8]/10",
    },
    {
      name: "分析",
      href: "#",
      icon: "chart",
      permission: "canViewReports" as const,
      color: "text-[#2C9AEF]",
      bgColor: "bg-[#71D3D8]/10",
      subItems: [
        {
          name: "サマリレポート",
          href: "/summary-report",
        },
        {
          name: "カテゴリ別レポート",
          href: "/category-report",
        },
      ],
    },
    {
      name: "顧客情報",
      href: "#",
      icon: "building",
      permission: "canManageCustomers" as const,
      color: "text-[#2C9AEF]",
      bgColor: "bg-[#71D3D8]/10",
      subItems: [
        {
          name: "基本情報登録",
          href: "/customers",
        },
        {
          name: "従業員情報登録",
          href: "/employees",
        },
      ],
    },
    {
      name: "回答",
      href: "/survey-response",
      icon: "clipboard-list",
      permission: "canAnswerSurvey" as const,
      color: "text-[#2C9AEF]",
      bgColor: "bg-[#71D3D8]/10",
    },
  ];

  // Filter navigation items based on permissions
  const visibleItems = navigationItems.filter((item) =>
    hasPermission(item.permission)
  );

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  const isActiveItem = (item: NavigationItem) => {
    if (item.subItems) {
      return item.subItems.some(
        (subItem) => location.pathname === subItem.href
      );
    }
    return location.pathname === item.href;
  };

  const getIcon = (iconName: string, isActive: boolean = false) => {
    const iconClass = `w-6 h-6 ${isActive ? "text-current" : "text-gray-600"}`;

    switch (iconName) {
      case "home":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "send":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        );
      case "chart":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "chart-bar":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "users":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        );
      case "building":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case "user-plus":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        );
      case "clipboard-list":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-20 lg:bg-white lg:border-r"
        style={{ borderColor: THEME_COLORS.border }}
      >
        <div className="flex-1 flex flex-col min-h-0 px-4 py-6">
          <ul className="space-y-3">
            {visibleItems.map((item) => {
              const isActive = isActiveItem(item);
              return (
                <li key={item.name}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? `${item.bgColor} ${item.color} shadow-sm`
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {getIcon(item.icon, isActive)}
                          <span>{item.name}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded(item.name) ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isExpanded(item.name) && (
                        <ul className="mt-2 ml-6 space-y-2">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <NavLink
                                to={subItem.href}
                                className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                  location.pathname === subItem.href
                                    ? `${item.color} bg-gray-100`
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                {subItem.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? `${item.bgColor} ${item.color} shadow-sm`
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {getIcon(item.icon, isActive)}
                      <span>{item.name}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />
          <div
            className="relative flex flex-col w-64 bg-white pt-20"
            style={{
              borderColor: THEME_COLORS.border,
              borderRightWidth: "1px",
            }}
          >
            <div className="flex-1 flex flex-col px-4 py-6">
              <ul className="space-y-3">
                {visibleItems.map((item) => {
                  const isActive = isActiveItem(item);
                  return (
                    <li key={item.name}>
                      {item.subItems ? (
                        <div>
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? `${item.bgColor} ${item.color} shadow-sm`
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {getIcon(item.icon, isActive)}
                              <span>{item.name}</span>
                            </div>
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded(item.name) ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {isExpanded(item.name) && (
                            <ul className="mt-2 ml-6 space-y-2">
                              {item.subItems.map((subItem) => (
                                <li key={subItem.name}>
                                  <NavLink
                                    to={subItem.href}
                                    onClick={onClose}
                                    className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                      location.pathname === subItem.href
                                        ? `${item.color} bg-gray-100`
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                  >
                                    {subItem.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          to={item.href}
                          onClick={onClose}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? `${item.bgColor} ${item.color} shadow-sm`
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {getIcon(item.icon, isActive)}
                          <span>{item.name}</span>
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* モバイル用のボトムタブバーを削除 */}
    </>
  );
};

export default Navigation;
