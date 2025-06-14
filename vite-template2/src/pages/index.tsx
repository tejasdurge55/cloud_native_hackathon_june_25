/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

import { useState } from "react";
import { GoogleGenAI, Modality } from "@google/genai";
import { Card } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

type Message = {
  role: "user" | "model";
  content: string;
};

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const generateBase64FromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && selectedFiles.length === 0) return;
    setLoading(true);

    let userHtml = "";
    if (selectedFiles.length > 0) {
      // Show the selected image
      const file = selectedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      userHtml += `<img src="${imageUrl}" alt="User uploaded" class="rounded-lg max-w-full h-auto border border-gray-200 shadow-sm mb-2" />`;
    }
    if (prompt.trim()) {
      userHtml += `<div>${prompt.trim()}</div>`;
    }

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userHtml || "[Image only]" },
    ];
    setMessages(newMessages);
    setPrompt("");
    setSelectedFiles([]);

    try {
      let contents: any[] = [];
      if (prompt.trim()) {
        contents.push({ text: prompt.trim() });
      }
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0];
        const mimeType = file.type;
        const base64 = await generateBase64FromFile(file);
        contents.push({ inlineData: { data: base64, mimeType } });
      }

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const parts = result.candidates?.[0]?.content?.parts;
      const imgPart = parts?.find((p) => p.inlineData);
      const textPart = parts?.find((p) => p.text);

      let html = "";

      if (imgPart?.inlineData?.data) {
        const mimeType = imgPart.inlineData.mimeType || "image/png";
        const generatedImageUrl = `data:${mimeType};base64,${imgPart.inlineData.data}`;
        html += `
          <div class="flex flex-col items-start gap-2">
            <span class="text-xs text-gray-500">📍 Image created</span>
            <img
              src="${generatedImageUrl}"
              alt="Generated"
              class="rounded-lg max-w-full h-auto border border-gray-200 shadow-sm"
            />
            <div class="w-full flex justify-end mt-1">
              <a
                href="${generatedImageUrl}"
                download="gemini-image.png"
                class="text-sm text-blue-600 flex items-center gap-1"
                style="text-decoration: underline;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3" />
                </svg>
              </a>
            </div>
          </div>
        `;
      }

      if (textPart?.text) {
        html += `<div class="mb-2">${textPart.text}</div>`;
      }

      if (!html) {
        html = "No response from Gemini.";
      }

      setMessages([
        ...newMessages,
        {
          role: "model",
          content: html,
        },
      ]);
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: "Error generating response from Gemini API.",
        },
      ]);
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
    const input = document.getElementById(
      "file-upload-input"
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
      input.setAttribute("accept", "image/*");
      input.click();
    }
  };

  return (
    <DefaultLayout>
      <section className="py-12 md:py-16 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-800 mb-4 animate-fade-in-up">
              <span className="inline-block animate-waving-hand mr-2">👋</span>
              Welcome to Gemini Flash Chatbot!
            </h1>
            <p className="mb-4 text-lg text-blue-600 animate-fade-in">
              Image generation powered by Gemini 2.0 Flash
            </p>
            <p className="text-base text-gray-500 animate-fade-in-slow">
              Start by typing a prompt, uploading an image, or using your voice!
            </p>
          </div>
          <style>
            {`
              @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(30px);}
              100% { opacity: 1; transform: translateY(0);}
              }
              .animate-fade-in-up {
              animation: fade-in-up 1s cubic-bezier(.4,0,.2,1) both;
              }
              @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
              }
              .animate-fade-in {
              animation: fade-in 1.5s 0.3s both;
              }
              .animate-fade-in-slow {
              animation: fade-in 2.5s 0.8s both;
              }
              @keyframes waving-hand {
              0% { transform: rotate(0deg);}
              10% { transform: rotate(14deg);}
              20% { transform: rotate(-8deg);}
              30% { transform: rotate(14deg);}
              40% { transform: rotate(-4deg);}
              50% { transform: rotate(10deg);}
              60% { transform: rotate(0deg);}
              100% { transform: rotate(0deg);}
              }
              .animate-waving-hand {
              display: inline-block;
              animation: waving-hand 2s infinite;
              transform-origin: 70% 70%;
              }
            `}
          </style>

          <Card className="p-8 bg-white/90 rounded-3xl shadow-xl border border-blue-100">
            <div className="mb-6 max-h-96 overflow-y-auto text-left">
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
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      <span className="block text-xs font-semibold mb-1 opacity-70">
                        {msg.role === "user" ? "You" : "Gemini"}
                      </span>
                      <span
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 animate-pulse">
                    <span className="block text-xs font-semibold mb-1 opacity-70">
                      Gemini
                    </span>
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <form
              className="flex items-end gap-3 bg-white border border-blue-100 rounded-2xl px-4 py-3 shadow"
              onSubmit={handleSubmit}
            >
              <button
                type="button"
                onClick={handleUploadFiles}
                className="p-2 rounded-full hover:bg-blue-50"
              >
                ➕
              </button>

              <input
                id="file-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files)
                    setSelectedFiles(Array.from(e.target.files));
                }}
              />

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
                        className="w-12 h-12 object-cover rounded-lg border shadow"
                      />
                      <button
                        type="button"
                        aria-label="Remove image"
                        className="absolute -top-2 -right-2 bg-white border border-red-300 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full p-1 shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                        onClick={() =>
                          setSelectedFiles(
                            selectedFiles.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                required={selectedFiles.length === 0}
                className="flex-1 outline-none text-base px-2 py-2"
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

              <button
                type="submit"
                className="ml-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200"
                disabled={
                  loading || (!prompt.trim() && selectedFiles.length === 0)
                }
              >
                🚀
              </button>
            </form>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
