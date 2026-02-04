import React, { useEffect, useState } from 'react';
import { Download, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const InstallPWA: React.FC<{ className?: string }> = ({ className }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevenir que el navegador muestre el prompt automáticamente
      e.preventDefault();
      // Guardar el evento para dispararlo después
      setDeferredPrompt(e);
    };

    // Verificar si la app ya está instalada
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar estado inicial (si es standalone, ya está instalada)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
      setDeferredPrompt(null);
    } else {
      console.log('Usuario rechazó la instalación');
    }
  };

  // Si ya está instalada o no hay prompt disponible, no mostrar nada
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium transition-all duration-200",
        "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-sm",
        className
      )}
    >
      <Download className="w-5 h-5 text-indigo-600" />
      <span>Instalar Aplicación</span>
    </button>
  );
};
