import { AlignJustify } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"

import { SearchBar } from "./SearchBar"
import TeamSwitcher from "./TeamSwitcher"
import { UserNav } from "./UserNav"

type Props = {
  onMenuButtonClick(): void
}

export default function Navbar({ onMenuButtonClick }: Props) {
  return (
    <nav className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm">
      <TeamSwitcher />
      {/* spacer */}
      <div></div>
      <div className="flex items-center">
        <SearchBar />
        <ThemeToggle />
        <UserNav />
        <button className="ml-4 md:hidden" onClick={onMenuButtonClick}>
          <AlignJustify className="h-8 w-8" />
        </button>
      </div>
    </nav>
  )
}
