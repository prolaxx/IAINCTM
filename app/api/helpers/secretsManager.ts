export const getOpenAiApiKey = async (): Promise<string> => {
  if (process.env.OPENAI_API_KEY) {
    console.log("Usando clave de OpenAI desde las variables de entorno en Amplify.");
    return process.env.OPENAI_API_KEY;
  } else {
    throw new Error("No se encontró OPENAI_API_KEY en las variables de entorno.");
  }
};
