"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Bot, Search } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Icons } from "@/components/icons"

import { api } from "../api"
import { useSearch } from "../contexts/useSearch"
import { useOrganization } from "../contexts/useUser"
import { SearchResult, SearchResultDetails } from "./search/SearchResult"
import { DataSourceType } from "./search/data-source"

type DatasourceDictType = { [key: string]: DataSourceType }

export function SearchCommand() {
  const { currentOrganization } = useOrganization()
  const { isCommandOpen, setIsCommandOpen, recentViewed, addRecentViewed } =
    useSearch()

  const inputRef = useRef<HTMLInputElement>(null)
  const [pages, setPages] = React.useState<string[]>(["Home"])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [results, setResults] = useState<SearchResultDetails[]>([])
  const [answer, setAnswer] = useState<string>("")
  const [datasourceTypesDict, setDatasourceTypesDict] =
    useState<DatasourceDictType>({})

  const activePage = useMemo(() => pages[pages.length - 1], [pages])
  const organizationId = useMemo(() => {
    if (currentOrganization && currentOrganization.id) {
      return currentOrganization.id
    }
  }, [currentOrganization])

  const listDataSourceTypes = useCallback(async () => {
    try {
      const response = await api.get<DataSourceType[]>("/data-sources/types")
      let dataSourceTypesDict: DatasourceDictType = {}
      response.data.forEach((dataSourceType) => {
        dataSourceTypesDict[dataSourceType.name] = dataSourceType
      })
      setDatasourceTypesDict(dataSourceTypesDict)
    } catch (error) {}
  }, [])

  const searchAction = useCallback(() => {
    if (!organizationId) return
    setIsLoading(true)
    try {
      api
        .get<SearchResultDetails[]>("/search/result-only", {
          params: {
            query: inputRef.current?.value,
            organization_id: 6,
          },
        })
        .then((response) => {
          setResults(response.data)
          setIsLoading(false)
        })
    } catch (error) {}
  }, [organizationId, setIsLoading, inputRef.current])

  const askAction = useCallback(() => {
    if (!organizationId) return
    setIsLoading(true)
    try {
      api
        .get<{ result: SearchResultDetails[]; answer: string }>("/search", {
          params: {
            query: inputRef.current?.value,
            organization_id: 6,
            top_k: 3,
          },
        })
        .then((response) => {
          setAnswer(response.data.answer)
          setIsLoading(false)
        })
    } catch (error) {}
  }, [organizationId, setIsLoading, inputRef.current])

  const popPage = useCallback(() => {
    setPages((pages) => {
      const x = [...pages]
      x.splice(-1, 1)
      return x
    })
  }, [])

  useEffect(() => {
    listDataSourceTypes()
  }, [])

  return (
    <CommandDialog
      loop={true}
      shouldFilter={false}
      open={isCommandOpen}
      onOpenChange={(open) => {
        setIsCommandOpen(open)
        if (!open && activePage !== "Home") popPage()
      }}
    >
      <div>
        {pages.map((p) => (
          <div
            key={p}
            className="bg-accent text-sm text-muted-foreground rounded-sm inline-flex p-1 ml-3 my-2"
          >
            {p}
          </div>
        ))}
      </div>
      <CommandInput
        autoFocus
        onValueChange={(value) => {
          if (activePage === "Results" || activePage === "Ask to AI") {
            popPage()
          }
        }}
        ref={inputRef}
        placeholder="Type a command or search..."
      />
      <CommandList>
        {activePage === "Home" && (
          <>
            <CommandGroup heading="Suggestions">
              <CommandItem
                onSelect={() => {
                  searchAction()
                  setPages([...pages, "Results"])
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  askAction()
                  setPages([...pages, "Ask to AI"])
                }}
              >
                <Bot className="mr-2 h-4 w-4" />
                Ask to AI
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Recently Viewed">
              {recentViewed.length > 0 &&
                recentViewed.map((recent, index) => (
                  <CommandItem
                    key={`recent-${index}`}
                    onSelect={() => {
                      addRecentViewed(recent)
                      window.open(recent.url, "_blank", "noopener,noreferrer")
                    }}
                  >
                    <SearchResult
                      resultDetails={recent}
                      dataSourceType={datasourceTypesDict[recent.data_source]}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}
        {activePage === "Results" && (
          <Results
            isLoading={isLoading}
            results={results}
            datasourceTypesDict={datasourceTypesDict}
            addRecentViewed={addRecentViewed}
          />
        )}
        {activePage === "Ask to AI" && (
          <Answer isLoading={isLoading} answer={answer} />
        )}
      </CommandList>
    </CommandDialog>
  )
}

function Results({
  isLoading,
  results,
  datasourceTypesDict,
  addRecentViewed,
}: {
  isLoading: boolean
  results: SearchResultDetails[]
  datasourceTypesDict: {
    [key: string]: DataSourceType
  }
  addRecentViewed: (recent: SearchResultDetails) => void
}) {
  return (
    <>
      {!isLoading &&
        results.length > 0 &&
        results.map((result, index) => (
          <CommandItem
            key={`result-${index}`}
            onSelect={() => {
              addRecentViewed(result)
              window.open(result.url, "_blank", "noopener,noreferrer")
            }}
          >
            <SearchResult
              resultDetails={result}
              dataSourceType={datasourceTypesDict[result.data_source]}
            />
          </CommandItem>
        ))}
      {!isLoading && results.length < 0 && (
        <CommandEmpty>No results found.</CommandEmpty>
      )}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
    </>
  )
}

function Answer({ isLoading, answer }: { isLoading: boolean; answer: string }) {
  return (
    <>
      {!isLoading && answer !== "" && (
        <CommandItem>
          <div className="p-4">{answer}</div>
        </CommandItem>
      )}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
    </>
  )
}
