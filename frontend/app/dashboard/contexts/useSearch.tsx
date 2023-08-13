"use client"

import { createContext, useContext, useState } from "react"

import { SearchResultDetails } from "../components/search/SearchResult"

type SearchContextType = {
  isCommandOpen: boolean
  setIsCommandOpen: (isCommandOpen: boolean) => void
  recentViewed: SearchResultDetails[]
  addRecentViewed: (recentViewed: SearchResultDetails) => void
}

export const SearchContext = createContext<SearchContextType>({
  isCommandOpen: false,
  setIsCommandOpen: () => {},
  recentViewed: [],
  addRecentViewed: () => {},
})

type SearchContextProviderProps = {
  children: React.ReactNode
}

export function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false)
  const [recentViewed, setRecentViewed] = useState<SearchResultDetails[]>([])

  function addRecentViewed(newRecent: SearchResultDetails) {
    const recents = [...recentViewed]
    recents.unshift(newRecent)

    if (recents.length > 2) {
      recents.pop()
    }

    setRecentViewed(recents)
  }

  return (
    <SearchContext.Provider
      value={{
        isCommandOpen,
        setIsCommandOpen,
        recentViewed,
        addRecentViewed,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const { isCommandOpen, setIsCommandOpen, recentViewed, addRecentViewed } =
    useContext(SearchContext)
  return { isCommandOpen, setIsCommandOpen, recentViewed, addRecentViewed }
}
