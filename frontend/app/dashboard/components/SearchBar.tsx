import { cn } from "@/lib/utils"

import { useSearch } from "../contexts/useSearch"

type SearchBarProps = {
  type?: "default" | "large"
}

export function SearchBar({ type = "default" }: SearchBarProps) {
  const { setIsCommandOpen } = useSearch()

  return (
    <div
      onClick={() => {
        setIsCommandOpen(true)
      }}
      className={cn(
        type === "default" ? "h-[32px]" : "h-[48px]",
        type === "default" ? "rounded" : "rounded-lg",
        "cursor-pointer flex group items-center justify-between bg-surface-100 bg-opacity-75 hover:bg-surface-200 hover:bg-opacity-100 border transition border-scale-500 pl-1.5 md:pl-3 pr-1.5 w-full text-lighter"
      )}
    >
      <div className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="sbui-icon "
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p className="hidden md:flex text-sm">Search docs</p>
      </div>
      <div className="hidden md:flex items-center space-x-1">
        <div className="md:flex items-center justify-center h-5 w-10 border rounded bg-surface-300 gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="sbui-icon "
          >
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
          </svg>
          <span className="text-[12px]">K</span>
        </div>
      </div>
    </div>
  )
}
