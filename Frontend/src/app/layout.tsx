import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import ClientLayout from './clientLayout';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coffeeeeeeeee',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
