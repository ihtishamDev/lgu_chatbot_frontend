import { useEffect, useRef, useState } from "react"
import MessageBubble from "./MessageBubble"
import InputBar from "./InputBar"
import axios from "axios"

const SUGGESTIONS = [
  "What is Ihtisham's education?",
  "What skills does he have?",
  "Tell me about his projects",
  "What is his FYP about?"
]

export default function ChatArea({ currentSession, onNewChat, onUpdateSession }) {
  const bottomRef = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  async function handleSend(question) {
    // If no session, create one first
    let session = currentSession
    if (!session) {
        session = {
            id: Date.now(),
            title: question.substring(0, 28) + (question.length > 28 ? "..." : ""),
            date: new Date().toLocaleDateString(),
            messages: []
        }
        onUpdateSession(session)
    }

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const updated = {
        ...session,
        title: session.title === "New Chat"
            ? question.substring(0, 28) + (question.length > 28 ? "..." : "")
            : session.title,
        messages: [...session.messages, { role: "user", text: question, time }]
    }

    onUpdateSession(updated)
    setLoading(true)

    try {
        const res = await axios.post("http://127.0.0.1:8000/api/chat/", { question })
        const answerTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        onUpdateSession({
            ...updated,
            messages: [...updated.messages, { role: "bot", text: res.data.answer, time: answerTime }]
        })
    } catch {
        onUpdateSession({
            ...updated,
            messages: [...updated.messages, { role: "bot", text: "❌ Server error. Is Django running?", time: "" }]
        })
    } finally {
        setLoading(false)
    }
}

  const hasMessages = currentSession && currentSession.messages.length > 0

  return (
    <div className="flex-1 flex flex-col h-full">

      {/* Empty State */}
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl"
            style={{ background: "linear-gradient(135deg, #2d2d2d, #1a1a1a)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
            🎓
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#2d2d2d" }}>
              Hi, {currentSession ? "there" : "Welcome"}
            </h1>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#2d2d2d" }}>
              Can I help you with anything?
            </h2>
            <p className="text-sm" style={{ color: "#8a7a75", maxWidth: "320px" }}>
              Ready to assist with admissions info, student queries, and more. Let's get started!
            </p>
          </div>

          {/* Suggestion Cards */}
          <div className="flex gap-3 flex-wrap justify-center mt-4">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => { if (!currentSession) onNewChat(); handleSend(s) }}
                className="px-4 py-3 rounded-2xl text-sm text-left transition-all max-w-40"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  color: "#2d2d2d"
                }}>
                <div className="w-7 h-7 rounded-xl mb-2 flex items-center justify-center text-base"
                  style={{ background: "rgba(0,0,0,0.08)" }}>
                  💬
                </div>
                <p className="font-medium text-xs leading-snug">{s}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Messages */
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
          {currentSession.messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex gap-3 items-end">
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-sm"
                style={{ background: "rgba(255,255,255,0.8)" }}>🤖</div>
              <div className="px-4 py-3 rounded-2xl text-sm italic"
                style={{ background: "rgba(255,255,255,0.75)", color: "#8a7a75" }}>
                Thinking... ⏳
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <InputBar onSend={handleSend} disabled={loading} />
    </div>
  )
}