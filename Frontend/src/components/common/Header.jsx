import { useState } from "react";

function Header({ activeTab = "Home", onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ["Home", "Progress", "Add", "AI", "Settings"];

  return (
    <>
      <div className="bg-gray-100 p-4 font-body">
        <div className="relative flex items-center gap-2">
          <h1 className="font-display m-[15px] text-3xl font-bold tracking-tight">CaloVic AI</h1>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onTabChange?.(item)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  activeTab === item
                    ? "font-display bg-black text-white"
                    : "font-medium text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <div className="font-display flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-700">
              U
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white"
              aria-label="Toggle navigation menu"
            >
              <span className="flex flex-col gap-1">
                <span className="h-[2px] w-5 rounded bg-gray-800" />
                <span className="h-[2px] w-5 rounded bg-gray-800" />
                <span className="h-[2px] w-5 rounded bg-gray-800" />
              </span>
            </button>
          </div>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <div className="font-display flex h-15 w-15 items-center justify-center rounded-full border-2 border-gray-400 text-2xl font-semibold">
              U
            </div>
          </div>
        </div>

        {menuOpen ? (
          <nav className="mt-3 grid gap-2 rounded-xl border border-gray-300 bg-white p-2 text-center md:hidden">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onTabChange?.(item);
                  setMenuOpen(false);
                }}
                className={`rounded-lg px-3 py-2 text-sm ${
                  activeTab === item
                    ? "font-display bg-black text-white"
                    : "font-medium text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        ) : null}
      </div>
      <div>
        <hr className="border-gray-300" />
      </div>
    </>
  );
}

export default Header;
