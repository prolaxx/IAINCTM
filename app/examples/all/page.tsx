// app/examples/all/page.tsx

// 1) Si lo necesitas, fuerza la dinámica:
export const dynamic = "force-dynamic";

// 2) Server component - NO "use client" aquí
import React from "react";
import ClientWrapper from "./ClientWrapper"; 
// ^ Este es el subcomponente que crearemos abajo

export default function Page() {
  // No usamos hooks de cliente; esto se renderiza en el servidor
  return (
    <main style={{ padding: 20 }}>
      {/* Renderizamos un componente CLIENTE */}
      <ClientWrapper />
    </main>
  );
}
