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
              Welcome to Gemini Flash Chatbot
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

            <Card className="p-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-[2.5rem] shadow-[0_8px_40px_0_rgba(30,64,175,0.10)] border border-blue-200 max-w-4xl mx-auto w-full overflow-hidden relative z-30" style={{ background: "rgba(255,255,255,0.98)", backdropFilter: "blur(12px)" }}>
              {/* Decorative Blobs */}
              <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-200/40 rounded-full blur-3xl z-10 pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl z-10 pointer-events-none" />

              {/* Header Bar */}
              <div className="flex items-center justify-between px-10 py-7 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 shadow-lg z-10 relative">
                <div className="flex items-center gap-4">
                  <span className="text-3xl animate-spin-slow">🌐</span>
                  <span className="text-2xl font-extrabold text-white tracking-wider drop-shadow-lg">Gemini Flash Chatbot</span>
                </div>
                <span className="text-blue-100 text-base font-semibold tracking-wide bg-blue-900/30 px-4 py-1 rounded-full shadow">Gemini 2.0 Flash</span>
              </div>

              {/* Chat Area */}
              <div className="mb-0 max-h-[520px] overflow-y-auto px-10 py-10 bg-white/90 backdrop-blur-xl text-left custom-scrollbar z-10 relative">
                {messages.length === 0 ? (
                  <div className="text-gray-400 text-center py-28 text-xl italic select-none">
                    <span className="inline-block animate-bounce text-4xl mb-3">✨</span>
                    <br />
                    <span className="font-semibold">No messages yet.</span>
                    <br />
                    <span className="text-base">Start the conversation with a prompt, image, or your voice!</span>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-8 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative max-w-[80%] px-8 py-6 rounded-[2rem] shadow-xl transition-all duration-200 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-blue-600 to-blue-400 text-white border-2 border-blue-200"
                            : "bg-gradient-to-br from-white to-blue-50 text-gray-900 border border-blue-100"
                        }`}
                      >
                        <span className="block text-xs font-bold mb-2 opacity-80 tracking-wide uppercase">
                          {msg.role === "user" ? (
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                              You
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-blue-700 rounded-full" />
                              Gemini
                            </span>
                          )}
                        </span>
                        <span
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                          className="whitespace-pre-wrap text-base leading-relaxed"
                        />
                        {msg.role === "model" && (
                          <span className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-100 to-blue-300 text-blue-700 px-3 py-1 rounded-full text-xs shadow font-bold border border-blue-200">
                            AI
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start mb-8">
                    <div className="max-w-[80%] px-8 py-6 rounded-[2rem] bg-gradient-to-br from-white to-blue-50 text-gray-900 animate-pulse shadow-xl border border-blue-100">
                      <span className="block text-xs font-bold mb-2 opacity-80 tracking-wide uppercase">
                        Gemini
                      </span>
                      <span className="text-base flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form
                className="flex items-end gap-4 bg-white/95 border-t border-blue-100 px-10 py-7 shadow-inner z-10 relative"
                style={{ backdropFilter: "blur(8px)" }}
                onSubmit={handleSubmit}
              >
                {/* Upload Button */}
                <button
                  type="button"
                  className="p-3 rounded-full hover:bg-blue-50 border border-blue-200 transition shadow-lg bg-white/80"
                  title="Upload image"
                  onClick={handleUploadFiles}
                >
                  <svg
                    className="w-7 h-7 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <input
                  accept="image/*"
                  className="hidden"
                  id="file-upload-input"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
                  }}
                />

                {/* Selected Images Preview */}
                {selectedFiles.length > 0 && (
                  <div className="flex gap-3 items-end">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative group"
                        style={{ width: 56, height: 56 }}
                      >
                        <img
                          alt="Selected"
                          className="w-14 h-14 object-cover rounded-xl border-2 border-blue-200 shadow-md"
                          src={URL.createObjectURL(file)}
                        />
                        <button
                          aria-label="Remove image"
                          className="absolute -top-2 -right-2 bg-white border border-red-300 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full p-1 shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                          type="button"
                          onClick={() =>
                            setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prompt Input */}
                <input
                  className="flex-1 outline-none text-base px-5 py-4 rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-400 transition bg-white/90 shadow-lg font-medium"
                  disabled={loading}
                  maxLength={1000}
                  placeholder="Type your message, upload an image, or use your voice…"
                  required={selectedFiles.length === 0}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                {/* Voice Input Button */}
                <button
                  className={`p-3 rounded-full border border-blue-200 hover:bg-blue-50 transition relative shadow-lg bg-white/80 ${
                    listening ? "bg-blue-100 animate-pulse ring-2 ring-blue-400" : ""
                  }`}
                  disabled={loading}
                  tabIndex={-1}
                  title="Voice input"
                  type="button"
                  onClick={handleVoiceInput}
                >
                  <svg
                    className={`h-7 w-7 ${listening ? "text-blue-600" : "text-gray-500"}`}
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
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  className="ml-2 p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white shadow-xl border-2 border-blue-200 transition disabled:opacity-60"
                  disabled={loading || (!prompt.trim() && selectedFiles.length === 0)}
                  title="Send"
                  type="submit"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.94 2.94a1.5 1.5 0 012.12 0l12 12a1.5 1.5 0 01-2.12 2.12l-12-12a1.5 1.5 0 010-2.12z" />
                    <path stroke="#fff" strokeLinecap="round" strokeWidth="2" d="M13.5 6.5l-7 7" />
                  </svg>
                </button>
              </form>

              {/* Custom Scrollbar Styles */}
              <style>
                {`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    background: transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c7d2fe;
                    border-radius: 8px;
                  }
                  .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #c7d2fe #f1f5fd;
                  }
                  @keyframes spin-slow {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                  }
                  .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                  }
                `}
              </style>
            </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
