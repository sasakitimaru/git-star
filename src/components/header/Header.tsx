"use client";

import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Git Star
          </div>
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  );
}
