export const sendRequestWithRetry = async (url: string, options: any, retries = 3): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok && retries > 0) {
        console.warn(`Reintentando solicitud... (${3 - retries})`);
        return sendRequestWithRetry(url, options, retries - 1);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Error en la solicitud. Reintentando... (${3 - retries})`, error);
        return sendRequestWithRetry(url, options, retries - 1);
      } else {
        console.error("Se agotaron los reintentos:", error.message);
        throw new Error("Se agotaron los reintentos");
      }
    }
  };
  