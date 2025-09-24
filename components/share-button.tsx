"use client";
// Importa useEffect si no lo tienes
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react";

interface ShareButtonProps {
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ url }) => {
  // Estado para saber si el navegador soporta la API
  const [canShare, setCanShare] = useState(false);

  // Verifica si el navegador soporta la API cuando el componente se carga
  useEffect(() => {
    if (typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, []);

  const handleShare = async () => {
    try {
      // Usa navigator.share para abrir el menú.
      // Puedes compartir un título, texto y una URL.
      await navigator.share({
        title: 'Tickets',
        text: '¡Estos son mis tickets para la rifa de Autos 33!\n',
        url: url, // URL que se compartirá
      });
      console.log('Contenido compartido con éxito');
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <>
      {/* Muestra el botón solo si el navegador soporta la Web Share API */}
      {canShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center space-x-1 bg-transparent"
        >
          <Share className="h-4 w-4" />
          <span>Compartir</span>
        </Button>
      )}
    </>
  );
};

export default ShareButton;