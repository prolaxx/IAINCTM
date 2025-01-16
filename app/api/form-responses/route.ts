// app/api/form-responses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/utils/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Puedes extraer los campos necesarios
    const { name, email, ...rest } = data;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: name or email" },
        { status: 400 }
      );
    }

    // Crea un nuevo documento en Firestore con ID automático
    const docRef = await db.collection("formResponses").add({
      name,
      email,
      ...rest,
      createdAt: new Date(),
    });

    // docRef.id será nuestro "sessionId"
    return NextResponse.json({
      sessionId: docRef.id,
      message: "Data saved successfully",
    });
  } catch (err) {
    console.error("Error saving responses:", err);
    return NextResponse.json(
      { error: "Error saving responses" },
      { status: 500 }
    );
  }
}
