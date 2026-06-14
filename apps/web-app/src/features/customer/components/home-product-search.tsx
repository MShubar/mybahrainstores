import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRotatingCategoryPlaceholder } from "../hooks/use-rotating-category-placeholder";

type HomeProductSearchProps = {
  categoryNames: string[];
};

export function HomeProductSearch({ categoryNames }: HomeProductSearchProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const { placeholder, visible } = useRotatingCategoryPlaceholder(categoryNames);

  const showAnimatedPlaceholder = !value && !focused;

  function goToSearch(query?: string) {
    const trimmed = query?.trim() ?? "";

    if (trimmed) {
      navigate(`/customer/search?q=${encodeURIComponent(trimmed)}`);
      return;
    }

    navigate("/customer/search");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToSearch(value);
  }

  return (
    <form onSubmit={onSubmit} className="px-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 outline-none transition placeholder:text-transparent focus:border-[#FF5A00]/30 focus:ring-2 focus:ring-orange-50"
          aria-label="Search products"
        />

        {showAnimatedPlaceholder ? (
          <span
            key={placeholder}
            className={`pointer-events-none absolute left-9 right-9 top-1/2 -translate-y-1/2 truncate text-sm text-gray-400 transition-all duration-300 ${
              visible ? "translate-y-[-50%] opacity-100" : "translate-y-[calc(-50%+6px)] opacity-0"
            }`}
          >
            {placeholder}
          </span>
        ) : null}

        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
    </form>
  );
}
