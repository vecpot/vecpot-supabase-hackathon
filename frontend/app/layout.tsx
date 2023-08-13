import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

import { SearchContextProvider } from "./dashboard/contexts/useSearch"
import { UserContextProvider } from "./dashboard/contexts/useUser"
import SupabaseProvider from "./supabase-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <SupabaseProvider>
            <UserContextProvider>
              <SearchContextProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                >
                  <div className="relative flex min-h-screen flex-col flex-wrap">
                    {/* <SiteHeader /> */}
                    <div className="flex-1">{children}</div>
                  </div>
                  <Toaster />
                </ThemeProvider>
              </SearchContextProvider>
            </UserContextProvider>
          </SupabaseProvider>
        </body>
      </html>
    </>
  )
}
