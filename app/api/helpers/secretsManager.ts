import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretName = "amplify/openai/secrets";
const region = "us-east-2"; // Reemplaza por la región donde configuraste el secreto

export const getOpenAiApiKey = async (): Promise<string> => {
  if (process.env.OPENAI_API_KEY) {
    console.log("Usando clave de OpenAI desde las variables de entorno.");
    return process.env.OPENAI_API_KEY;
  }

  console.log("Buscando clave de OpenAI desde AWS Secrets Manager...");

  const client = new SecretsManagerClient({ region });

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    if (response.SecretString) {
      const secret = JSON.parse(response.SecretString);
      if (secret.OPENAI_API_KEY) {
        console.log("Clave de OpenAI obtenida de Secrets Manager.");
        return secret.OPENAI_API_KEY;
      } else {
        throw new Error("OPENAI_API_KEY no encontrada en el secreto.");
      }
    }

    throw new Error("No se encontró SecretString en el secreto.");
  } catch (error) {
    console.error("Error al obtener el secreto desde AWS Secrets Manager:", error.message);
    throw error;
  }
};
