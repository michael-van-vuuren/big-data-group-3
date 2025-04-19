'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

import { cn } from '@/lib/utils'

const exploreTabs = [
  {
    title: 'Introduction',
    href: '/introduction',
    description: 'Learn about the world of coffee.',
  },
  {
    title: 'Flavors',
    href: '/varieties',
    description: 'Understand different coffee flavor notes.',
  },
  {
    title: 'Producers',
    href: '/countries',
    description: 'Explore the countries that produce coffee beans.',
  },
]

export default function NavigationMenuDemo() {
  const { user } = useAuth();

  return (
    <NavigationMenu className="justify-start z-[5] m750:max-w-[300px]">
      <Link
        href="/"
        className="bg-darkerBlue px-2 py-1 border-black border-r-2 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/favicon-dark.png"
          alt="logo"
          width={250}
          height={250}
          className="max-h-11 max-w-11"
        />
      </Link>

      <NavigationMenuList className="m750:max-w-[300px]">

        {/* Explore */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
            Explore
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[380px]">
              {exploreTabs.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Account – Only show if personal account */}
        {user && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
              Account
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[380px]">
                <ListItem title="Profile" href="/account/info">
                  View your account details.
                </ListItem>
                <ListItem title="View Favorite Products" href="/account/favorites">
                  Check your favorite coffee bean products.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

      </NavigationMenuList>
    </NavigationMenu>
  )
}


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
