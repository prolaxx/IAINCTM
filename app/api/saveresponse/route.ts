import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/utils/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Datos del request:", data);

    const { name, email, favoriteClasses } = data;

    // Si favoriteClasses no es realmente obligatorio, quita la condición. Aquí solo validamos name y email.
    if (!name || !email) {
      return NextResponse.json(
        { error: "Los campos name y email son obligatorios." },
        { status: 400 }
      );
    }

    console.log("Datos recibidos:", { name, email, favoriteClasses });

    await db
      .collection("formResponses")
      .doc(email)
      .set({ name, email, favoriteClasses: favoriteClasses ?? [] });

    return NextResponse.json({
      message: "Respuestas guardadas correctamente.",
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
