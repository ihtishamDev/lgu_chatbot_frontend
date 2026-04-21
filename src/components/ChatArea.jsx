import { useEffect, useRef, useState } from "react"
import MessageBubble from "./MessageBubble"
import InputBar from "./InputBar"
import axios from "axios"

const SUGGESTIONS = [
  "What programs does LGU offer?",
  "What is the fee structure at LGU?",
  "Does LGU offer scholarships?",
  "How can I apply for admission?"
]

export default function ChatArea({ currentSession, onNewChat, onUpdateSession, onToggleSidebar }) {
  const bottomRef = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  async function handleSend(question) {
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
        messages: [...updated.messages, { role: "bot", text: "Server error. Please make sure Django is running.", time: "" }]
      })
    } finally {
      setLoading(false)
    }
  }

  const hasMessages = currentSession && currentSession.messages.length > 0

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-100 min-w-0">

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all">
            ☰
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0">
            <img src="/lgu.jpg" alt="LGU" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-800">LGU AI Assistant</h3>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Online
            </p>
          </div>
        </div>
        <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full border border-stone-200 hidden sm:block">
          Claude AI
        </span>
      </div>

      {/* Empty State */}
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 py-8">

          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-orange-400 shadow-xl">
            <img src="/lgu.jpg" alt="LGU" className="w-full h-full object-cover" />
          </div>

          <div className="text-center px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">
              Let's start strong! 💪
            </h1>
            <h2 className="text-sm md:text-base font-medium text-stone-500 mb-2">
              Can I help you with anything?
            </h2>
            <p className="text-xs md:text-sm text-stone-400 max-w-sm mx-auto">
              Ask me about LGU admissions, fee structure, programs, scholarships and more!
            </p>
          </div>

          {/* Suggestion Cards */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 justify-center w-full max-w-lg px-2">
            {SUGGESTIONS.map((s, i) => (
              <button key={i}
                onClick={() => { if (!currentSession) onNewChat(); handleSend(s) }}
                className="px-3 py-3 rounded-2xl text-left bg-white border border-stone-200 hover:border-orange-300 hover:shadow-md transition-all shadow-sm">
                <div className="w-6 h-6 rounded-lg mb-2 flex items-center justify-center text-sm bg-orange-50">
                  💬
                </div>
                <p className="font-medium text-xs text-stone-600 leading-snug">{s}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Messages */
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-4">
          {currentSession.messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex gap-3 items-end">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-300 flex-shrink-0">
                <img src="/lgu.jpg" alt="LGU" className="w-full h-full object-cover" />
              </div>
              <div className="px-4 py-3 rounded-2xl text-sm bg-white border border-stone-200 shadow-sm flex items-center gap-2">
                <span className="text-stone-500 text-xs">Thinking</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
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