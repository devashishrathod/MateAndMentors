import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userData = user || {};

  const icons = {
    dashboard:
      "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    profile:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    users:
      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
    categories: "M19 11H5m14-4H5m14 8H5m14-4H5",
    mentees:
      "M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z",
    mentors:
      "M17 20h5v-2a4 4 0 00-5-4m-3 6H7v-2a4 4 0 015-4m6-5a3 3 0 11-6 0 3 3 0 016 0zm-8 0a3 3 0 11-6 0 3 3 0 016 0z",
    sessions:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    enquiries:
      "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    tips: "M12 3a6 6 0 014 10 4 4 0 01-1 3v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2a4 4 0 01-1-3 6 6 0 014-10z",
    gallery:
      "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm3 3a2 2 0 114 0 2 2 0 01-4 0zm10 8l-4-5-3 4H7l5-6 5 7h-2z",
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: icons.dashboard,
        color: "text-blue-500",
      },
      {
        name: "Profile",
        path: "/profile",
        icon: icons.profile,
        color: "text-green-500",
      },
    ];
    switch (userData?.role) {
      case "admin":
        return [
          ...commonItems,
          {
            name: "Users",
            path: "/users",
            icon: icons.users,
            color: "text-purple-500",
          },
          {
            name: "Mentors",
            path: "/mentors",
            icon: icons.mentors,
            color: "text-yellow-500",
          },
          {
            name: "Mentees",
            path: "/mentees",
            icon: icons.mentees,
            color: "text-red-500",
          },
          {
            name: "Questions & Answers",
            path: "/questions",
            icon: icons.tips,
            color: "text-blue-600",
          },
          {
            name: "Categories",
            path: "/category",
            icon: icons.categories,
            color: "text-orange-500",
          },
          {
            name: "Sessions",
            path: "/sessions",
            icon: icons.sessions,
            color: "text-pink-500",
          },
          {
            name: "Contact Inquiries",
            path: "/contact-inquiries",
            icon: icons.enquiries,
            color: "text-emerald-500",
          },
          {
            name: "Gallery",
            path: "/gallery",
            icon: icons.gallery,
            color: "text-teal-500",
          },
        ];
      // case "mate":
      // return [
      //   ...commonItems,
      // {
      //     name: "Sessions",
      //     path: "/sessions",
      //     icon: icons.sessions,
      //     color: "text-pink-500",
      //   },
      // ];
      // case "mentor":
      //   return [
      //     ...commonItems,
      // {
      //     name: "Sessions",
      //     path: "/sessions",
      //     icon: icons.sessions,
      //     color: "text-pink-500",
      //   },
      //   ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();
  console.log("Role value:", userData?.role);

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 bg-white border-r border-gray-200 shadow-lg lg:block">
      <div className="flex flex-col h-full">
        {/* Sidebar header - Logo area with enhanced design - FIXED */}
        <div className="flex-shrink-0 flex items-center justify-center h-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-white">Mate & Mentors</h1>
            </div>
          </div>
        </div>
        {/* Role badge - FIXED */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50">
          <div className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <div className="w-2 h-2 mr-2 bg-white rounded-full animate-pulse"></div>
            {userData?.role?.charAt(0).toUpperCase() +
              userData?.role?.slice(1) || "User"}{" "}
            Panel
          </div>
        </div>

        {/* Menu items with enhanced design - SCROLLABLE */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-[1.01]"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200 ${
                    isActive
                      ? " bg-opacity-20"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-white" : item.color
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom with enhanced design - FIXED */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center p-3 bg-white rounded-xl shadow-sm">
            <div className="relative">
              {userData?.image ? (
                <img
                  src={userData.image}
                  alt={userData.name}
                  className="w-12 h-12 rounded-full ring-2 ring-blue-500"
                />
              ) : (
                <div className="flex items-center justify-center w-12 h-12 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <span className="text-lg font-bold">
                    {userData?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userData?.role || "User"}
              </p>
            </div>
            <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
