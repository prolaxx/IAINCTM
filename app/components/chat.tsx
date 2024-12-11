"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

interface ContentPart {
  text: {
    value: string;
  };
}

interface RequiredActionFunctionToolCall {
  function: {
    name: string;
    arguments: string;
  };
  id: string;
  type: string;
}

type Role = "user" | "assistant";

type MessageType = {
  id: string;
  role: Role;
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const Message = ({ id, role, text }: MessageType) => {
  if (role === "user") return <UserMessage text={text} />;
  if (role === "assistant") return <AssistantMessage text={text} />;
  return null;
};

type ChatProps = {
  initialMessage?: string | null;
  functionCallHandler: (call: RequiredActionFunctionToolCall) => Promise<string>;
};

const Chat = ({ initialMessage, functionCallHandler }: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [orientationStarted, setOrientationStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const assistantMessageRef = useRef<string>(""); 
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!inputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputDisabled]);

  const appendMessage = (role: Role, text: string) => {
    const newMessage: MessageType = {
      id: uuidv4(),
      role,
      text,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const updateLastAssistantMessage = (text: string) => {
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) {
        return [
          {
            id: uuidv4(),
            role: "assistant",
            text,
          },
        ];
      }

      const lastIndex = prevMessages.length - 1;
      const lastMessage = prevMessages[lastIndex];

      if (lastMessage.role === "assistant") {
        const updatedMessage = { ...lastMessage, text };
        return [...prevMessages.slice(0, lastIndex), updatedMessage];
      } else {
        return [
          ...prevMessages,
          {
            id: uuidv4(),
            role: "assistant",
            text,
          },
        ];
      }
    });
  };

  const handleStreamLine = (line: string) => {
    try {
      const parsed = JSON.parse(line);
      if (parsed.event === "thread.message.delta" && parsed.data?.delta?.content) {
        for (const part of parsed.data.delta.content as ContentPart[]) {
          const content = part?.text?.value || "";
          assistantMessageRef.current += content;
          updateLastAssistantMessage(assistantMessageRef.current);
        }
      }

      if (parsed.event === "thread.message.completed") {
        setInputDisabled(false);
      }
    } catch {
      // Línea no válida JSON; la ignoramos o logueamos
      console.warn("Línea no válida (no JSON):", line);
    }
  };

  const sendMessage = async (text: string, displayUserMessage = true, overrideThreadId?: string) => {
    const currentThreadId = overrideThreadId || threadId;

    if (!text.trim()) return;
    if (!currentThreadId) {
      console.error("No se puede enviar el mensaje. threadId no es válido:", currentThreadId);
      return;
    }

    if (displayUserMessage) {
      appendMessage("user", text);
    }

    setUserInput("");
    setInputDisabled(true);

    try {
      const response = await fetch(`/api/assistants/threads/${currentThreadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: text }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en el envío del mensaje: ${response.status}`);
      }

      if (!response.body) {
        console.error("No se recibió respuesta del servidor.");
        setInputDisabled(false);
        return;
      }

      assistantMessageRef.current = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);

        if (!buffer.endsWith("\n")) {
          buffer = lines.pop() || "";
        } else {
          buffer = "";
        }

        for (let line of lines) {
          line = line.trim();

          if (!line) continue;
          if (line.startsWith("data: ")) {
            line = line.slice("data: ".length);
          }

          if (line === "[DONE]") {
            setInputDisabled(false);
            break;
          }

          handleStreamLine(line);
        }
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setInputDisabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(userInput);
  };

  const handleStartOrientation = async () => {
    const formData = localStorage.getItem("formData");
    if (!formData) {
      console.error("No hay respuestas almacenadas localmente.");
      return;
    }

    setOrientationStarted(true);

    try {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`Error en la creación del thread: ${res.status}`);
      }
      const data = await res.json();
      if (!data.threadId) {
        throw new Error("El threadId no se generó correctamente.");
      }
      console.log("Nuevo threadId creado:", data.threadId);
      setThreadId(data.threadId);

      sendMessage(formData, false, data.threadId);
    } catch (error) {
      console.error("Error al crear el thread:", error);
      setOrientationStarted(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <Message key={msg.id} id={msg.id} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe tu mensaje"
          disabled={inputDisabled}
          ref={inputRef}
        />
        <button type="submit" className={styles.button} disabled={inputDisabled}>
          Enviar
        </button>
      </form>
      <button className={styles.startButton} onClick={handleStartOrientation} disabled={orientationStarted}>
        Iniciar Orientación
      </button>
    </div>
  );
};

export default Chat;
