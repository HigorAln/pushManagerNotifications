import '@/styles/globals.css'
import axios from 'axios'
import type { AppProps } from 'next/app'
import React from 'react'


export default function App({ Component, pageProps }: AppProps) {
  
  React.useEffect(() => {
    window.Notification.requestPermission()
    navigator.serviceWorker.register("service-worker.js").then(
      async serviceWorker => {
        let subscription = await serviceWorker.pushManager.getSubscription();

        if (!subscription) {

          const response = await axios.get<{publicKey: string}>("/api/notifications");

          subscription = await serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: response.data.publicKey,
          })
        }

        await axios.post("/api/notifications", subscription)
     }
    )
  }, [])

  return <Component {...pageProps} />
}
