"use client"   // এটাও লাগবে কারণ QueryClientProvider client-side

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// একটি global query client তৈরি
const queryClient = new QueryClient()

type Props = {
  children: ReactNode
}

export default function ReactQueryProvider({ children }: Props) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}