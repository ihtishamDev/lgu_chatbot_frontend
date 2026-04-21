import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import ChatArea from "./components/ChatArea"

export default function App() {
  const [sessions, setSessions] = useState(() => {
    return JSON.parse(localStorage.getItem("lgu_sessions") || "[]")
  })
  const [currentSession, setCurrentSession] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("lgu_sessions", JSON.stringify(sessions))
  }, [sessions])

  function newChat() {
    const session = {
      id: Date.now(),
      title: "New Chat",
      date: new Date().toLocaleDateString(),
      messages: []
    }
    setSessions(prev => [session, ...prev])
    setCurrentSession(session)
    setSidebarOpen(false)
  }

  function loadSession(id) {
    const session = sessions.find(s => s.id === id)
    setCurrentSession(session ? { ...session } : null)
    setSidebarOpen(false)
  }

  function deleteSession(id) {
    setSessions(prev => prev.filter(s => s.id !== id))
    setCurrentSession(prev => prev && prev.id === id ? null : prev)
  }

  function renameSession(id, newTitle) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s))
    setCurrentSession(prev => prev && prev.id === id ? { ...prev, title: newTitle } : prev)
  }

  function updateSession(updatedSession) {
    setSessions(prev => {
      const exists = prev.find(s => s.id === updatedSession.id)
      if (exists) return prev.map(s => s.id === updatedSession.id ? updatedSession : s)
      return [updatedSession, ...prev]
    })
    setCurrentSession({ ...updatedSession })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100 relative">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 h-full transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <Sidebar
          sessions={sessions}
          currentSession={currentSession}
          onNewChat={newChat}
          onLoadSession={loadSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
        />
      </div>

      {/* Chat Area */}
      <ChatArea
        currentSession={currentSession}
        onNewChat={newChat}
        onUpdateSession={updateSession}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
    </div>
  )
}