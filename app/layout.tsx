import type { Metadata } from 'next'
import './globals.css'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'srch',
  description: 'Simple search component',
}


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-white dark:bg-black font-sans antialiased simple-grid max-w-screen overflow-x-hidden",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey='srch_theme'
            enableColorScheme
            // disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
    </html>
  )
}
