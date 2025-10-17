import React, { useState, useEffect } from "react";

const Header = () => {
  const [theme, setTheme] = useState("system");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Apply theme on mount or theme change
  useEffect(() => {
    const root = document.documentElement;

    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    const applyTheme = (t) => {
      if (t === "light") {
        root.classList.remove("dark");
      } else if (t === "dark") {
        root.classList.add("dark");
      } else {
        // system
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (selected) => {
    setTheme(selected);
    localStorage.setItem("theme", selected);

    const root = document.documentElement;
    if (selected === "light") {
      root.classList.remove("dark");
    } else if (selected === "dark") {
      root.classList.add("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    setDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary to-accent text-white border-b border-border shadow-glow">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-2xl">Personalized Learning</span>
      </div>

      <nav className="flex space-x-6 items-center">
        <a
          href="/student/dashboard"
          className="hover:text-secondary hover:underline transition-colors"
        >
          Student
        </a>
        <a
          href="/instructor/dashboard"
          className="hover:text-secondary hover:underline transition-colors"
        >
          Instructor
        </a>
        <a
          href="/admin/dashboard"
          className="hover:text-secondary hover:underline transition-colors"
        >
          Admin
        </a>

        {/* Theme Dropdown */}
        <div className="relative ml-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white px-3 py-1 rounded-md shadow-sm hover:shadow-md transition-all"
          >
            Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              {["light", "dark", "system"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="flex items-center space-x-3">
        <button className="rounded-full px-4 py-2 bg-gradient-to-r from-success to-info text-white shadow-md hover:shadow-lg transition-all">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
