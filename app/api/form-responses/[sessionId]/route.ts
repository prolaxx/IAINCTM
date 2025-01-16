// app/api/form-responses/[sessionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/utils/firebaseAdmin";

interface Params {
  params: {
    sessionId: string;
  };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { sessionId } = params;

    const docSnap = await db.collection("formResponses").doc(sessionId).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Retornamos los datos del documento
    const data = docSnap.data();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching session data:", err);
    return NextResponse.json(
      { error: "Error fetching data" },
      { status: 500 }
    );
  }
}
