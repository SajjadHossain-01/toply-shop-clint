import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/porviders/ReactQueryProvider';
import { AuthProvider } from '@/context/auth-context';
import { MobileBottomNav } from '@/components/bottomNavbar';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ToplyShop - Baby Books & Toys Online',
  description: 'Buy the best baby books and educational toys online in Bangladesh. ToplyShop offers quality toys and books for children.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/fav-toplyshop.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/fav-toplyshop.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/fav-toplyshop.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/fav-toplyshop.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F133ED',
  width: 'device-width',
  initialScale: 1,
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background">
        <AuthProvider>
        <ReactQueryProvider>
        {children}
        <MobileBottomNav/>
        </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
