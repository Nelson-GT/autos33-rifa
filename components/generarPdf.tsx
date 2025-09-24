"use client";
// En tu componente de React/Next.js
import React, { useState } from 'react';

const GenerarPDF = () => {
  const [loading, setLoading] = useState(false);

  const handleGenerarPDF = async () => {
    setLoading(true);

    // Los datos que le pasarás a tu API para generar el PDF
    const pdfData = {
      nombreRifa: "Ford Ka 2007",
      fechaJuego: "30 de Septiembre, 2025",
      cedula: "V-32067861",
      boletos: [
        "6512", "2055","9201", "7152", "1327",
        "0299", "4510","3909", "9927", "0761",
      ],
    };

    try {
      // Realiza la petición POST al endpoint de la API
      const response = await fetch('/api/pdf_boletos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      // Convierte la respuesta en un Blob (un archivo binario)
      const blob = await response.blob();
      
      // Crea una URL para el Blob
      const url = window.URL.createObjectURL(blob);
      
      // Crea un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = 'boletos_rifa.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Limpia la URL y el enlace temporal
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Hubo un problema con la operación de fetch:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generar boletos de rifa</h1>
      <button onClick={handleGenerarPDF} disabled={loading}>
        {loading ? 'Generando...' : 'Generar PDF'}
      </button>
    </div>
  );
};

export default GenerarPDF;