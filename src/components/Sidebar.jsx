import { useState } from "react"

export default function Sidebar({
  sessions, currentSession,
  onNewChat, onLoadSession, onDeleteSession, onRenameSession
}) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")

  function startEdit(e, session) {
    e.stopPropagation()
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  function confirmEdit(e, id) {
    e.stopPropagation()
    if (editTitle.trim()) onRenameSession(id, editTitle.trim())
    setEditingId(null)
  }

  function cancelEdit(e) {
    e.stopPropagation()
    setEditingId(null)
  }

  // Group sessions by date
  const groups = {}
  sessions.forEach(s => {
    if (!groups[s.date]) groups[s.date] = []
    groups[s.date].push(s)
  })

  const today = new Date().toLocaleDateString()

  return (
    <div className="w-64 h-full flex flex-col"
      style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.6)" }}>

      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.6)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #2d2d2d, #1a1a1a)" }}>
            🎓
          </div>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: "#2d2d2d" }}>LGU Assistant</h2>
            <p className="text-xs" style={{ color: "#8a7a75" }}>AI Powered</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button onClick={onNewChat}
          className="w-full py-2.5 px-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
          style={{ background: "linear-gradient(135deg, #2d2d2d, #1a1a1a)", color: "white" }}>
          ✏️ New Chat
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {sessions.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: "#8a7a75" }}>
            No chats yet.<br />Start a new chat!
          </p>
        ) : (
          Object.keys(groups).map(date => (
            <div key={date}>
              <p className="text-xs font-semibold px-2 py-2 uppercase tracking-wider"
                style={{ color: "#8a7a75" }}>
                {date === today ? "Today" : date}
              </p>
              {groups[date].map(session => {
                const isActive = currentSession && currentSession.id === session.id
                const isEditing = editingId === session.id

                return (
                  <div key={session.id}
                    onClick={() => onLoadSession(session.id)}
                    className="group flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.75)" : "transparent",
                      boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
                    }}>

                    <span className="text-sm">💬</span>

                    {isEditing ? (
                      <input
                        className="flex-1 text-xs px-2 py-1 rounded-lg outline-none"
                        style={{ background: "rgba(255,255,255,0.8)", color: "#2d2d2d", border: "1px solid #f2d4cc" }}
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        onKeyPress={e => e.key === "Enter" && confirmEdit(e, session.id)}
                        autoFocus
                      />
                    ) : (
                      <span className="flex-1 text-xs truncate" style={{ color: "#2d2d2d" }}>
                        {session.title}
                      </span>
                    )}

                    {/* Action Buttons */}
                    <div className={`flex gap-1 ${isEditing ? "flex" : "hidden group-hover:flex"}`}>
                      {isEditing ? (
                        <>
                          <button onClick={e => confirmEdit(e, session.id)}
                            className="w-6 h-6 rounded-lg text-xs flex items-center justify-center"
                            style={{ background: "#d4edda", color: "#2d6a4f" }}>✓</button>
                          <button onClick={cancelEdit}
                            className="w-6 h-6 rounded-lg text-xs flex items-center justify-center"
                            style={{ background: "#f2d4cc", color: "#8a4a3a" }}>✕</button>
                        </>
                      ) : (
                        <>
                          <button onClick={e => startEdit(e, session)}
                            className="w-6 h-6 rounded-lg text-xs flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.8)", color: "#8a7a75" }}>✏️</button>
                          <button onClick={e => { e.stopPropagation(); onDeleteSession(session.id) }}
                            className="w-6 h-6 rounded-lg text-xs flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.8)", color: "#e57373" }}>🗑️</button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.6)", color: "#8a7a75" }}>
        Llama 3.2 + RAG
      </div>
    </div>
  )
}