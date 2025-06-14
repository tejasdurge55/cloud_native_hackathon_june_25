import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Form, Textarea, Button, Card } from '@nextui-org/react';
import DefaultLayout from '@/layouts/default';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function IndexPage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!prompt.trim()) return;

  //   const newMessages: Message[] = [...messages, { role: 'user' as const, content: prompt }];
  //   setMessages(newMessages);
  //   setPrompt('');
  //   setLoading(true);

  //   try {
  //     const result = await ai.models.generateContent({
  //       model: 'gemini-2.0-flash',
  //       contents: newMessages.map(m => ({
  //         role: m.role,
  //         parts: [{ text: m.content }]
  //       })),
  //     });
  //     const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini API';
  //     setMessages([...newMessages, { role: 'model', content: text }]);
  //   } catch (err) {
  //     setMessages([...newMessages, { role: 'model', content: 'Error from Gemini API' }]);
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!prompt.trim()) return;

  const userMsg: Message = { role: 'user', content: prompt };
  const newMessages: Message[] = [...messages, userMsg];

  setMessages(newMessages);
  setPrompt('');
  setLoading(true);

  try {
    // 🔵 Save user message to DB
    await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userMsg),
    });

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini API';
    const modelMsg: Message = { role: 'model', content: text };

    // 🔵 Save model message to DB
    await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modelMsg),
    });

    setMessages([...newMessages, modelMsg]);
  } catch (err) {
    console.error(err);
    setMessages([...newMessages, { role: 'model', content: 'Error from Gemini API' }]);
  } finally {
    setLoading(false);
  }
};

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-12 md:py-16 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="inline-block max-w-2xl w-full text-center justify-center">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4 drop-shadow-lg">Gemini Flash Chatbot</h1>
        <p className="mb-8 text-lg text-blue-600">Chat with Google Gemini in real time. Powered by Gemini 2.0 Flash.</p>

        <Card className="w-full p-8 bg-white/90 shadow-2xl rounded-3xl border border-blue-100">
        <div className="mb-6 max-h-96 overflow-y-auto text-left scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 transition-all">
          {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-12">No messages yet. Start the conversation!</div>
          ) : (
          messages.map((msg, idx) => (
            <div
            key={idx}
            className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow
              ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <span className="block text-xs font-semibold mb-1 opacity-70">
              {msg.role === 'user' ? 'You' : 'Gemini'}
              </span>
              <span className="whitespace-pre-wrap">{msg.content}</span>
            </div>
            </div>
          ))
          )}
          {loading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-none animate-pulse">
            <span className="block text-xs font-semibold mb-1 opacity-70">Gemini</span>
            <span>Thinking...</span>
            </div>
          </div>
          )}
        </div>
        <Form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          disabled={loading}
          className="min-h-[80px] bg-blue-50 focus:bg-white transition"
          maxLength={1000}
          endContent={
            <span className="text-xs text-gray-400">{prompt.length}/1000</span>
          }
          />
          <div className="flex justify-between items-center">
           
          <Button
            type="submit"
            className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition font-semibold shadow"
            isLoading={loading}
            disabled={loading}
          >
            Send
          </Button>
          </div>
        </Form>
        </Card>
      </div>
      </section>
    </DefaultLayout>
  );
}