import { ReactNode } from "react";
import { Link } from "react-router-dom";

export function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold">
            RandomStores
          </Link>
          <Link to="/search">Search</Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/stores">Stores</Link>
            <Link to="/categories">Categories</Link>

            <a
              href="http://localhost:5173/login"
              className="rounded border px-4 py-2"
            >
              Login
            </a>

            <a
              href="http://localhost:5173/signup"
              className="rounded bg-black px-4 py-2 text-white"
            >
              Sign Up
            </a>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RandomStores Bahrain
      </footer>
    </div>
  );
}