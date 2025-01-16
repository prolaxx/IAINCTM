// app/examples/all/ClientWrapper.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Chat from "@/app/components/chat"; // Ajusta la ruta si tu chat.tsx está en otro lugar

export default function ClientWrapper() {
  const [formResponses, setFormResponses] = useState<any>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    // Si no hay sessionId, nada que cargar
    if (!sessionId) return;

    // Hacemos fetch a nuestro backend con sessionId
    fetch(`/api/form-responses/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) {
          console.error("Error fetching form data:", data.error);
        } else {
          setFormResponses(data);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [sessionId]);

  if (!sessionId) {
    return <p>No se proporcionó sessionId en la URL.</p>;
  }

  if (!formResponses) {
    return <p>Cargando datos...</p>;
  }

  // Renderizamos tu componente Chat con los datos que cargamos
  return (
    <Chat
      sessionId={sessionId}
      formResponses={formResponses}
    />
  );
}
