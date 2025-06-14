/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Card } from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

type Message = {
  role: "user" | "model";
  content: string;
};

export default function IndexPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && selectedFiles.length === 0) return;

    setLoading(true);

    // Prepare file parts for Gemini API
    const fileParts = await Promise.all(
      selectedFiles.map(async (file) => {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        return {
          inlineData: {
            mimeType: file.type,
            data: base64,
          },
        };
      })
    );

    // Always add a prompt for "make it gibbly" if files are selected and no prompt is given
    let userPrompt = prompt.trim();
    if (!userPrompt && fileParts.length > 0) {
      userPrompt = "Make it gibbly";
    }

    const userParts = [];
    if (userPrompt) {
      userParts.push({ text: userPrompt });
    }
    if (fileParts.length > 0) {
      userParts.push(...fileParts);
    }

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userPrompt },
    ];
    setMessages(newMessages);
    setPrompt("");
    setSelectedFiles([]);

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          ...newMessages.slice(0, -1).map((m) => ({
            role: m.role,
            parts: [{ text: m.content }],
          })),
          {
            role: "user",
            parts: userParts,
          },
        ],
      });
      const text =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini API";
      setMessages([...newMessages, { role: "model", content: text }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "model", content: "Error from Gemini API" },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setListening(false);
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
      }
      setListening(false);
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      if (event.error === "no-speech") {
        setListening(false);
        alert("No speech was detected. Please try speaking again.");
      } else {
        setListening(false);
        alert(`Speech recognition error: ${event.error || "Unknown error"}`);
      }
      recognition.stop();
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (err: any) {
      setListening(false);
      alert(`Speech recognition failed to start: ${err.message || err}`);
    }
  };

  const handleUploadFiles = () => {
    const fileInput = document.getElementById(
      "file-upload-input"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Reset to allow re-uploading same file
      fileInput.click();
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-12 md:py-16 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
        <div className="inline-block max-w-2xl w-full text-center justify-center">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-4 drop-shadow-lg">
            Gemini Flash Chatbot
          </h1>
          <p className="mb-8 text-lg text-blue-600">
            Chat with Google Gemini in real time. Powered by Gemini 2.0 Flash.
          </p>

          <Card className="w-full p-8 bg-white/90 shadow-2xl rounded-3xl border border-blue-100">
            <div className="mb-6 max-h-96 overflow-y-auto text-left scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 transition-all">
              {messages.length === 0 ? (
                <div className="text-gray-400 text-center py-12">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow
              ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
                    >
                      <span className="block text-xs font-semibold mb-1 opacity-70">
                        {msg.role === "user" ? "You" : "Gemini"}
                      </span>
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-none animate-pulse">
                    <span className="block text-xs font-semibold mb-1 opacity-70">
                      Gemini
                    </span>
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <form
              className="flex items-end gap-3 bg-white rounded-2xl px-4 py-3 shadow border border-blue-100"
              onSubmit={async (e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              {/* Plus icon for add/attach */}
              <div className="relative flex items-center">
                <button
                  className="p-2 rounded-full hover:bg-blue-50 transition"
                  disabled={loading}
                  tabIndex={-1}
                  type="button"
                  onClick={handleUploadFiles}
                >
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4v16m8-8H4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <span className="sr-only">Add</span>
                </button>
                <input
                  id="file-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                />
              </div>

              {/* File/image preview like ChatGPT */}
              {selectedFiles.length > 0 && (
                <div className="flex gap-2 items-end">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative group"
                      style={{ width: 48, height: 48 }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Selected"
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-0.5 shadow hover:bg-red-100 transition opacity-80 group-hover:opacity-100"
                        onClick={() => {
                          setSelectedFiles(
                            selectedFiles.filter((_, i) => i !== idx)
                          );
                        }}
                        tabIndex={-1}
                      >
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
              <input
                required={selectedFiles.length === 0}
                className="flex-1 bg-transparent outline-none text-base px-2 py-2"
                disabled={loading}
                maxLength={1000}
                placeholder="Ask anything"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              {/* Mic icon */}
              <button
                className={`p-2 rounded-full hover:bg-blue-50 transition relative ${
                  listening
                    ? "bg-blue-100 animate-pulse ring-2 ring-blue-400"
                    : ""
                }`}
                disabled={loading}
                tabIndex={-1}
                type="button"
                onClick={handleVoiceInput}
              >
                <svg
                  className={`h-6 w-6 ${listening ? "text-blue-600" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 01-6 0V9a3 3 0 016 0v6z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <span className="sr-only">Voice input</span>
                {listening && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                )}
              </button>

              {/* Send button */}
              <button
                className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition"
                disabled={
                  loading || (!prompt.trim() && selectedFiles.length === 0)
                }
                type="submit"
              >
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span className="sr-only">Send</span>
              </button>
            </form>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
