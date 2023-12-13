import type { Metadata } from 'next'
import './globals.css'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: 'srch',
  description: 'Simple search component',
}


export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark' style={{ colorScheme: 'dark' }}>
      <body
        className={cn(
          "min-h-screen bg-white dark:bg-gray-950 font-sans antialiased",
          fontSans.variable
        )}
      >{children}</body>
    </html>
  )
}
