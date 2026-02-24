import { useEffect, useMemo, useState } from "react";
import aiAvatar from "../../assets/ai-avatar.svg";
import userAvatar from "../../assets/user-avatar.svg";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const SYSTEM_INSTRUCTION =
  "You are a helpful health assistant. Give clear, practical answers in 3-6 short lines unless the user asks for a short reply.";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "ai",
    text: "HI! How are you? How can I help you?",
  },
];

function extractGeminiText(payload) {
  const candidate = payload?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (!Array.isArray(parts)) return "Sorry, I could not generate a response.";

  const text = parts
    .map((part) => part?.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  return text || "Sorry, I could not generate a response.";
}

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const saved = window.sessionStorage.getItem("gemini_api_key");
    if (saved) setApiKey(saved);
  }, []);

  const nextId = useMemo(() => messages.length + 1, [messages.length]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!apiKey.trim()) {
      setApiError("Please enter your Gemini API key first.");
      return;
    }

    const userMessage = {
      id: nextId,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setApiError("");

    const conversation = [...messages, userMessage].map((message) => ({
      role: message.sender === "ai" ? "model" : "user",
      parts: [{ text: message.text }],
    }));

    try {
      const response = await fetch(
        `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey.trim())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }],
            },
            contents: conversation,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        const message = payload?.error?.message || "Gemini API request failed.";
        throw new Error(message);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: userMessage.id + 1,
          sender: "ai",
          text: extractGeminiText(payload),
        },
      ]);
    } catch (error) {
      setApiError(error.message || "Unable to connect to Gemini API.");
      setMessages((prev) => [
        ...prev,
        {
          id: userMessage.id + 1,
          sender: "ai",
          text: "I am having trouble connecting right now. Please check your API key and try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111827] shadow-lg transition hover:bg-[#1f2937]"
          aria-label="Open AI chat"
        >
          <img src={aiAvatar} alt="AI chat" className="h-8 w-8 rounded-full object-cover" />
        </button>
      )}

      {isOpen && (
        <section className="font-body flex h-[72vh] w-[min(92vw,420px)] flex-col rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-3 shadow-md sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">AI Chat</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5e7eb] text-base font-semibold text-[#374151] transition hover:bg-[#d1d5db]"
                aria-label="Close AI chat"
              >
                ×
              </button>
            </div>
          </div>

          <div className="mb-3 rounded-xl border border-[#d1d5db] bg-white p-2.5 sm:p-3">
            <label htmlFor="gemini-api-key" className="mb-1 block text-xs font-medium text-[#4b5563]">
              Gemini API Key (frontend-only dev mode)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="gemini-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key"
                className="h-10 flex-1 rounded-lg border border-[#d1d5db] px-3 text-sm text-[#111827] outline-none focus:border-[#9ca3af]"
              />
              <button
                type="button"
                onClick={() => {
                  const key = apiKey.trim();
                  if (!key) {
                    setApiError("API key is empty.");
                    return;
                  }
                  window.sessionStorage.setItem("gemini_api_key", key);
                  setApiError("");
                }}
                className="h-10 rounded-lg bg-[#111827] px-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              >
                Save
              </button>
            </div>
            {apiError && <p className="mt-1 text-xs text-[#b91c1c]">{apiError}</p>}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-white p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "ai" && (
                  <img
                    src={aiAvatar}
                    alt="AI"
                    className="h-8 w-8 rounded-full border border-[#d1d5db] bg-white object-cover"
                  />
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm sm:text-base ${
                    message.sender === "user"
                      ? "rounded-br-sm bg-[#1f2937] text-white"
                      : "rounded-bl-sm bg-[#f3f4f6] text-[#1f2937]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>

                {message.sender === "user" && (
                  <img
                    src={userAvatar}
                    alt="User"
                    className="h-8 w-8 rounded-full border border-[#d1d5db] bg-white object-cover"
                  />
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <img
                  src={aiAvatar}
                  alt="AI"
                  className="h-8 w-8 rounded-full border border-[#d1d5db] bg-white object-cover"
                />
                <div className="rounded-2xl rounded-bl-sm bg-[#f3f4f6] px-3 py-2 text-sm text-[#6b7280]">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
              className="h-11 flex-1 rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-[#1f2937] outline-none focus:border-[#9ca3af]"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isTyping}
              className="h-11 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default AIChat;
