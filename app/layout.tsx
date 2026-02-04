import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import VelocityHeader from '@/components/velocity-header'
import VelocitySidebar from '@/components/velocity-sidebar'
import NovaAssistant from '@/components/nova-assistant'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Velocity - Adaptive Study Planner',
  description: 'An intelligent learning management system that adapts to your pace and energy levels, helping you overcome planner guilt with AI-powered task redistribution.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <VelocityHeader />
        <VelocitySidebar />
        <main className="min-h-screen pt-20 md:ml-64 md:pt-20">
          {children}
        </main>
        <NovaAssistant />
        <Analytics />
      </body>
    </html>
  )
}
