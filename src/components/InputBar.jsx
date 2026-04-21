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

    recognition.onstart = () => { setListening(true); setVoiceStatus("Listening...") }
    recognition.onend = () => setListening(false)

    recognition.onresult = (e) => {
      let transcript = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setText(transcript)
      if (e.results[e.results.length - 1].isFinal) {
        setVoiceStatus("Done! Click Send.")
        setListening(false)
      } else {
        setVoiceStatus(`Hearing: "${transcript}"`)
      }
    }

    recognition.onerror = (e) => {
      setVoiceStatus("Error: " + e.error)
      setListening(false)
    }

    recognition.start()
  }

  function stopListening() {
    if (recognitionRef.current) recognitionRef.current.stop()
    setListening(false)
  }

  return (
    <div className="px-3 md:px-6 py-3 md:py-4 bg-white border-t border-stone-200">
      {voiceStatus && (
        <p className="text-xs text-center mb-2 text-orange-500">{voiceStatus}</p>
      )}
      <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl bg-stone-100 border border-stone-200 focus-within:border-orange-300 focus-within:shadow-md transition-all">

        <input
          className="flex-1 bg-transparent outline-none text-sm text-stone-800 placeholder-stone-400"
          placeholder="Type something..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKey}
          disabled={disabled}
        />

        <button onClick={toggleVoice}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-sm transition-all flex-shrink-0
            ${listening ? "bg-red-500 text-white" : "bg-stone-200 text-stone-500 hover:bg-stone-300"}`}>
          {listening ? "🔴" : "🎤"}
        </button>

        <button onClick={handleSend}
          disabled={!text.trim() || disabled}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all flex-shrink-0
            ${text.trim() && !disabled
              ? "bg-orange-500 text-white hover:bg-orange-400 shadow-md"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>
          ➤
        </button>
      </div>
    </div>
  )
}