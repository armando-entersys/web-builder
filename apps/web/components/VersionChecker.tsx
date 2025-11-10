'use client'

import { useEffect, useState } from 'react'
import packageJson from '@/package.json'

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000 // 5 minutos
const VERSION_STORAGE_KEY = 'app_version'

export function VersionChecker() {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)
  const currentVersion = packageJson.version

  const checkVersion = async () => {
    try {
      const response = await fetch('/api/version', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })

      if (!response.ok) return

      const data = await response.json()
      const serverVersion = data.version
      const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY)

      // Si hay una nueva versión en el servidor
      if (serverVersion !== currentVersion) {
        console.log(`Nueva versión disponible: ${serverVersion} (actual: ${currentVersion})`)

        // Si no es la primera carga, mostrar notificación
        if (storedVersion && storedVersion !== serverVersion) {
          setShowUpdateNotification(true)
        }

        // Actualizar la versión almacenada
        localStorage.setItem(VERSION_STORAGE_KEY, serverVersion)
      } else {
        // Versiones coinciden, actualizar storage
        localStorage.setItem(VERSION_STORAGE_KEY, currentVersion)
      }
    } catch (error) {
      console.error('Error checking version:', error)
    }
  }

  const handleUpdate = () => {
    // Limpiar todos los caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }

    // Limpiar service worker si existe
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
    }

    // Recargar la página forzando desde el servidor
    window.location.reload()
  }

  useEffect(() => {
    // Verificar versión al cargar
    checkVersion()

    // Verificar periódicamente
    const interval = setInterval(checkVersion, VERSION_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  if (!showUpdateNotification) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md animate-in slide-in-from-bottom-5">
      <div className="bg-blue-600 text-white rounded-lg shadow-2xl p-4 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Nueva versión disponible</h3>
          <p className="text-sm text-blue-100">
            Hay una actualización disponible. Haz clic en actualizar para obtener las últimas mejoras.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-white text-blue-600 rounded font-medium hover:bg-blue-50 transition-colors text-sm"
          >
            Actualizar
          </button>
          <button
            onClick={() => setShowUpdateNotification(false)}
            className="px-4 py-2 bg-blue-700 text-white rounded font-medium hover:bg-blue-800 transition-colors text-sm"
          >
            Más tarde
          </button>
        </div>
      </div>
    </div>
  )
}
