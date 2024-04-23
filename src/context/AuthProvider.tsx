'use client'
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export default function AuthProvider({
  children,
  //pageProps: { session, ...pageProps },
} : {children:React.ReactNode}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}