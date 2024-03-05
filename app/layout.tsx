import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Providers } from '@/app/provider';
import { SessionProvider } from 'next-auth/react';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* <SessionProvider session={session}> */}
        <Providers>
          {children}
        </Providers>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
