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

  const groups = {}
  sessions.forEach(s => {
    if (!groups[s.date]) groups[s.date] = []
    groups[s.date].push(s)
  })

  const today = new Date().toLocaleDateString()

  return (
    <div className="w-56 h-full flex flex-col bg-stone-900">

      {/* Header */}
      <div className="p-4 border-b border-stone-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0">
            <img src="/lgu.jpg" alt="LGU" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">LGU Assistant</h2>
            <p className="text-xs text-stone-400">AI Powered</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="px-3 py-4 border-b border-stone-700 flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-stone-800 text-orange-400 text-sm font-medium">
          <span>💬</span> Chats
        </div>
        {/* <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-400 text-sm hover:bg-stone-800 cursor-pointer transition-all">
          <span>📚</span> Programs
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-400 text-sm hover:bg-stone-800 cursor-pointer transition-all">
          <span>💰</span> Fee Info
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-400 text-sm hover:bg-stone-800 cursor-pointer transition-all">
          <span>🎓</span> Admissions
        </div> */}
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button onClick={onNewChat}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white transition-all shadow-lg">
          ✏️ New Chat
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {sessions.length === 0 ? (
          <p className="text-xs text-center py-8 text-stone-500">
            No chats yet.<br />Start a new chat!
          </p>
        ) : (
          Object.keys(groups).map(date => (
            <div key={date}>
              <p className="text-xs font-semibold px-2 py-2 uppercase tracking-wider text-stone-500">
                {date === today ? "Today" : date}
              </p>
              {groups[date].map(session => {
                const isActive = currentSession && currentSession.id === session.id
                const isEditing = editingId === session.id

                return (
                  <div key={session.id}
                    onClick={() => onLoadSession(session.id)}
                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all
                      ${isActive ? "bg-stone-700 text-white" : "text-stone-400 hover:bg-stone-800"}`}>

                    <span className="text-xs">💬</span>

                    {isEditing ? (
                      <input
                        className="flex-1 text-xs px-2 py-1 rounded-lg outline-none bg-stone-600 text-white border border-orange-400"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        onKeyPress={e => e.key === "Enter" && confirmEdit(e, session.id)}
                        autoFocus
                      />
                    ) : (
                      <span className="flex-1 text-xs truncate">
                        {session.title}
                      </span>
                    )}

                    <div className={`flex gap-1 ${isEditing ? "flex" : "hidden group-hover:flex"}`}>
                      {isEditing ? (
                        <>
                          <button onClick={e => confirmEdit(e, session.id)}
                            className="w-5 h-5 rounded text-xs flex items-center justify-center bg-green-700 text-green-200">✓</button>
                          <button onClick={cancelEdit}
                            className="w-5 h-5 rounded text-xs flex items-center justify-center bg-red-800 text-red-200">✕</button>
                        </>
                      ) : (
                        <>
                          <button onClick={e => startEdit(e, session)}
                            className="w-5 h-5 rounded text-xs flex items-center justify-center bg-stone-600 text-stone-300">✏️</button>
                          <button onClick={e => { e.stopPropagation(); onDeleteSession(session.id) }}
                            className="w-5 h-5 rounded text-xs flex items-center justify-center bg-red-900 text-red-300">🗑️</button>
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
      <div className="p-3 border-t border-stone-700 text-center text-xs text-stone-500">
        Claude AI + RAG • LGU 2025
      </div>
    </div>
  )
}