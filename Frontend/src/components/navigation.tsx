'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import { cn } from '@/lib/utils'

// 🌍 Explore Tab
const exploreTabs = [
  {
    title: 'Introduction',
    href: '/introduction',
    description: 'Learn about the world of coffee and our passion for it.',
  },
  {
    title: 'Types of Coffee',
    href: '/varieties',
    description: 'Understand different coffee varieties and roasts.',
  },
  {
    title: 'Producer Countries',
    href: '/countries',
    description: 'Explore the origins and regions where our coffee is grown.',
  },
]

// 🛒 Shop Tab (trimmed to just Shop Beans)
const shopTabs = [
  {
    title: 'Shop Beans',
    href: '/shop',
    description: 'Buy freshly roasted coffee beans.',
  },
]

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu className="justify-start z-[5] m750:max-w-[300px]">
      <Link href="/" className="bg-darkerBlue px-2 border-r-2 border-border py-1 hover:opacity-80">
        <Image src="/favicon-dark.png" alt="logo" width={250} height={250} className="max-h-11 max-w-11"/>
      </Link>
      <NavigationMenuList className="m750:max-w-[300px]">

        {/* 🌍 Explore Tab */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
            Explore
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
              {exploreTabs.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* 🛒 Shop Tab */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
              {shopTabs.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  )
}

// 🔹 Reusable ListItem Component (with Link wrapped around <a>)
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href || '#'} legacyBehavior passHref>
          <a
            ref={ref}
            className={cn(
              'hover:bg-accent block text-mtext select-none space-y-1 rounded-base border-2 border-transparent p-3 leading-none no-underline outline-none transition-colors hover:border-border dark:hover:border-darkBorder',
              className,
            )}
            {...props}
          >
            <div className="text-base font-heading leading-none">{title}</div>
            <p className="text-muted-foreground font-base line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </a>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
