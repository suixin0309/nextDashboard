import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Providers } from '@/app/provider';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
