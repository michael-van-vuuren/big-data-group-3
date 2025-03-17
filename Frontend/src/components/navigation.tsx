'use client'

import * as React from 'react'

import Image from 'next/image';
import Link from 'next/link';

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

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: 'https://ui.shadcn.com/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: 'https://ui.shadcn.com/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  }
]

const gettingStarted: { title: string; href: string; description: string }[] = [
  {
    title: 'Introduction',
    href: 'https://ui.shadcn.com/docs',
    description:
      'Re-usable components built using Radix UI and Tailwind CSS.',
  },
  {
    title: 'Installation',
    href: 'https://ui.shadcn.com/docs/installation',
    description:
      'How to install dependencies and structure your app.',
  },
  {
    title: 'Typography',
    href: 'https://ui.shadcn.com/docs/primitives/typography',
    description:
      'Styles for headings, paragraphs, lists...etc',
  }
]

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu className="justify-start z-[5] m750:max-w-[300px]">
      <Link href="/" className="bg-darkerBlue px-2 border-r-2 border-border py-1 hover:opacity-80">
        <Image src="/favicon-dark.png" alt="logo" width={250} height={250} className="max-h-11 max-w-11"/>
      </Link>
      <NavigationMenuList className="m750:max-w-[300px]">
      <NavigationMenuItem>
          <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
            Getting started
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {gettingStarted.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
            Components
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="https://ui.shadcn.com/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <span className="m750:max-w-[80px] m750:text-xs">
                Account
              </span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
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
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
