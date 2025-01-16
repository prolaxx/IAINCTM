"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

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

type ChatProps = {
  sessionId: string;
  formResponses: any;
  functionCallHandler?: (call: RequiredActionFunctionToolCall) => Promise<string>;
};

export default function Chat({
  sessionId,
  formResponses,
  functionCallHandler,
}: ChatProps) {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [orientationStarted, setOrientationStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const assistantMessageRef = useRef<string>(""); 
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    setMessages((prev) => [...prev, newMessage]);
  };

  const updateLastAssistantMessage = (text: string) => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ id: uuidv4(), role: "assistant", text }];
      }
      const lastIndex = prev.length - 1;
      const lastMessage = prev[lastIndex];

      if (lastMessage.role === "assistant") {
        const updated = { ...lastMessage, text };
        return [...prev.slice(0, lastIndex), updated];
      } else {
        return [...prev, { id: uuidv4(), role: "assistant", text }];
      }
    });
  };

  const handleStreamLine = (line: string) => {
    try {
      const parsed = JSON.parse(line);
      if (parsed.event === "thread.message.delta" && parsed.data?.delta?.content) {
        for (const part of parsed.data.delta.content) {
          const content = part?.text?.value || "";
          assistantMessageRef.current += content;
          updateLastAssistantMessage(assistantMessageRef.current);
        }
      }
      if (parsed.event === "thread.message.completed") {
        setIsTyping(false);
        setInputDisabled(false);
      }
    } catch {
      console.warn("Línea no válida (no JSON):", line);
    }
  };

  const sendMessage = async (text: string, displayUserMessage = true, overrideThreadId?: string) => {
    const currentThreadId = overrideThreadId || threadId;
    if (!currentThreadId) {
      console.error("No se puede enviar el mensaje. threadId no es válido");
      return;
    }
    if (!text.trim()) return;

    if (displayUserMessage) {
      appendMessage("user", text);
    }

    setUserInput("");
    setInputDisabled(true);
    setIsTyping(true);

    try {
      const response = await fetch(`/api/assistants/threads/${currentThreadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: text }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      if (!response.body) {
        console.error("No se recibió respuesta del servidor.");
        setInputDisabled(false);
        setIsTyping(false);
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
            setIsTyping(false);
            break;
          }
          handleStreamLine(line);
        }
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setInputDisabled(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(userInput);
  };

  const handleStartOrientation = async () => {
    if (!formResponses) {
      console.error("No hay datos de formulario (formResponses) para iniciar la orientación.");
      return;
    }

    setOrientationStarted(true);

    try {
      const res = await fetch(`/api/assistants/threads`, { method: "POST" });
      if (!res.ok) throw new Error(`Error creando thread: ${res.status}`);
      const data = await res.json();
      if (!data.threadId) throw new Error("El threadId no se generó correctamente.");

      setThreadId(data.threadId);

      const formDataAsString = JSON.stringify(formResponses, null, 2);
      sendMessage(formDataAsString, false, data.threadId);
    } catch (error) {
      console.error("Error al crear el thread:", error);
      setOrientationStarted(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === "user" ? styles.userMessage : styles.assistantMessage}>
            <Markdown>{msg.text}</Markdown>
          </div>
        ))}
        {isTyping && <div className={styles.assistantMessage}>Escribiendo...</div>}
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

      <button
        className={styles.startButton}
        onClick={handleStartOrientation}
        disabled={orientationStarted || !formResponses}
      >
        Iniciar Orientación
      </button>
    </div>
  );
}