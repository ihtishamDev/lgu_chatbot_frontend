export default function MessageBubble({ message }) {
  const isUser = message.role === "user"

  function formatText(text) {
    // Clean up excessive symbols
    const cleaned = text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^\*{3,}$/gm, '')
      .replace(/^-{3,}$/gm, '')
      .replace(/^={3,}$/gm, '')

    const lines = cleaned.split('\n')

    return lines.map((line, i) => {
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-stone-800">$1</strong>')

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex gap-2 mb-1.5 items-start text-sm">
            <span className="text-orange-500 mt-0.5 flex-shrink-0 font-bold">•</span>
            <span dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^[•\-]\s*/, '') }} />
          </div>
        )
      }

      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={i} className="flex gap-2 mb-1.5 text-sm">
            <span dangerouslySetInnerHTML={{ __html: boldFormatted }} />
          </div>
        )
      }

      if (line.trim() === '') return <br key={i} />

      return (
        <div key={i} className="mb-0.5 text-sm"
          dangerouslySetInnerHTML={{ __html: boldFormatted }} />
      )
    })
  }

  return (
    <div className={`flex gap-2 md:gap-3 items-end ${isUser ? "flex-row-reverse" : ""}`}>

      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-orange-100 border-2 border-orange-300 text-orange-600">
          👤
        </div>
      ) : (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-300">
          <img src="/lgu.jpg" alt="LGU" className="w-full h-full object-cover" />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} min-w-0`}>
        <div className={`px-3 md:px-4 py-2.5 md:py-3 rounded-2xl leading-relaxed shadow-sm
          ${isUser
            ? "bg-orange-500 text-white rounded-br-sm text-sm"
            : "bg-white text-stone-700 border border-stone-200 rounded-bl-sm"}`}
          style={{ maxWidth: "min(520px, 80vw)" }}>
          {isUser ? message.text : formatText(message.text)}
        </div>

        {message.time && (
          <span className="text-xs mt-1 px-1 text-stone-400">
            {message.time}
          </span>
        )}
      </div>
    </div>
  )
}