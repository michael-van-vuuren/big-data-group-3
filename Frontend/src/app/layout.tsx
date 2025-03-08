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
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <header className="flex justify-start p-1 bg-white">
            <NavigationMenuDemo />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
