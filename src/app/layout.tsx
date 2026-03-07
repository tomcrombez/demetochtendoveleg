import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ochtendbord',
  description: 'Schoolbreed ochtendbord voor te bespreken en te lezen topics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
