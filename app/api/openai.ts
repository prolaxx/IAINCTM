import { NextApiRequest, NextApiResponse } from "next";
import { getOpenAiApiKey } from "@/app/api/helpers/secretsManager"; // Ruta ajustada a tu estructura
import { sendRequestWithRetry } from "@/app/api/helpers/sendRequestWithRetry"; // Asegúrate de tener esta función en utils o helpers

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Solicitud recibida en el handler:', req.body);

  const { threadId, message } = req.body;

  if (!threadId || !message) {
    console.error('Faltan parámetros: threadId o message');
    return res.status(400).json({ error: 'Thread ID or message missing' });
  }

  let apiKey: string;

  try {
    apiKey = await getOpenAiApiKey(); // Obtén la clave de API
  } catch (error) {
    console.error("No se pudo obtener la clave de OpenAI:", error.message);
    return res.status(500).json({ error: "Failed to fetch API key: " + error.message });
  }

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      max_tokens: 16384,
      stream: true,
    }),
  };

  try {
    console.log("Enviando solicitud a la API de OpenAI...");
    const response = await sendRequestWithRetry(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      requestOptions
    );

    if (!response.body) {
      console.error("No se recibió respuesta del cuerpo de la API de OpenAI.");
      return res.status(500).json({ error: "No response body from OpenAI API" });
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const stream = response.body as any;
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let buffer = "";
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\n|\r\n/);
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const chunk = line.slice("data: ".length);
            console.log("Enviando fragmento al cliente:", chunk);
            res.write(`data: ${chunk}\n\n`);
          }
        }
      }
    }

    res.end();
    console.log("Flujo de datos terminado con éxito.");
  } catch (error) {
    console.error("Error en la solicitud a la API de OpenAI:", error.message);
    res.status(500).json({ error: "Error en la solicitud: " + error.message });
  }
}
