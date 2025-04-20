import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import ClientLayout from './clientLayout';
import { Toaster } from "@/components/sonner";
import 'flag-icons/css/flag-icons.min.css';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cosmic Coffee Catalog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <ClientLayout>{children}<Toaster /></ClientLayout>
      </body>
    </html>
  );
}
