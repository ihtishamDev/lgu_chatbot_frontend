import { useState, useRef } from "react"

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState("")
  const [listening, setListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState("")
  const recognitionRef = useRef(null)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  function handleSend() {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText("")
    setVoiceStatus("")
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSend()
  }

  function toggleVoice() {
    if (!SpeechRecognition) { alert("Use Chrome for voice!"); return }
    listening ? stopListening() : startListening()
  }

  function startListening() {
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = true
    recognitionRef.current = recognition

    recognition.onstart = () => { setListening(true); setVoiceStatus("🎤 Listening...") }
    recognition.onend = () => setListening(false)

    recognition.onresult = (e) => {
      let transcript = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setText(transcript)
      if (e.results[e.results.length - 1].isFinal) {
        setVoiceStatus("✅ Done! Click Send.")
        setListening(false)
      } else {
        setVoiceStatus(`🎤 Hearing: "${transcript}"`)
      }
    }

    recognition.onerror = (e) => {
      setVoiceStatus("❌ " + e.error)
      setListening(false)
    }

    recognition.start()
  }

  function stopListening() {
    if (recognitionRef.current) recognitionRef.current.stop()
    setListening(false)
  }

  return (
    <div className="p-4">
      {voiceStatus && (
        <p className="text-xs text-center mb-2" style={{ color: "#8a7a75" }}>{voiceStatus}</p>
      )}
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.8)"
        }}>

        <input
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "#2d2d2d" }}
          placeholder="Ask SayHalo anything..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKey}
          disabled={disabled}
        />

        <button onClick={toggleVoice}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all"
          style={{
            background: listening ? "#ff4444" : "rgba(0,0,0,0.06)",
            animation: listening ? "pulse 1s infinite" : "none"
          }}>
          {listening ? "🔴" : "🎤"}
        </button>

        <button onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: text.trim() ? "linear-gradient(135deg, #2d2d2d, #1a1a1a)" : "rgba(0,0,0,0.1)",
            color: text.trim() ? "white" : "#8a7a75"
          }}>
          Send →
        </button>
      </div>
    </div>
  )
}