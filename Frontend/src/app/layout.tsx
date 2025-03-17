import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

import NavigationMenuDemo from '@/components/navigation'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coffeeeeeeeee',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        {/* <ThemeProvider attribute="class" disableTransitionOnChange> */}
        <header className="flex justify-start bg-specialBlue grid-bg-light">
          <NavigationMenuDemo />
        </header>
        <div style={{ position: "absolute", top: "58px" }}>
          {children}
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
