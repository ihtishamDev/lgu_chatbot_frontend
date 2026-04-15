import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import ChatArea from "./components/ChatArea"

export default function App() {
  const [sessions, setSessions] = useState(() => {
    return JSON.parse(localStorage.getItem("lgu_sessions") || "[]")
  })
  const [currentSession, setCurrentSession] = useState(null)

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
  }

  function loadSession(id) {
    const session = sessions.find(s => s.id === id)
    setCurrentSession(session ? { ...session } : null)
  }

  function deleteSession(id) {
    setSessions(prev => prev.filter(s => s.id !== id))
    setCurrentSession(prev => {
      if (prev && prev.id === id) return null
      return prev
    })
  }

  function renameSession(id, newTitle) {
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, title: newTitle } : s)
    )
    setCurrentSession(prev =>
      prev && prev.id === id ? { ...prev, title: newTitle } : prev
    )
  }

  function updateSession(updatedSession) {
    setSessions(prev =>
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    )
    setCurrentSession({ ...updatedSession })
  }

  return (
    <div className="flex h-screen w-screen"
      style={{ background: "linear-gradient(135deg, #fdf6f0 0%, #f9ede8 50%, #f2d4cc 100%)" }}>

      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        onNewChat={newChat}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
      />

      <ChatArea
        currentSession={currentSession}
        onNewChat={newChat}
        onUpdateSession={updateSession}
      />
    </div>
  )
}